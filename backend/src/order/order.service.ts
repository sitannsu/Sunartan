import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaymentService } from './payment.service';
import { CreateOrderDto, VerifyPaymentDto } from './payment.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private paymentService: PaymentService,
  ) {}

  async checkout(userId: string, createOrderDto: CreateOrderDto) {
    const { shippingAddress, paymentMethod, items } = createOrderDto;

    if (items.length === 0) {
      throw new BadRequestException('Order must contain at least one item.');
    }

    // Load user email for Stripe billing details
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // Process order inside a transaction to verify stock and insert rows atomically
    const orderResult = await this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product with ID "${item.productId}" not found.`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product "${product.title}". Only ${product.stock} left.`);
        }

        // Deduct stock
        await tx.product.update({
          where: { id: product.id },
          data: { stock: product.stock - item.quantity },
        });

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price, // Record transaction price
        });
      }

      // Create Order in PENDING state
      const createdOrder = await tx.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.UNPAID,
          paymentMethod,
          totalAmount,
          shippingAddress,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      return createdOrder;
    });

    // Create payment gateway resources
    let paymentDetails: any = null;

    if (paymentMethod === 'STRIPE') {
      paymentDetails = await this.paymentService.createStripeCheckoutSession(
        orderResult.id,
        orderResult.totalAmount,
        user.email,
      );
    } else if (paymentMethod === 'RAZORPAY') {
      paymentDetails = await this.paymentService.createRazorpayOrder(
        orderResult.id,
        orderResult.totalAmount,
      );
    } else {
      // Mock payment details
      paymentDetails = {
        id: `mock_tx_${Date.now()}`,
        url: `/checkout/success?order_id=${orderResult.id}`,
        mock: true,
      };
    }

    return {
      order: orderResult,
      paymentDetails,
    };
  }

  async verifyPayment(userId: string, verifyPaymentDto: VerifyPaymentDto) {
    const { orderId, paymentId, signature } = verifyPaymentDto;

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('Unauthorized order verification.');
    }

    if (order.paymentMethod === 'RAZORPAY') {
      const isValid = this.paymentService.verifyRazorpaySignature(
        paymentId, // Note: Razorpay uses its internal order id or custom details
        paymentId,
        signature || '',
      );
      if (!isValid) {
        throw new BadRequestException('Invalid Razorpay signature.');
      }
    }

    // Complete Order status
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.PAID,
        status: OrderStatus.COMPLETED,
        paymentId,
      },
    });

    return { success: true, order: updatedOrder };
  }

  async getCustomerOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                artisan: {
                  select: { user: { select: { name: true } } },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getArtisanOrders(userId: string) {
    const artisanProfile = await this.prisma.artisanProfile.findUnique({
      where: { userId },
    });
    if (!artisanProfile) {
      throw new BadRequestException('User does not have an Artisan Profile.');
    }

    // Load all order items containing products that belong to this artisan
    return this.prisma.order.findMany({
      where: {
        items: {
          some: {
            product: { artisanId: artisanProfile.id },
          },
        },
      },
      include: {
        user: { select: { name: true, email: true } },
        items: {
          where: {
            product: { artisanId: artisanProfile.id },
          },
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
