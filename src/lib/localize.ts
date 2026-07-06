export interface LocalizedProduct {
  id: string;
  name: string;
  category: string;
  origin: string;
  altitude: string;
  varietal: string;
  roastLevel: number;
  tastingNotes: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  videoUrl: string;
  isActive: boolean;
}

const translations: Record<string, Record<string, { name: string; origin: string; tastingNotes: string; description: string }>> = {
  'italian-blend': {
    en: {
      name: 'Italian Blend',
      origin: 'South America & Asia Blend',
      tastingNotes: 'Cocoa, Cedar, Heavy Body',
      description: 'A bold, dark-roasted masterpiece crafted for the traditionalist. This classic blend yields a heavy-bodied cup with notes of rich dark chocolate, toasted cedarwood, and an ultra-dense golden crema.',
    },
    tr: {
      name: 'İtalyan Blend',
      origin: 'Güney Amerika ve Asya',
      tastingNotes: 'Kakao, Sedir, Yoğun Gövde',
      description: 'Geleneksel kahve tutkunları için koyu kavrulmuş bir başyapıt. Yoğun gövdeli yapısı, zengin kakao tonları, sedir ağacı notaları ve yoğun altın sarısı kreması ile eşsiz bir İtalyan klasiği.',
    }
  },
  'espresso-gold': {
    en: {
      name: 'Espresso Gold',
      origin: 'Central & South America',
      tastingNotes: 'Toasted Almond, Milk Chocolate, Honey',
      description: 'Elegant and incredibly smooth. A medium-roasted signature blend that strikes a perfect balance between toasted almond warmth, creamy milk chocolate, and a delicate honeyed sweetness.',
    },
    tr: {
      name: 'Espresso Gold',
      origin: 'Orta ve Güney Amerika',
      tastingNotes: 'Kavrulmuş Badem, Sütlü Çikolata, Bal',
      description: 'Zarif ve son derece yumuşak içimli. Kavrulmuş badem sıcaklığı, kremsi sütlü çikolata ve hafif bal tatlılığı arasında kusursuz bir denge sunan orta kavrum imza harmanımız.',
    }
  },
  'premium-blend': {
    en: {
      name: 'Premium Blend',
      origin: 'Africa & Central America',
      tastingNotes: 'Citrus, Jasmine, Cane Sugar',
      description: 'Lively, bright, and wonderfully complex. Specially roasted to highlight sparkling citrus acidity, sweet jasmine floral aromas, and a clean sugarcane finish that lingers beautifully.',
    },
    tr: {
      name: 'Premium Blend',
      origin: 'Doğu Afrika ve Orta Amerika',
      tastingNotes: 'Narenciye, Yasemin, Kamış Şekeri',
      description: 'Canlı, parlak ve harika bir karmaşıklığa sahip. Belirgin narenciye asiditesi, tatlı yasemin çiçeği aromaları ve damakta iz bırakan şeker kamışı bitişini öne çıkarmak için özel olarak kavruldu.',
    }
  },
  'velora-signature': {
    en: {
      name: 'Velora Signature Espresso',
      origin: 'Single Estate Micro-Lot',
      tastingNotes: 'Tropical Fruit, Honey, Bergamot, Red Wine',
      description: "An extraordinary micro-lot experience. Velora Signature unfolds with complex notes of ripe tropical mango, sweet raw honey, aromatic bergamot, and a rich, winey finish. Truly a collector's cup.",
    },
    tr: {
      name: 'Velora Signature Espresso',
      origin: 'Özel Çiftlik Mikro-Lot',
      tastingNotes: 'Tropikal Meyveler, Bal, Bergamot, Kırmızı Şarap',
      description: 'Olağanüstü bir mikro-lot deneyimi. Olgun tropikal mango, ham süzme bal, aromatik bergamot ve şarapsı bitiş notalarıyla zenginleşen Velora Signature, kahve seçkinleri için sınırlı sayıda üretildi.',
    }
  },
  'house-blend': {
    en: {
      name: 'House Blend',
      origin: 'South American Blend',
      tastingNotes: 'Dark Cocoa, Walnut, Molasses',
      description: 'The soul of our roastery. A robust filter coffee blend featuring deep, comforting notes of dark cocoa, toasted walnut, and a rich, sweet molasses body. Rich and deeply satisfying.',
    },
    tr: {
      name: 'House Blend',
      origin: 'Güney Amerika',
      tastingNotes: 'Bitter Kakao, Ceviz, Pekmez',
      description: 'Kavurmahanemizin ruhu. Bitter çikolata, kavrulmuş ceviz ve tatlı pekmez tonları içeren dolgun gövdeli filtre kahve harmanımız. Derin ve oldukça tatminkar bir sabah klasiği.',
    }
  },
  'special-blend': {
    en: {
      name: 'Special Blend',
      origin: 'Central American Blend',
      tastingNotes: 'Milk Chocolate, Toffee, Red Apple',
      description: 'Crafted for your daily ritual. A remarkably balanced filter coffee featuring sweet milk chocolate body, warm toffee notes, and a crisp, clean red apple brightness.',
    },
    tr: {
      name: 'Special Blend',
      origin: 'Orta Amerika',
      tastingNotes: 'Sütlü Çikolata, Karamel, Kırmızı Elma',
      description: 'Günlük ritüeliniz için tasarlandı. Sütlü çikolata gövdesi, karamel tatlılığı ve taze kırmızı elma asiditesi sunan, son derece dengeli ve pürüzsüz bir filtre kahve deneyimi.',
    }
  },
  'esto-blend': {
    en: {
      name: 'Esto Blend',
      origin: 'African & South American Blend',
      tastingNotes: 'Peach, Citrus, Brown Sugar',
      description: 'Our signature master blend. Esto Blend shines with vibrant peach acidity, sparkling fresh citrus, and a warm caramel and brown sugar finish that warms the palate.',
    },
    tr: {
      name: 'Esto Blend',
      origin: 'Afrika ve Güney Amerika',
      tastingNotes: 'Şeftali, Narenciye, Esmer Şeker',
      description: 'İmza harmanımız. Şeftali asiditesi, taze narenciye dokunuşları ve esmer şeker tatlılığıyla zenginleşen, damakta kadifemsi bir his bırakan çok özel bir filtre kahve.',
    }
  },
  'colombia': {
    en: {
      name: 'Colombia Supremo',
      origin: 'Huila, Colombia',
      tastingNotes: 'Caramel, Toasted Hazelnut, Sweet Orange',
      description: 'The pinnacle of Colombian specialty coffee. Hand-selected Supremo beans yield a beautifully balanced cup of warm caramel sweetness, toasted hazelnut, and a refreshing hint of sweet orange.',
    },
    tr: {
      name: 'Colombia Supremo',
      origin: 'Huila, Kolombiya',
      tastingNotes: 'Karamel, Kavrulmuş Fındık, Portakal',
      description: 'Kolombiya nitelikli kahvesinin zirvesi. Özenle seçilmiş Supremo çekirdekleri; karamel tatlılığı, kavrulmuş fındık ve hafif portakal asiditesi ile gövdeli ve dengeli bir lezzet sunar.',
    }
  },
  'guatemala': {
    en: {
      name: 'Guatemala Antigua',
      origin: 'Antigua, Guatemala',
      tastingNotes: 'Milk Chocolate, Red Currant, Toasted Pecan',
      description: 'Nurtured by volcanic soils and high altitudes. This washed lot delivers a rich milk chocolate base, crisp red currant brightness, and a smooth, buttery pecan finish.',
    },
    tr: {
      name: 'Guatemala',
      origin: 'Antigua, Guatemala',
      tastingNotes: 'Sütlü Çikolata, Frenk Üzümü, Pekan Cevizi',
      description: 'Volkanik topraklar ve yüksek rakımın hediyesi. Bu yıkanmış lot, sütlü çikolata tabanı, parlak frenk üzümü asiditesi ve tereyağlı pekan cevizi aromalarını harmanlar.',
    }
  },
  'kenya': {
    en: {
      name: 'Kenya Nyeri',
      origin: 'Nyeri, Kenya',
      tastingNotes: 'Black Currant, Blackberry, Hibiscus',
      description: 'Bold, juicy, and beautifully bright. A classic washed SL28/SL34 lot showcasing explosive black currant and ripe blackberry notes, wrapped in a tea-like hibiscus floral body.',
    },
    tr: {
      name: 'Kenya',
      origin: 'Nyeri, Kenya',
      tastingNotes: 'Siyah Frenk Üzümü, Böğürtlen, Bamya Çiçeği',
      description: 'Gövde ve asiditenin mükemmel uyumu. Ahududu ve böğürtlen benzeri orman meyveleri asiditesi, zengin gövde ve bamya çiçeği çiçeksiliği sunan efsanevi bir Kenya yıkanmış lotu.',
    }
  },
  'ethiopia': {
    en: {
      name: 'Ethiopia Sidamo',
      origin: 'Sidamo, Ethiopia',
      tastingNotes: 'Bergamot, Lemon-Lime, Jasmine',
      description: 'A fragrant journey to the birthplace of coffee. Grown in the high mountains of Sidamo, this washed heirloom crop sings with sweet bergamot, clean lemon-lime citrus, and elegant jasmine notes.',
    },
    tr: {
      name: 'Etiyopya Sidamo',
      origin: 'Sidamo, Etiyopya',
      tastingNotes: 'Bergamot, Misket Limonu, Yasemin',
      description: "Kahvenin anavatanına kokulu bir yolculuk. Sidamo'nun yüksek yaylalarında yetişen bu geleneksel yıkanmış lot; bergamot, misket limonu ve zarif yasemin notalarıyla bezeli, berrak ve çay benzeri bir gövdeye sahiptir.",
    }
  },
  'brazil-cerrado': {
    en: {
      name: 'Brazil Cerrado',
      origin: 'Cerrado, Brazil',
      tastingNotes: 'Milk Chocolate, Caramelized Peanut, Low Acidity',
      description: 'Naturally sweet and comforting. A classic natural processed Cerrado crop with near-zero acidity, boasting rich, creamy milk chocolate and caramelized peanut butter warmth.',
    },
    tr: {
      name: 'Brezilya Cerrado',
      origin: 'Cerrado, Brezilya',
      tastingNotes: 'Sütlü Çikolata, Fıstık Ezmesi, Düşük Asidite',
      description: 'Asiditesi son derece düşük olan bu doğal işlenmiş Cerrado kahvesi, fıstık ezmesi aromaları ve sütlü çikolata kremsiliğiyle damakta tatlılık bırakır.',
    }
  },
  'brazil-mogiana': {
    en: {
      name: 'Brazil Mogiana',
      origin: 'Alta Mogiana, Brazil',
      tastingNotes: 'Caramel, Toasted Almond, Yellow Fruit',
      description: 'Grown in the legendary Mogiana valley. A highly balanced cup highlighting warm caramel sweetness, toasted almond comfort, and a subtle touch of soft yellow plum brightness.',
    },
    tr: {
      name: 'Brezilya Mogiana',
      origin: 'Alta Mogiana, Brezilya',
      tastingNotes: 'Karamel, Kavrulmuş Badem, Sarı Meyveler',
      description: "Brezilya'nın en köklü kahve vadilerinden biri. Karamel tatlılığı, kavrulmuş badem ve arkadan gelen hafif sarı erik asiditesinin mükemmel uyumuyla oldukça dengeli bir içim sunar.",
    }
  },
  'brazil-rio-minas': {
    en: {
      name: 'Brazil Rio Minas',
      origin: 'Minas Gerais, Brazil',
      tastingNotes: 'Classic Cocoa, Sweet Nutty, Soft Body',
      description: 'A smooth, easy-drinking classic. Natural processed Minas Gerais crop presenting sweet, soft body, classic cocoa warmth, and a clean, nutty finish.',
    },
    tr: {
      name: 'Brezilya Rio Minas',
      origin: 'Minas Gerais, Brezilya',
      tastingNotes: 'Klasik Kakao, Tatlı Fındıksı, Yumuşak Gövde',
      description: 'Yumuşak ve rahat içimli bir klasik. Minas Gerais bölgesinden gelen bu doğal işlenmiş çekirdekler, klasik kakao aromaları ve hafif tatlı fındıksı notalar barındırır.',
    }
  },
  'turk-kahvesi': {
    en: {
      name: 'Turkish Coffee',
      origin: 'Brazil & Colombia Blend',
      tastingNotes: 'Traditional Cocoa, Thick Crema, Nutty Finish',
      description: 'A traditional blend crafted for the perfect cezve brew. An ultra-finely ground signature blend of Brazilian Rio Minas and Colombian Supremo, yielding a thick, velvety foam and rich cocoa notes.',
    },
    tr: {
      name: 'Türk Kahvesi',
      origin: 'Brezilya ve Kolombiya',
      tastingNotes: 'Geleneksel Kakao, Yoğun Telve, Fındıksı Bitiş',
      description: 'Geleneksel cezve demlemeleri için özel olarak öğütüldü. Brezilya Rio Minas ve Kolombiya Supremo çekirdeklerinin harmanından doğan, bol köpüklü, kadifemsi telveli ve zengin kakao aromalı eşsiz bir lezzet.',
    }
  }
};

export function localizeProduct(product: any, locale: string): LocalizedProduct {
  const defaultLoc = locale === 'tr' ? 'tr' : 'en';
  const trans = translations[product.id]?.[defaultLoc];

  return {
    ...product,
    name: trans?.name || product.name,
    origin: trans?.origin || product.origin,
    tastingNotes: trans?.tastingNotes || product.tastingNotes,
    description: trans?.description || product.description,
  };
}
