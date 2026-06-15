import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Increase payload limit for Base64 image uploads
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Enable CORS for Next.js frontend (default dev port 3000)
  app.enableCors({
    origin: ['http://localhost:3000', 'https://sunartn.com'],
    credentials: true,
  });

  // Enable API prefix
  app.setGlobalPrefix('api');

  // Enable class-validator validation globally
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Sunartn Backend is running on: http://localhost:${port}/api`);
}
bootstrap();
