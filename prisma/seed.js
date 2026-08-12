/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const defaultCategories = [
  { slug: 'single-origin', label: 'Single Origin' },
  { slug: 'espresso',      label: 'Espresso Blend' },
  { slug: 'filter',        label: 'Filter Blend' },
  { slug: 'turkish',       label: 'Turkish Coffee' },
  { slug: 'signature-blend', label: 'Signature Blend' },
  { slug: 'espresso-machines', label: 'Espresso Machines' },
  { slug: 'coffee-grinders', label: 'Coffee Grinders' },
  { slug: 'filter-brewing-equipment', label: 'Filter Brewing Equipment' },
  { slug: 'small-bar-equipment', label: 'Small Bar Equipment' },
  { slug: 'barista-accessories', label: 'Barista Accessories' },
  { slug: 'cleaning-products', label: 'Cleaning Products' },
];

const newProducts = [
  {
    id: 'italian-blend',
    name: 'Italian Blend',
    category: 'espresso',
    origin: 'South America & Asia Blend',
    altitude: '1000m - 1400m',
    varietal: 'Arabica / Robusta Blend',
    roastLevel: 75,
    tastingNotes: 'Strong & Intense',
    description: 'A classic dark Italian roast profile yielding a strong, full-bodied cup with rich chocolate notes and an intense crema.',
    price: 287.50,
    wholesalePrice: 750.00,
    stock: 100,
    imageUrl: '',
    videoUrl: '',
    isActive: true,
  },
  {
    id: 'espresso-gold',
    name: 'Espresso Gold',
    category: 'espresso',
    origin: 'Central & South America',
    altitude: '1200m - 1500m',
    varietal: '100% Arabica',
    roastLevel: 55,
    tastingNotes: 'Balanced & Smooth',
    description: 'Balanced espresso profile with smooth chocolate notes, toasted nuts, and a caramelized sugar sweetness.',
    price: 312.50,
    wholesalePrice: 880.00,
    stock: 100,
    imageUrl: '',
    videoUrl: '',
    isActive: true,
  },
  {
    id: 'premium-blend',
    name: 'Premium Blend',
    category: 'espresso',
    origin: 'Africa & Central America',
    altitude: '1400m - 1800m',
    varietal: '100% Arabica',
    roastLevel: 45,
    tastingNotes: 'Aromatic & Lively',
    description: 'Premium espresso blend displaying lively fruit acidity, complex aromatics, and a sweet floral finish.',
    price: 337.50,
    wholesalePrice: 990.00,
    stock: 100,
    imageUrl: '',
    videoUrl: '',
    isActive: true,
  },
  {
    id: 'velora-signature',
    name: 'Velora Signature Espresso',
    category: 'signature-blend',
    origin: 'Single Estate Micro-Lot',
    altitude: '1800m - 2100m',
    varietal: 'Heirloom Typica',
    roastLevel: 35,
    tastingNotes: 'Floral, Winey, Tropical Fruit, Honey, Bergamot',
    description: 'Exclusive limited edition signature profile with highly complex floral, winey, and tropical fruit notes. 100% Arabica.',
    price: 350.00,
    wholesalePrice: 990.00,
    stock: 50,
    imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/velora-signature.webp',
    videoUrl: '',
    isActive: true,
  },
  {
    id: 'house-blend',
    name: 'House Blend',
    category: 'filter',
    origin: 'South American Blend',
    altitude: '1100m - 1300m',
    varietal: '100% Arabica',
    roastLevel: 65,
    tastingNotes: 'Strong & Intense',
    description: 'Classic house filter blend with strong, full-bodied chocolate and toasted hazelnut notes.',
    price: 287.50,
    wholesalePrice: 750.00,
    stock: 100,
    imageUrl: '',
    videoUrl: '',
    isActive: true,
  },
  {
    id: 'special-blend',
    name: 'Special Blend',
    category: 'filter',
    origin: 'Central American Blend',
    altitude: '1300m - 1500m',
    varietal: '100% Arabica',
    roastLevel: 50,
    tastingNotes: 'Balanced & Smooth',
    description: 'A smooth daily filter blend featuring balanced chocolate and sweet caramel notes.',
    price: 325.00,
    wholesalePrice: 880.00,
    stock: 100,
    imageUrl: '',
    videoUrl: '',
    isActive: true,
  },
  {
    id: 'esto-blend',
    name: 'Esto Blend',
    category: 'filter',
    origin: 'African & South American Blend',
    altitude: '1500m - 1700m',
    varietal: '100% Arabica',
    roastLevel: 45,
    tastingNotes: 'Aromatic & Lively',
    description: 'Our signature Esto filter blend with vibrant fruit acidity and aromatic floral finish.',
    price: 337.50,
    wholesalePrice: 990.00,
    stock: 100,
    imageUrl: '',
    videoUrl: '',
    isActive: true,
  },
  {
    id: 'colombia',
    name: 'Colombia Supremo',
    category: 'single-origin',
    origin: 'Huila, Colombia',
    altitude: '1600m - 1800m',
    varietal: 'Caturra',
    roastLevel: 55,
    tastingNotes: 'Chocolate, Hazelnut, Caramel',
    description: 'Supremo grade single origin from Colombia offering classic sweet chocolate, rich hazelnut, and caramel notes.',
    price: 350.00,
    wholesalePrice: 1220.00,
    stock: 100,
    imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/colombia.webp',
    videoUrl: '',
    isActive: true,
  },
  {
    id: 'guatemala',
    name: 'Guatemala',
    category: 'single-origin',
    origin: 'Antigua, Guatemala',
    altitude: '1500m - 1700m',
    varietal: 'Bourbon, Caturra',
    roastLevel: 50,
    tastingNotes: 'Chocolate, Orange, Sweet Acidity',
    description: 'Grown in high-altitude volcanic soils, this Guatemalan origin delivers rich cocoa and sweet citrus orange finish.',
    price: 337.50,
    wholesalePrice: 1220.00,
    stock: 100,
    imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/guatemala.webp',
    videoUrl: '',
    isActive: true,
  },
  {
    id: 'kenya',
    name: 'Kenya',
    category: 'single-origin',
    origin: 'Nyeri, Kenya',
    altitude: '1700m - 1900m',
    varietal: 'SL28, SL34',
    roastLevel: 40,
    tastingNotes: 'Dark Fruit, Grape, Floral',
    description: 'Distinctive Kenyan profile with intense dark currant notes, juicy grape acidity, and a clean floral body.',
    price: 350.00,
    wholesalePrice: 1190.00,
    stock: 100,
    imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/kenya.webp',
    videoUrl: '',
    isActive: true,
  },
  {
    id: 'ethiopia',
    name: 'Etiyopya Sidamo',
    category: 'single-origin',
    origin: 'Sidamo, Ethiopia',
    altitude: '1800m - 2000m',
    varietal: 'Heirloom Typica',
    roastLevel: 35,
    tastingNotes: 'Bergamot, Citrus, Tea Notes',
    description: 'Traditional natural-processed Sidamo profile displaying sweet bergamot, lemon-lime citrus, and a black tea-like body.',
    price: 325.00,
    wholesalePrice: 1190.00,
    stock: 100,
    imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/ethiopia-sidamo.webp',
    videoUrl: '',
    isActive: true,
  },
  {
    id: 'brazil-cerrado',
    name: 'Brezilya Cerrado',
    category: 'single-origin',
    origin: 'Cerrado, Brazil',
    altitude: '900m - 1100m',
    varietal: 'Mundo Novo',
    roastLevel: 60,
    tastingNotes: 'Chocolate, Hazelnut, Low Acidity',
    description: 'Classic natural processed Cerrado crop. Very low in acidity with rich creamy chocolate and toasted hazelnut notes.',
    price: 312.50,
    wholesalePrice: 990.00,
    stock: 100,
    imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/brazil-cerrado.webp',
    videoUrl: '',
    isActive: true,
  },
  {
    id: 'brazil-mogiana',
    name: 'Brezilya Mogiana',
    category: 'single-origin',
    origin: 'Alta Mogiana, Brazil',
    altitude: '1000m - 1200m',
    varietal: 'Mundo Novo, Catuai',
    roastLevel: 55,
    tastingNotes: 'Caramel, Hazelnut, Balanced',
    description: 'Sweet, balanced Mogiana origin highlighting toasted nuts, light citrus brightness, and a caramel finish.',
    price: 325.00,
    wholesalePrice: 1170.00,
    stock: 100,
    imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/brazil-mogiana.webp',
    videoUrl: '',
    isActive: true,
  },
  {
    id: 'brazil-rio-minas',
    name: 'Brezilya Rio Minas',
    category: 'single-origin',
    origin: 'Minas Gerais, Brazil',
    altitude: '800m - 1000m',
    varietal: 'Catuai',
    roastLevel: 60,
    tastingNotes: 'Chocolate, Light Body',
    description: 'Traditional Brazilian cup, light in body and sweet in finish, with subtle cocoa notes.',
    price: 287.50,
    wholesalePrice: 880.00,
    stock: 100,
    imageUrl: 'https://fdoukqqdqllistvqxvtu.supabase.co/storage/v1/object/public/product-media/images/coffee_packs/brazil-rio-minas.webp',
    videoUrl: '',
    isActive: true,
  },
  {
    id: 'turk-kahvesi',
    name: 'Türk Kahvesi',
    category: 'turkish',
    origin: 'Brazil & Colombia Blend',
    altitude: '1000m - 1600m',
    varietal: 'Arabica',
    roastLevel: 60,
    tastingNotes: 'Rio Minas + Colombia, Fine Grind',
    description: 'Finely ground traditional Turkish coffee blend of Rio Minas and Colombian crops for a thick, rich crema.',
    price: 287.50,
    wholesalePrice: 780.00,
    stock: 100,
    imageUrl: '',
    videoUrl: '',
    isActive: true,
  },
];

