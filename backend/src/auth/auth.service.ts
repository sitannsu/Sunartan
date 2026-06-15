import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { SignupDto, SigninDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: signupDto.email },
    });
    if (existing) {
      throw new ConflictException('A user with this email address already exists.');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    const role = signupDto.role || Role.CUSTOMER;

    // Create user in transaction to handle potential ArtisanProfile creation
    const user = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: signupDto.email,
          name: signupDto.name,
          password: hashedPassword,
          role,
        },
      });

      if (role === Role.ARTISAN) {
        await tx.artisanProfile.create({
          data: {
            userId: createdUser.id,
            bio: signupDto.bio || 'Honoring tradition and bringing handcrafted beauty to global collectors.',
            region: signupDto.region || 'Unknown Region',
            craft: signupDto.craft || 'General Crafts',
            isVerified: false,
          },
        });
      }

      return createdUser;
    });

    const token = this.generateToken(user);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  async signin(signinDto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: signinDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const validPassword = await bcrypt.compare(signinDto.password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const token = this.generateToken(user);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  private generateToken(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }
}
