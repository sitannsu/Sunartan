import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  Min,
  IsArray,
  IsOptional,
  Max,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  region: string;

  @IsNotEmpty()
  @IsString()
  craft: string;
}

export class CreateReviewDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsString()
  comment: string;
}

export class ProductQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  craft?: string;

  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;
}
