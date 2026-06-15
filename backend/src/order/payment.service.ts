import { Injectable, OnModuleInit } from '@nestjs/common';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService implements OnModuleInit {
  private stripeClient: any = null;
  private razorpayClient: any = null;
  private isStripeMock = true;
  private isRazorpayMock = true;

  onModuleInit() {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey && !stripeKey.includes('mock')) {
      this.stripeClient = new Stripe(stripeKey, {
        apiVersion: '2025-01-27' as any,
      });
      this.isStripeMock = false;
      console.log(
        'PaymentService: Stripe client initialized (Live/Test mode).',
      );
    } else {
      console.log('PaymentService: Stripe in Mock mode.');
    }

    const rzpId = process.env.RAZORPAY_KEY_ID;
    const rzpSecret = process.env.RAZORPAY_KEY_SECRET;
    if (rzpId && rzpSecret && !rzpId.includes('mock')) {
      this.razorpayClient = new Razorpay({
        key_id: rzpId,
        key_secret: rzpSecret,
      });
      this.isRazorpayMock = false;
      console.log(
        'PaymentService: Razorpay client initialized (Live/Test mode).',
      );
    } else {
      console.log('PaymentService: Razorpay in Mock mode.');
    }
  }

  async createStripeCheckoutSession(
    orderId: string,
    amount: number,
    customerEmail: string,
  ) {
    if (this.isStripeMock || !this.stripeClient) {
      return {
        id: `sess_mock_${crypto.randomBytes(8).toString('hex')}`,
        url: `http://localhost:3000/checkout/success?session_id=mock_${orderId}`,
        mock: true,
      };
    }

    try {
      const session = await this.stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Order #${orderId.substring(0, 8)}`,
                description: 'Unique Handcrafted Treasures from Sunartn',
              },
              unit_amount: Math.round(amount * 100), // In cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
        cancel_url: `http://localhost:3000/checkout/cancel?order_id=${orderId}`,
        customer_email: customerEmail,
        metadata: { orderId },
      });

      return { id: session.id, url: session.url, mock: false };
    } catch (error) {
      console.error(
        'PaymentService: Stripe Session creation failed:',
        error.message,
      );
      throw error;
    }
  }

  async createRazorpayOrder(orderId: string, amount: number) {
    if (this.isRazorpayMock || !this.razorpayClient) {
      return {
        id: `order_mock_${crypto.randomBytes(8).toString('hex')}`,
        amount: Math.round(amount * 100), // In paise
        currency: 'INR',
        mock: true,
      };
    }

    try {
      const options = {
        amount: Math.round(amount * 100), // amount in the smallest currency unit
        currency: 'INR',
        receipt: `receipt_${orderId.substring(0, 8)}`,
        notes: { orderId },
      };
      const order = await this.razorpayClient.orders.create(options);
      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        mock: false,
      };
    } catch (error) {
      console.error(
        'PaymentService: Razorpay Order creation failed:',
        error.message,
      );
      throw error;
    }
  }

  verifyRazorpaySignature(
    orderId: string,
    paymentId: string,
    signature: string,
  ): boolean {
    if (this.isRazorpayMock) {
      return true; // Auto-verify in mock mode
    }

    try {
      const secret = process.env.RAZORPAY_KEY_SECRET || '';
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(`${orderId}|${paymentId}`);
      const generatedSignature = hmac.digest('hex');
      return generatedSignature === signature;
    } catch (error) {
      console.error(
        'PaymentService: Signature verification failed:',
        error.message,
      );
      return false;
    }
  }
}
