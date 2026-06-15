import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';
import { OrderController } from './order.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PaymentService, PrismaService],
  exports: [OrderService, PaymentService],
})
export class OrderModule {}