async function main() {
  console.log('Cleaning up old categories...');
  const newCatSlugs = defaultCategories.map(c => c.slug);
  await prisma.category.deleteMany({
    where: {
      slug: { notIn: newCatSlugs }
    }
  });

  console.log('Seeding categories...');
  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { label: cat.label },
      create: cat,
    });
  }

  console.log('Seeding products...');
  for (const product of newProducts) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
  }

  // Clean up old products not in the new price list
  const newProductIds = newProducts.map(p => p.id);
  const deleted = await prisma.product.deleteMany({
    where: {
      id: { notIn: newProductIds }
    }
  });
  console.log(`Cleaned up ${deleted.count} old products.`);

  console.log('Seeding blog posts...');
  await prisma.blogPost.deleteMany({});
  for (const post of initialBlogPosts) {
    await prisma.blogPost.create({ data: post });
  }

  console.log('Database seeded successfully!');
}

const initialBlogPosts = [
  {
    titleEn: 'The Art of Small-Batch Roasting',
    titleTr: 'Küçük Ölçekli Kahve Kavurma Sanatı',
    contentEn: 'Roasting coffee is a bridge between science and intuition. At The Coffee Esto Roastery, we analyze variables like drum temperature, airflow, and roasting speed to craft the perfect heat curve for every single origin. Each batch is roasted in small quantities to maintain uniform heat transfer, ensuring that the subtle floral notes, chocolate richness, and sweet caramel accents of the beans are fully drawn out without bitterness. Regular cupping sessions verify that each package represents our meticulous quality standards.',
    contentTr: 'Kahve kavurmak, bilim ve sezgi arasında bir köprüdür. The Coffee Esto Roastery\'de, her bir tek yöre kahve için en uygun sıcaklık eğrisini tasarlamak üzere tambur sıcaklığı, hava akışı ve kavurma hızı gibi değişkenleri analiz ediyoruz. Homojen ısı transferini korumak için her parti küçük miktarlarda kavrulur. Bu sayede çekirdeklerin hafif çiçeksi notaları, çikolata zenginliği ve tatlı karamel aromaları acılık oluşturmadan tamamen ortaya çıkarılır. Düzenli tadım (cupping) seanslarımız, her paketin titiz kalite standartlarımızı temsil ettiğini doğrular.',
    category: 'techniques',
    imageUrl: '/images/blog/roaster.png',
  },
  {
    titleEn: 'Guide to Perfect V60 Pour Over',
    titleTr: 'Adım Adım Kusursuz V60 Demleme Rehberi',
    contentEn: 'To brew a clean, aromatic cup of V60 filter coffee, begin by preheating your dripper and rinsing the paper filter with hot water to remove any paper taste. Weigh 15 grams of freshly ground coffee (medium-fine grind) and use 250 grams of water heated to 92-94°C. Start with a 45-second bloom using 50g of water to release trapped gases. Slowly pour the remaining water in gentle circular motions, keeping the water level stable. Total brew time should be between 2:30 and 3:00 minutes. Enjoy the vibrant fruit acidity and clean cup profile!',
    contentTr: 'Berrak ve aromatik bir V60 filtre kahve demlemek için, damlatıcıyı önceden ısıtarak ve kâğıt filtreyi sıcak suyla durulayarak başlayın. 15 gram taze öğütülmüş kahve (orta-ince öğütüm) tartın ve 92-94°C sıcaklıktaki 250 gram su kullanın. Sıkışmış gazları salmak için 50g su ile 45 saniyelik bir ön demleme (çiçeklenme) başlatın. Kalan suyu, su seviyesini dengede tutarak dairesel hareketlerle yavaşça dökün. Toplam demleme süresi 2:30 ile 3:00 dakika arasında olmalıdır. Canlı meyve asiditesinin ve temiz fincan profilinin tadını çıkarın!',
    category: 'guides',
    imageUrl: '/images/blog/beans.png',
  },
  {
    titleEn: 'Sourcing Micro-Lots Directly from Origin',
    titleTr: 'Mikro Lot Kahveleri Doğrudan Çiftlikten Tedarik Etmek',
    contentEn: 'Our mission is to establish sustainable relationships with smallholder farmers across South America and Africa. By sourcing direct-trade micro-lots, we bypass corporate brokers and pay premiums directly to the growers. This ensures full crop traceability, guarantees fair pay, and supports local community infrastructure. When you drink a cup of Coffee Esto, you are tasting a unique harvest cultivated with extraordinary effort and care, roasted to perfection in our İstanbul roastery.',
    contentTr: 'Misyonumuz, Güney Amerika ve Afrika genelindeki küçük ölçekli çiftçilerle sürdürülebilir ilişkiler kurmaktır. Doğrudan ticaret mikro lotları tedarik ederek, kurumsal aracıları devre dışı bırakıyor ve primleri doğrudan üreticilere ödüyoruz. Bu, tam ürün izlenebilirliği sağlar, adil ödemeyi garanti eder ve yerel topluluk altyapısını destekler. Bir fincan Coffee Esto içtiğinizde, İstanbul\'daki kavurmahanemizde mükemmel bir şekilde kavrulmuş, olağanüstü emek ve özenle yetiştirilmiş benzersiz bir hasadı tadıyorsunuz.',
    category: 'culture',
    imageUrl: '/images/blog/fields.png',
  }
];

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
