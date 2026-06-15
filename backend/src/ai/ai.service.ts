import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async consult(text: string, conversationId?: string) {
    // 1. Fetch available products to suggest
    const products = await this.prisma.product.findMany({
      include: {
        artisan: {
          select: { user: { select: { name: true } } },
        },
      },
    });

    const lowerQuery = text.toLowerCase();
    let recommendedProducts = [];

    // Simple keyword matching against products in our DB
    if (lowerQuery.includes('pot') || lowerQuery.includes('ceramic') || lowerQuery.includes('bowl') || lowerQuery.includes('earth')) {
      recommendedProducts = products.filter(p => p.craft.toLowerCase() === 'pottery');
    } else if (lowerQuery.includes('box') || lowerQuery.includes('brass') || lowerQuery.includes('metal')) {
      recommendedProducts = products.filter(p => p.craft.toLowerCase().includes('metal'));
    } else if (lowerQuery.includes('gift') || lowerQuery.includes('collection')) {
      recommendedProducts = products.slice(0, 2);
    } else {
      // Default fallback: return first 2 products
      recommendedProducts = products.slice(0, 2);
    }

    // Determine if keys are available to fetch dynamic completions
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    let aiText = '';

    if (geminiKey) {
      // Real Gemini API call simulation / implementation
      try {
        // We can do a fetch to the official Gemini API endpoint
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are the digital concierge for Sunartn, a premium luxury artisan marketplace. The customer is asking: "${text}". Recommend some of these products: ${JSON.stringify(
                        recommendedProducts.map(p => ({ title: p.title, description: p.description, price: p.price, artisan: p.artisan.user.name })),
                      )}. Write a sophisticated, elegant, Aesop-inspired reply recommending them. Do not use markdown headers, just print a short paragraph with quotes.`,
                    },
                  ],
                },
              ],
            }),
          },
        );
        const data = await response.json();
        aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } catch (e) {
        console.warn('AiService: Gemini API failed, using standard template.');
      }
    }

    if (!aiText && openaiKey) {
      // Real OpenAI API call
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are the digital concierge for Sunartn, a luxury artisan marketplace. Be sophisticated, minimal, and Aesop-inspired.',
              },
              {
                role: 'user',
                content: `The customer asks: "${text}". Recommend: ${JSON.stringify(recommendedProducts.map(p => p.title))}. Return a short paragraphs with recommendations.`,
              },
            ],
          }),
        });
        const data = await response.json();
        aiText = data.choices?.[0]?.message?.content || '';
      } catch (e) {
        console.warn('AiService: OpenAI API failed.');
      }
    }

    // High fidelity template fallbacks if no API key is specified or requests fail
    if (!aiText) {
      if (lowerQuery.includes('pot') || lowerQuery.includes('ceramic') || lowerQuery.includes('bowl') || lowerQuery.includes('earth')) {
        aiText = `"A dining room is the heart of slow living. For earth tones that bridge the gap between soil and stone, I recommend looking towards the textured stoneware and hand-fired vessels. I've curated a few centerpiece bowls that speak to that raw, organic silhouette you're describing."`;
      } else if (lowerQuery.includes('box') || lowerQuery.includes('brass') || lowerQuery.includes('metal')) {
        aiText = `"Metal and fire create the structures of heritage. For storage that holds history as well as objects, I recommend our hand-engraved heirloom brass collection. The floral motifs speak of timeless craftsmanship."`;
      } else {
        aiText = `"To curate a home is to gather stories. Based on your appreciation for mindful luxury, I suggest exploring our featured artisan pottery and metal crafts. Each creation carries the weight of its origin."`;
      }
    }

    // Save message to conversation if conversationId exists
    if (conversationId) {
      await this.prisma.message.create({
        data: {
          conversationId,
          sender: 'USER',
          text,
        },
      });

      await this.prisma.message.create({
        data: {
          conversationId,
          sender: 'AI',
          text: aiText,
          recommendedJson: JSON.stringify(recommendedProducts),
        },
      });
    }

    return {
      text: aiText,
      products: recommendedProducts,
    };
  }

  async planStudioCollection(theme: string) {
    const products = await this.prisma.product.findMany({
      include: { artisan: { select: { user: { select: { name: true } } } } },
    });

    const lowerTheme = theme.toLowerCase();
    let selectedProducts = [];

    if (lowerTheme.includes('clay') || lowerTheme.includes('earth') || lowerTheme.includes('ceramic')) {
      selectedProducts = products.filter(p => p.craft.toLowerCase() === 'pottery');
    } else {
      selectedProducts = products.slice(0, 3);
    }

    let description = '';
    let visualDirection = '';

    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Generate a luxury collection plan for Sunartn based on the theme "${theme}". Return a JSON object with: { "title": "...", "description": "...", "visualDirection": "..." }`,
                    },
                  ],
                },
              ],
            }),
          },
        );
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        // extract json block
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            title: parsed.title || `${theme} Collection`,
            description: parsed.description,
            visualDirection: parsed.visualDirection,
            products: selectedProducts,
          };
        }
      } catch (e) {
        console.warn('AiService: Failed to parse Gemini response for studio collection.');
      }
    }

    // Fallback Mock data
    if (lowerTheme.includes('clay') || lowerTheme.includes('earth') || lowerTheme.includes('ceramic')) {
      description = 'A curated design theme celebrating the grounding energy of hand-fired terracotta. Highlighting the tactile irregularities of raw clay combined with elegant minimal glazes.';
      visualDirection = 'Parchment and terracotta backdrops, soft morning lighting, focus on organic textures and hand-shaped contours.';
    } else {
      description = `An editorial theme exploring "${theme}", uniting global artisan sensibilities with modern minimal layouts.`;
      visualDirection = 'Generous whitespace, warm ambient shadows, high-contrast details and rich historical materials.';
    }

    return {
      title: `${theme.charAt(0).toUpperCase() + theme.slice(1)} Collection`,
      description,
      visualDirection,
      products: selectedProducts,
    };
  }

  async getConversationHistory(userId: string) {
    // Find or create a conversation for the user
    let conversation = await this.prisma.conversation.findFirst({
      where: { userId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: { userId },
        include: {
          messages: { orderBy: { createdAt: 'asc' } },
        },
      });
    }

    return conversation;
  }
}
