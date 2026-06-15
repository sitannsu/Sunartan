import 'dotenv/config';
import { PrismaClient, Role, OrderStatus, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.collectionItem.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.product.deleteMany();
  await prisma.artisanProfile.deleteMany();
  await prisma.user.deleteMany();

  // Hash passwords
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@sunartn.com',
      name: 'Sunartn Admin',
      password: passwordHash,
      role: Role.ADMIN,
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      email: 'collector@sunartn.com',
      name: 'Sarah Williams',
      password: passwordHash,
      role: Role.CUSTOMER,
    },
  });

  const artisanUser1 = await prisma.user.create({
    data: {
      email: 'elena@sunartn.com',
      name: 'Elena Varga',
      password: passwordHash,
      role: Role.ARTISAN,
    },
  });

  const artisanUser2 = await prisma.user.create({
    data: {
      email: 'rameshwar@sunartn.com',
      name: 'Rameshwar Lal',
      password: passwordHash,
      role: Role.ARTISAN,
    },
  });

  console.log('Users created.');

  // 2. Create Artisan Profiles
  const elenaProfile = await prisma.artisanProfile.create({
    data: {
      userId: artisanUser1.id,
      bio: 'My work is a dialogue between the clay of the Carpathian mountains and the modern dining space. I believe objects should carry the weight of their origin.',
      region: 'Carpathians',
      craft: 'Pottery',
      studioLocation: 'Studio Arhos, Brasov',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJX_nH22T2-RjyZUMhrkltf9x0YFYXub9DwtWw2wDMpTH-C_8OcQL6zYoeTE_LWAaxi-IPIYBAAkXFjNsUtRobv_4BzloAPNt2mwRkuhsJG7qvruVpKboMvYPGMvAiOS7Ja1d1Zh-1jm0SNvG--Jlq3CZ0RQ9fRJYs0l4yeInUj0t0Kxmz_LPBsM5UCfw4hZXpel5p1R2ldSwdZ49cQU4aDBRrPKsNFAOfqU2eTfA9jqXiCB0A8kCdzPm1L0N5hOLY2FWrc2fegaI',
      bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBlBQzK5R-QW4ZwqjW9Y6WK6GxgsEDXwYOHrTAvqZEggusZZ1weJAEp29_ct77Rmg0RkOL-SrG7La3xZbhGaDgnmiH2p-OF0mdgxAc28M-w9CbETDRR_QFDpdJNQPXNylbwYqUpnUQ4nXivrx8j-0Hgf-5KBs46sugdeV3z1rgjaB8x56Ygwkt1fUVMn63L5zuvaYToAwTgpwQQ9w0tx8KjO0gbATA0oSo6ObaJJz5OOkMdQxgmbz1wlRUUO4q0eEkR_xYsBDb2Us',
      rating: 4.9,
      isVerified: true,
    },
  });

  const rameshwarProfile = await prisma.artisanProfile.create({
    data: {
      userId: artisanUser2.id,
      bio: 'The earth tells me what it wants to become. I am simply the hands that listen. রমেশ্বর has been practicing the art of Molela terracotta for 45 years in rural Rajasthan.',
      region: 'Rajasthan',
      craft: 'Pottery',
      studioLocation: 'Molela village, Rajsamand',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGz-nNdPOy8GhcejfvOkRg1b2O2k71vpffWzcBp2us2yOm2Y8w3PYR24ZIUK7139f7D_E3daiPt22nDslx6e7ROl7F4P41Bsrre4yBAKEmcaqa9mOh-dAnzqxg0iihOA78n1pD3pBXbGhYMXXiUhW84dRkAaWSbDkKygynAWqs_H8opUxqQX5cRBjnb4xvlD74hNWGBhwvaE7EZl6h0GG2-ksg1Nsssp0e0cgPv-lWmbSzuLhOOWCnKsptZDpfV31ZuoySkJ72nFo',
      bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVkDI3tevjt5mDM38Lp7b_HdUNOBw0THh-245ZfcizYySmg5hgNeQpRvZmfHRmL3mMoGX8O4s6Wg7AA0Bytn5kCUnVn-kaLhW6bXDYH6RiEr-yYEZvzNVL-Jriu5rXQGlHJpWdkyZLKkprBl7l0SDqCGG5aoLwIMiCSDyuKoKs01nYhtRy-ICb892pkK_Iojrmf8mJYAp7I7OhYQhA2u6dUL7Us6-Z8Jt7O9QxeTKB6fBeBPaF6Gp5vCN6SN5Y0zh5NZNCqUhmU7A',
      rating: 4.8,
      isVerified: true,
    },
  });

  console.log('Artisan Profiles created.');

  // 3. Create Products
  const p1 = await prisma.product.create({
    data: {
      title: 'Umber Earth Bowl',
      description: 'Hand-fired using ancient reduction techniques to achieve a deep, multidimensional terracotta hue that shifts in the light.',
      price: 340,
      stock: 5,
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB8KWwq2AoBngRwk0_31NrPEIiFH2tJCh-Pmmp7aO7dnUw0Q8rswFDGoaPsg-I6-09Xhl50ia5iIcq6eg-n0iRMyrCdRs3YqYhFvwjqZw2mG19qReD6UPRa6BtDoIkhqrTQ-NaEDjA3I0LPsJyf7jpa2M8mWMl4ZGVr90frlrSitTagGUViuwAZaQrcSU1KnmESKGRD4ScGWEpjoRZCFgpJBsEp1OHIriCd5C1ibtF5uAzN0B-VWvGAoboGuzc2_8-7nYPvjsgRomo'
      ],
      category: 'Vases',
      region: 'Rajasthan',
      craft: 'Pottery',
      rating: 4.9,
      artisanId: elenaProfile.id,
    },
  });

  const p2 = await prisma.product.create({
    data: {
      title: 'Ochre Horizon Vessel',
      description: 'A sculptural piece that doubles as a functional centerpiece, featuring a sand-infused glaze for tactile depth.',
      price: 520,
      stock: 3,
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuApLdVRWT91TBj3t1ixezSR9uU0G2vRG4w-Bx_ISZNnBHUb8ytjGcTvT6MwMNSqD7_Xqvn0vcijv_4YyQkeMkA6ptoQ-bDi930jZi1atDZJkUxlvmNhlc4eGmDsBdHfFJLm8E-D7vYB4Kn8etTzTt-CNENr3RhFPxqars1WIpIBiQAPONV_9mhIZXe-TTRhlzsiDYCDPKk1_S2CM89N-t-9HfPnsd9cqdR-RqYBZAVoXK9WkkxMpM9d9y6z2xLnVL2NEZ_X5KToIGI'
      ],
      category: 'Vases',
      region: 'Carpathians',
      craft: 'Pottery',
      rating: 4.8,
      artisanId: elenaProfile.id,
    },
  });

  const p3 = await prisma.product.create({
    data: {
      title: 'Sienna Earth Vessel',
      description: 'A high-end editorial pottery item with a unique matte finish and organic silhouette, representing slow craft.',
      price: 150,
      stock: 12,
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuABcubTNztmfQLwaV9a0DHCTHAHeV48--PL01ObXgk0zE9VJtV3-GDe4m1Qb4MFK5fpo8JAm3f8NsAeiRClrvbWmldVB2eFzKHDg2BSNoHqoOUNLKj2pox36b6DGotHjILKI5Q3BO3qZlsM-kW2LOOvP2jClI9CawGaBtfLkZq5gQfF_dYbx2cvYDQD-tiJNnz3rLjNQF1KqZYjkDrclbbK20eQrfO25urHynErrY6NJnvZ_jZHmci9aEn4PawJL_dRP0bpO2jXtpc'
      ],
      category: 'Vases',
      region: 'Rajasthan',
      craft: 'Pottery',
      rating: 4.7,
      artisanId: rameshwarProfile.id,
    },
  });

  const p4 = await prisma.product.create({
    data: {
      title: 'Engraved Heirloom Box',
      description: 'Detailed studio image of a handcrafted brass storage box with intricate hand-engraved floral motifs and gold finish.',
      price: 240,
      stock: 8,
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDigWYsguELBsQ0LWVQ7bKpDSZR7GQ-nFpPP6xjOn7hSyyUHheT9nQ_tvVQweJ4per136tPe-BQeK6K6kBJPXC0meWLU_4kvU6NHfjxJwBsjTdI293bpZpBhGEFbc8PidVddv-GljkwkLZfTNYgKDq90VXIHKzObOXrQ084pQwes6da2-RjDmXo83CfOiBzAQJFaeCZyMPM2cEc9oxBo3zM5E83BUC7e14oIMEyYmN_m0WsH5UYvMSgkbaBj4PIfTq_g1KcRR5bgm4'
      ],
      category: 'Metal Crafts',
      region: 'Rajasthan',
      craft: 'Metal Crafts',
      rating: 5.0,
      artisanId: rameshwarProfile.id,
    },
  });

  console.log('Products created.');

  // 4. Create Reviews
  await prisma.review.create({
    data: {
      productId: p1.id,
      userId: customerUser.id,
      rating: 5,
      comment: 'The detail in the pottery I ordered is breathtaking. You can really feel the artisans touch in every curve.',
    },
  });

  // 5. Create Collections
  const col = await prisma.collection.create({
    data: {
      title: 'Earth & Clay',
      description: 'A curated collection of functional earthenware that captures the grounding energy of volcanic ash and raw umber clay.',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbQ5ZDR78tChwhNZceYHducfnbrTED0DVIzWi0fsPET7dR3yFwsBncmLiss7Eig4q23Jy6lPPWGtQlJXAfbyVvmy3e2qma_rS0uFqMW8_PS3jo4dpvk_Q0MRAJ4FPGAEe2gHHccn0tDB8t6YKP4pibBYHxS-PnlzDy5N-9WRl91jWYlEbKPuqv1KGNEi1KuLVHMbjIHSMZy4CcSbzcL04Osv-1YOUMJuylM-8S5XmN5MLeyxPzPIIuBUQXDv9PYQc18grrG_Cbcu4',
      artisanId: elenaProfile.id,
    },
  });

  await prisma.collectionItem.create({
    data: {
      collectionId: col.id,
      productId: p1.id,
    },
  });

  await prisma.collectionItem.create({
    data: {
      collectionId: col.id,
      productId: p2.id,
    },
  });

  // 6. Create conversations & messages
  const conv = await prisma.conversation.create({
    data: {
      userId: customerUser.id,
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conv.id,
      sender: 'USER',
      text: "I'm looking for earth-toned ceramics for my dining room. Something that feels organic and handcrafted.",
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conv.id,
      sender: 'AI',
      text: 'A dining room is the heart of slow living. For earth tones that bridge the gap between soil and stone, I recommend looking towards the textured stoneware of the Peak District. I\'ve curated a few pieces that speak to that raw, organic silhouette you\'re describing.',
      recommendedJson: JSON.stringify([p1, p2]),
    },
  });

  // 7. Create mock orders
  const ord = await prisma.order.create({
    data: {
      userId: customerUser.id,
      status: OrderStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: 'MOCK',
      paymentId: 'ch_mock_12345',
      totalAmount: 490,
      shippingAddress: '123 Fine Arts Blvd, New York, NY 10001',
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: ord.id,
      productId: p1.id,
      quantity: 1,
      price: 340,
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: ord.id,
      productId: p3.id,
      quantity: 1,
      price: 150,
    },
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.log('Error during seed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
