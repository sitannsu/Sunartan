import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is missing.');
    }
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({ adapter });
    this.pool = pool;
  }

  async onModuleInit() {
    // Connection is handled lazily, but let's test database connectivity
    try {
      const client = await this.pool.connect();
      client.release();
      console.log(
        'PrismaService: Connected to PostgreSQL database successfully via Driver Adapter.',
      );
    } catch (error) {
      console.error('PrismaService: Failed to connect to database:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
    console.log('PrismaService: Database pool closed.');
  }
}
