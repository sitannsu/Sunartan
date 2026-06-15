import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Role } from '@prisma/client';

export class SignupDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role must be CUSTOMER or ARTISAN' })
  role?: Role;

  // Optional Artisan Profile Details on signup
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  craft?: string;
}

export class SigninDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
