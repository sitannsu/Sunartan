import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  CreateReviewDto,
  ProductQueryDto,
} from './product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async findAll(@Query() query: ProductQueryDto) {
    return this.productService.findAll(query);
  }

  @Get('artisans')
  async findArtisans() {
    return this.productService.findArtisans();
  }

  @Get('artisans/:id')
  async findArtisanDetail(@Param('id') id: string) {
    return this.productService.findArtisanDetail(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ARTISAN, Role.ADMIN)
  @Post()
  async create(
    @Request() req: any,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.create(req.user.id, createProductDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ARTISAN, Role.ADMIN)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateProductDto: Partial<CreateProductDto>,
  ) {
    return this.productService.update(id, req.user.id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ARTISAN, Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.productService.remove(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @Post(':id/reviews')
  async addReview(
    @Param('id') id: string,
    @Request() req: any,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.productService.addReview(id, req.user.id, createReviewDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ARTISAN)
  @Put('profile/me')
  async updateProfile(@Request() req: any, @Body() profileData: any) {
    return this.productService.updateArtisanProfile(req.user.id, profileData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('artisans/:id/verify')
  async verifyArtisan(
    @Param('id') id: string,
    @Body('isVerified') isVerified: boolean,
  ) {
    return this.productService.verifyArtisan(id, isVerified);
  }
}
