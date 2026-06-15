import { Controller, Post, Put, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, VerifyPaymentDto } from './payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, OrderStatus } from '@prisma/client';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async checkout(@Request() req: any, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.checkout(req.user.id, createOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  async verifyPayment(@Request() req: any, @Body() verifyPaymentDto: VerifyPaymentDto) {
    return this.orderService.verifyPayment(req.user.id, verifyPaymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('customer')
  async getCustomerOrders(@Request() req: any) {
    return this.orderService.getCustomerOrders(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ARTISAN)
  @Get('artisan')
  async getArtisanOrders(@Request() req: any) {
    return this.orderService.getArtisanOrders(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ARTISAN, Role.ADMIN)
  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.orderService.updateOrderStatus(id, status);
  }
}
