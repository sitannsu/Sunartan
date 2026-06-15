import { Injectable, OnModuleInit } from '@nestjs/common';
import { Meilisearch } from 'meilisearch';

@Injectable()
export class SearchService implements OnModuleInit {
  private client: Meilisearch | null = null;
  private index: any = null;
  private readonly indexUid = 'products';

  async onModuleInit() {
    const host = process.env.MEILI_HOST || 'http://localhost:7700';
    const apiKey = process.env.MEILI_API_KEY || '';

    try {
      this.client = new Meilisearch({ host, apiKey });
      // Create index if it does not exist
      this.index = this.client.index(this.indexUid);

      // Try a ping check to verify connection
      await this.client.health();
      console.log('SearchService: Connected to Meilisearch successfully.');

      // Configure settings for product searching
      if (this.index) {
        await this.index.updateSettings({
          searchableAttributes: [
            'title',
            'description',
            'region',
            'craft',
            'category',
          ],
          filterableAttributes: ['region', 'craft', 'category', 'price'],
          sortableAttributes: ['price', 'createdAt'],
        });
      }
    } catch (error) {
      console.warn(
        'SearchService: Could not connect to Meilisearch. Fallback to Prisma database search active.',
        error.message,
      );
      this.client = null;
      this.index = null;
    }
  }

  async indexProduct(product: any) {
    if (!this.index) return;
    try {
      await this.index.addDocuments([
        {
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
          region: product.region,
          craft: product.craft,
          rating: product.rating,
          images: product.images,
          artisanId: product.artisanId,
          createdAt: product.createdAt,
        },
      ]);
    } catch (error) {
      console.error(
        'SearchService: Failed to index product in Meilisearch:',
        error.message,
      );
    }
  }

  async deleteProduct(productId: string) {
    if (!this.index) return;
    try {
      await this.index.deleteDocument(productId);
    } catch (error) {
      console.error(
        'SearchService: Failed to delete product in Meilisearch:',
        error.message,
      );
    }
  }

  async searchProducts(query: string, filters?: any) {
    if (!this.index) {
      return null; // Signals fallback to database search
    }
    try {
      const filterArray: string[] = [];
      if (filters?.category)
        filterArray.push(`category = "${filters.category}"`);
      if (filters?.region) filterArray.push(`region = "${filters.region}"`);
      if (filters?.craft) filterArray.push(`craft = "${filters.craft}"`);
      if (filters?.minPrice) filterArray.push(`price >= ${filters.minPrice}`);
      if (filters?.maxPrice) filterArray.push(`price <= ${filters.maxPrice}`);

      const results = await this.index.search(query, {
        filter: filterArray.length > 0 ? filterArray.join(' AND ') : undefined,
        limit: 20,
      });
      return results.hits;
    } catch (error) {
      console.error(
        'SearchService: Meilisearch query error, falling back:',
        error.message,
      );
      return null;
    }
  }
}
