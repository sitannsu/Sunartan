import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SearchService } from './search.service';
import {
  CreateProductDto,
  CreateReviewDto,
  ProductQueryDto,
} from './product.dto';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private searchService: SearchService,
  ) {}

  async findAll(query: ProductQueryDto) {
    const { search, category, subcategory, region, craft, minPrice, maxPrice } = query;

    // 1. Try Meilisearch search first if query exists
    if (search) {
      const meiliHits = await this.searchService.searchProducts(search, {
        category,
        subcategory,
        region,
        craft,
        minPrice,
        maxPrice,
      });

      if (meiliHits !== null) {
        return meiliHits;
      }
    }

    // 2. Fallback to Prisma database search
    const where: any = {};
    if (category) where.category = category;
    if (subcategory) where.subcategory = subcategory;
    if (region) where.region = region;
    if (craft) where.craft = craft;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.product.findMany({
      where,
      include: {
        artisan: {
          select: {
            user: { select: { name: true } },
            region: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        artisan: {
          select: {
            id: true,
            bio: true,
            region: true,
            craft: true,
            avatarUrl: true,
            studioLocation: true,
            user: { select: { name: true } },
          },
        },
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found.`);
    }

    return product;
  }

  async create(userId: string, createProductDto: CreateProductDto) {
    let artisanProfile = await this.prisma.artisanProfile.findUnique({
      where: { userId },
    });

    if (!artisanProfile) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user?.role === 'ADMIN') {
        artisanProfile = await this.prisma.artisanProfile.findFirst();
      }
    }

    if (!artisanProfile) {
      throw new ForbiddenException(
        'You must have an Artisan Profile to list products.',
      );
    }

    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        artisanId: artisanProfile.id,
      },
    });

    // Sync in search index
    await this.searchService.indexProduct(product);

    return product;
  }

  async update(
    id: string,
    userId: string,
    updateProductDto: Partial<CreateProductDto>,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { artisan: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    if (product.artisan.userId !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.role !== 'ADMIN') {
        throw new ForbiddenException('You can only update your own products.');
      }
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });

    await this.searchService.indexProduct(updated);
    return updated;
  }

  async remove(id: string, userId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { artisan: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    if (product.artisan.userId !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.role !== 'ADMIN') {
        throw new ForbiddenException('You can only delete your own products.');
      }
    }

    await this.prisma.product.delete({ where: { id } });
    await this.searchService.deleteProduct(id);
    return { success: true };
  }

  // Review Sub-methods
  async addReview(
    productId: string,
    userId: string,
    createReviewDto: CreateReviewDto,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    const review = await this.prisma.review.create({
      data: {
        productId,
        userId,
        ...createReviewDto,
      },
    });

    // Update Product average rating
    const reviews = await this.prisma.review.findMany({ where: { productId } });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await this.prisma.product.update({
      where: { id: productId },
      data: { rating: Number(avgRating.toFixed(1)) },
    });

    return review;
  }

  // Artisan details
  async findArtisans() {
    return this.prisma.artisanProfile.findMany({
      include: {
        user: { select: { name: true } },
      },
      orderBy: { rating: 'desc' },
    });
  }

  async findArtisanDetail(id: string) {
    let profile = await this.prisma.artisanProfile.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        products: true,
        collections: {
          include: {
            items: { include: { product: true } },
          },
        },
      },
    });

    if (!profile) {
      profile = await this.prisma.artisanProfile.findUnique({
        where: { userId: id },
        include: {
          user: { select: { name: true, email: true } },
          products: true,
          collections: {
            include: {
              items: { include: { product: true } },
            },
          },
        },
      });
    }

    if (!profile) {
      throw new NotFoundException('Artisan profile not found.');
    }

    return profile;
  }

  async updateArtisanProfile(userId: string, data: any) {
    const profile = await this.prisma.artisanProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new NotFoundException('Artisan profile not found.');
    }

    return this.prisma.artisanProfile.update({
      where: { userId },
      data,
    });
  }

  async verifyArtisan(id: string, isVerified: boolean) {
    const profile = await this.prisma.artisanProfile.findUnique({
      where: { id },
    });
    if (!profile) {
      throw new NotFoundException('Artisan profile not found.');
    }

    return this.prisma.artisanProfile.update({
      where: { id },
      data: { isVerified },
    });
  }
}
