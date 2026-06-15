import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SearchService } from './search.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, SearchService, PrismaService],
  exports: [ProductService, SearchService],
})
export class ProductModule {}
