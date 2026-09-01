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
  price1kg: number;
  stock: number;
  imageUrl: string;
  videoUrl: string;
  isActive: boolean;
  process: string;
  body: string;
  acidity: string;
}

// process/body/acidity are taken verbatim from the printed spec block on each coffee's
// physical pack label — only added where the pack prints an unambiguous word (e.g. "WASHED",
// "ORTA"/"MEDIUM"), never inferred from the dot-strength graphics, which can't be read reliably.
const translations: Record<string, Record<string, { name: string; origin: string; tastingNotes: string; description: string; process?: string; body?: string; acidity?: string }>> = {
  'italian-blend': {
    en: {
      name: 'Italian Blend',
      origin: 'South America & Asia Blend',
      tastingNotes: 'Cocoa, Cedar, Heavy Body',
      description: 'A bold, dark-roasted masterpiece crafted for the traditionalist. This classic blend yields a heavy-bodied cup with notes of rich dark chocolate, toasted cedarwood, and an ultra-dense golden crema.',
      process: 'Washed', body: 'Heavy',
    },
    tr: {
      name: 'İtalyan Blend',
      origin: 'Güney Amerika ve Asya',
      tastingNotes: 'Kakao, Sedir, Yoğun Gövde',
      description: 'Geleneksel kahve tutkunları için koyu kavrulmuş bir başyapıt. Yoğun gövdeli yapısı, zengin kakao tonları, sedir ağacı notaları ve yoğun altın sarısı kreması ile eşsiz bir İtalyan klasiği.',
      process: 'Yıkanmış', body: 'Yoğun',
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
      body: 'Intense',
    },
    tr: {
      name: 'House Blend',
      origin: 'Güney Amerika',
      tastingNotes: 'Bitter Kakao, Ceviz, Pekmez',
      description: 'Kavurmahanemizin ruhu. Bitter çikolata, kavrulmuş ceviz ve tatlı pekmez tonları içeren dolgun gövdeli filtre kahve harmanımız. Derin ve oldukça tatminkar bir sabah klasiği.',
      body: 'Yoğun',
    }
  },
  'special-blend': {
    en: {
      name: 'Special Blend',
      origin: 'Central American Blend',
      tastingNotes: 'Milk Chocolate, Toffee, Red Apple',
      description: 'Crafted for your daily ritual. A remarkably balanced filter coffee featuring sweet milk chocolate body, warm toffee notes, and a crisp, clean red apple brightness.',
      body: 'Balanced',
    },
    tr: {
      name: 'Special Blend',
      origin: 'Orta Amerika',
      tastingNotes: 'Sütlü Çikolata, Karamel, Kırmızı Elma',
      description: 'Günlük ritüeliniz için tasarlandı. Sütlü çikolata gövdesi, karamel tatlılığı ve taze kırmızı elma asiditesi sunan, son derece dengeli ve pürüzsüz bir filtre kahve deneyimi.',
      body: 'Dengeli',
    }
  },
  'esto-blend': {
    en: {
      name: 'Esto Blend',
      origin: 'African & South American Blend',
      tastingNotes: 'Peach, Citrus, Brown Sugar',
      description: 'Our signature master blend. Esto Blend shines with vibrant peach acidity, sparkling fresh citrus, and a warm caramel and brown sugar finish that warms the palate.',
      body: 'Medium',
    },
    tr: {
      name: 'Esto Blend',
      origin: 'Afrika ve Güney Amerika',
      tastingNotes: 'Şeftali, Narenciye, Esmer Şeker',
      body: 'Orta',
      description: 'İmza harmanımız. Şeftali asiditesi, taze narenciye dokunuşları ve esmer şeker tatlılığıyla zenginleşen, damakta kadifemsi bir his bırakan çok özel bir filtre kahve.',
    }
  },
  'colombia': {
    en: {
      name: 'Colombia Supremo',
      origin: 'Huila, Colombia',
      tastingNotes: 'Caramel, Toasted Hazelnut, Sweet Orange',
      description: 'The pinnacle of Colombian specialty coffee. Hand-selected Supremo beans yield a beautifully balanced cup of warm caramel sweetness, toasted hazelnut, and a refreshing hint of sweet orange.',
      process: 'Washed',
    },
    tr: {
      name: 'Colombia Supremo',
      origin: 'Huila, Kolombiya',
      tastingNotes: 'Karamel, Kavrulmuş Fındık, Portakal',
      description: 'Kolombiya nitelikli kahvesinin zirvesi. Özenle seçilmiş Supremo çekirdekleri; karamel tatlılığı, kavrulmuş fındık ve hafif portakal asiditesi ile gövdeli ve dengeli bir lezzet sunar.',
      process: 'Yıkanmış',
    }
  },
  'guatemala': {
    en: {
      name: 'Guatemala Antigua',
      origin: 'Antigua, Guatemala',
      tastingNotes: 'Milk Chocolate, Red Currant, Toasted Pecan',
      description: 'Nurtured by volcanic soils and high altitudes. This washed lot delivers a rich milk chocolate base, crisp red currant brightness, and a smooth, buttery pecan finish.',
      process: 'Washed', body: 'Medium', acidity: 'Lively',
    },
    tr: {
      name: 'Guatemala',
      origin: 'Antigua, Guatemala',
      tastingNotes: 'Sütlü Çikolata, Frenk Üzümü, Pekan Cevizi',
      description: 'Volkanik topraklar ve yüksek rakımın hediyesi. Bu yıkanmış lot, sütlü çikolata tabanı, parlak frenk üzümü asiditesi ve tereyağlı pekan cevizi aromalarını harmanlar.',
      process: 'Yıkanmış', body: 'Orta', acidity: 'Canlı',
    }
  },
  'kenya': {
    en: {
      name: 'Kenya Nyeri',
      origin: 'Nyeri, Kenya',
      tastingNotes: 'Black Currant, Blackberry, Hibiscus',
      description: 'Bold, juicy, and beautifully bright. A classic washed SL28/SL34 lot showcasing explosive black currant and ripe blackberry notes, wrapped in a tea-like hibiscus floral body.',
      process: 'Washed', body: 'Medium', acidity: 'Lively',
    },
    tr: {
      name: 'Kenya',
      origin: 'Nyeri, Kenya',
      tastingNotes: 'Siyah Frenk Üzümü, Böğürtlen, Bamya Çiçeği',
      description: 'Gövde ve asiditenin mükemmel uyumu. Ahududu ve böğürtlen benzeri orman meyveleri asiditesi, zengin gövde ve bamya çiçeği çiçeksiliği sunan efsanevi bir Kenya yıkanmış lotu.',
      process: 'Yıkanmış', body: 'Orta', acidity: 'Canlı',
    }
  },
  'ethiopia': {
    en: {
      name: 'Ethiopia Sidamo',
      origin: 'Sidamo, Ethiopia',
      tastingNotes: 'Bergamot, Lemon-Lime, Jasmine',
      description: 'A fragrant journey to the birthplace of coffee. Grown in the high mountains of Sidamo, this natural-processed heirloom crop sings with sweet bergamot, clean lemon-lime citrus, and elegant jasmine notes.',
      process: 'Natural', body: 'Medium', acidity: 'Lively',
    },
    tr: {
      name: 'Etiyopya Sidamo',
      origin: 'Sidamo, Etiyopya',
      tastingNotes: 'Bergamot, Misket Limonu, Yasemin',
      description: "Kahvenin anavatanına kokulu bir yolculuk. Sidamo'nun yüksek yaylalarında yetişen bu geleneksel doğal işlenmiş lot; bergamot, misket limonu ve zarif yasemin notalarıyla bezeli, berrak ve çay benzeri bir gövdeye sahiptir.",
      process: 'Doğal', body: 'Orta', acidity: 'Canlı',
    }
  },
  'ethiopia-yirgacheffe': {
    en: {
      name: 'Ethiopia Yirgacheffe',
      origin: 'Yirgacheffe, Ethiopia',
      tastingNotes: 'Mixed Berries, Milk Chocolate, Sweet Lemon',
      description: 'A vibrant washed Yirgacheffe lot with a balanced, lively cup — layered mixed-berry fruit, creamy milk chocolate, and a bright, sweet lemon finish.',
      process: 'Washed', body: 'Medium', acidity: 'Lively',
    },
    tr: {
      name: 'Etiyopya Yirgacheffe',
      origin: 'Yirgacheffe, Etiyopya',
      tastingNotes: 'Karışık Meyveler, Sütlü Çikolata, Tatlı Limon',
      description: 'Dengeli ve canlı bir fincan sunan yıkanmış Yirgacheffe lotu — katmanlı karışık meyve tatları, kremsi sütlü çikolata ve parlak, tatlı limon bitişiyle öne çıkar.',
      process: 'Yıkanmış', body: 'Orta', acidity: 'Canlı',
    }
  },
  'brazil-cerrado': {
    en: {
      name: 'Brazil Cerrado',
      origin: 'Cerrado, Brazil',
      tastingNotes: 'Milk Chocolate, Caramelized Peanut, Low Acidity',
      description: 'Naturally sweet and comforting. A classic natural processed Cerrado crop with near-zero acidity, boasting rich, creamy milk chocolate and caramelized peanut butter warmth.',
      process: 'Natural',
    },
    tr: {
      name: 'Brezilya Cerrado',
      origin: 'Cerrado, Brezilya',
      tastingNotes: 'Sütlü Çikolata, Fıstık Ezmesi, Düşük Asidite',
      description: 'Asiditesi son derece düşük olan bu doğal işlenmiş Cerrado kahvesi, fıstık ezmesi aromaları ve sütlü çikolata kremsiliğiyle damakta tatlılık bırakır.',
      process: 'Doğal',
    }
  },
  'brazil-mogiana': {
    en: {
      name: 'Brazil Mogiana',
      origin: 'Alta Mogiana, Brazil',
      tastingNotes: 'Caramel, Toasted Almond, Yellow Fruit',
      description: 'Grown in the legendary Mogiana valley. A highly balanced cup highlighting warm caramel sweetness, toasted almond comfort, and a subtle touch of soft yellow plum brightness.',
      process: 'Natural',
    },
    tr: {
      name: 'Brezilya Mogiana',
      origin: 'Alta Mogiana, Brezilya',
      tastingNotes: 'Karamel, Kavrulmuş Badem, Sarı Meyveler',
      description: "Brezilya'nın en köklü kahve vadilerinden biri. Karamel tatlılığı, kavrulmuş badem ve arkadan gelen hafif sarı erik asiditesinin mükemmel uyumuyla oldukça dengeli bir içim sunar.",
      process: 'Doğal',
    }
  },
  'brazil-rio-minas': {
    en: {
      name: 'Brazil Rio Minas',
      origin: 'Minas Gerais, Brazil',
      tastingNotes: 'Classic Cocoa, Sweet Nutty, Soft Body',
      description: 'A smooth, easy-drinking classic. Natural processed Minas Gerais crop presenting sweet, soft body, classic cocoa warmth, and a clean, nutty finish.',
      process: 'Natural', body: 'High', acidity: 'Low',
    },
    tr: {
      name: 'Brezilya Rio Minas',
      origin: 'Minas Gerais, Brezilya',
      tastingNotes: 'Klasik Kakao, Tatlı Fındıksı, Yumuşak Gövde',
      description: 'Yumuşak ve rahat içimli bir klasik. Minas Gerais bölgesinden gelen bu doğal işlenmiş çekirdekler, klasik kakao aromaları ve hafif tatlı fındıksı notalar barındırır.',
      process: 'Doğal', body: 'Yüksek', acidity: 'Düşük',
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
  },
  'kef-flt120': {
    en: {
      name: "KEF FLT120",
      origin: "KEF Filter Coffee Machine",
      tastingNotes: "Hot plates that can be used separately, Dry-boil protection, Fast brewing time (6 min.), Capacity 144 cup/hour, 1.8 lt glass jug capacity",
      description: "KEF FLT120 filter coffee machine, built for fast, reliable batch brewing in cafés and offices.",
    },
    tr: {
      name: "KEF FLT120",
      origin: "KEF Filtre Kahve Makinesi",
      tastingNotes: "Birbirinden bağımsız kullanılabilen ısıtıcılar, Susuz çalışma koruması, Hızlı demleme süresi (6 dakika), Kapasite 144 fincan/saat, 1.8 lt. cam pot kapasitesi",
      description: "KEF FLT120 filtre kahve makinesi; kafeler ve ofisler için hızlı ve güvenilir batch demleme sunar.",
    }
  },
  'kef-flt120-2': {
    en: {
      name: "KEF FLT120-2",
      origin: "KEF Filter Coffee Machine",
      tastingNotes: "Hot plates that can be used separately, Dry-boil protection, Fast brewing time (6 min.), Capacity 144 cup/hour, Optional 1 or 2 glass jugs",
      description: "KEF FLT120-2 filter coffee machine, built for fast, reliable batch brewing in cafés and offices.",
    },
    tr: {
      name: "KEF FLT120-2",
      origin: "KEF Filtre Kahve Makinesi",
      tastingNotes: "Birbirinden bağımsız kullanılabilen ısıtıcılar, Susuz çalışma koruması, Hızlı demleme süresi (6 dakika), Kapasite 144 fincan/saat, Opsiyonel olarak 1 veya 2 cam potlu",
      description: "KEF FLT120-2 filtre kahve makinesi; kafeler ve ofisler için hızlı ve güvenilir batch demleme sunar.",
    }
  },
  'kef-flt120-t': {
    en: {
      name: "KEF FLT120-T",
      origin: "KEF Filter Coffee Machine",
      tastingNotes: "Dry-boil protection, Fast brewing time (6 min.), Capacity 144 cup/hour, 1.9 lt thermos capacity",
      description: "KEF FLT120-T filter coffee machine, built for fast, reliable batch brewing in cafés and offices.",
    },
    tr: {
      name: "KEF FLT120-T",
      origin: "KEF Filtre Kahve Makinesi",
      tastingNotes: "Susuz çalışma koruması, Hızlı demleme süresi (6 dakika), Kapasite 144 fincan/saat, 1.9 Lt Termos kapasitesi",
      description: "KEF FLT120-T filtre kahve makinesi; kafeler ve ofisler için hızlı ve güvenilir batch demleme sunar.",
    }
  },
  'kef-flt120-ap': {
    en: {
      name: "KEF FLT120-AP",
      origin: "KEF Filter Coffee Machine",
      tastingNotes: "Dry-boil protection, Fast brewing time (7 min.), Capacity 144 cup/hour, 2.2 lt thermos capacity",
      description: "KEF FLT120-AP filter coffee machine, built for fast, reliable batch brewing in cafés and offices.",
    },
    tr: {
      name: "KEF FLT120-AP",
      origin: "KEF Filtre Kahve Makinesi",
      tastingNotes: "Susuz çalışma koruması, Hızlı demleme süresi (7 dakika), Kapasite 144 fincan/saat, 2.2 Lt Termos kapasitesi",
      description: "KEF FLT120-AP filtre kahve makinesi; kafeler ve ofisler için hızlı ve güvenilir batch demleme sunar.",
    }
  },
  'kef-flt250': {
    en: {
      name: "KEF FLT250",
      origin: "KEF Filter Coffee Machine",
      tastingNotes: "Dry-boil protection, Fast brewing time (8 min.), Capacity 144 cup/hour, 2.5 lt thermos capacity",
      description: "KEF FLT250 filter coffee machine, built for fast, reliable batch brewing in cafés and offices.",
    },
    tr: {
      name: "KEF FLT250",
      origin: "KEF Filtre Kahve Makinesi",
      tastingNotes: "Susuz çalışma koruması, Hızlı demleme süresi (8 dakika), Kapasite 144 fincan/saat, 2,5Lt Termos kapasitesi",
      description: "KEF FLT250 filtre kahve makinesi; kafeler ve ofisler için hızlı ve güvenilir batch demleme sunar.",
    }
  },
  'kef-flc120': {
    en: {
      name: "KEF FLC120",
      origin: "KEF Programmable Filter Coffee Machine",
      tastingNotes: "Water connection and manual filling, Dry-boil protection, Fast brewing time (6 min.), Hot plates that can be used separately, Capacity 144 cup/hour, 1.8 lt glass jug capacity, Stainless steel brew basket",
      description: "KEF FLC120 programmable filter coffee machine with mains water connection and a stainless steel brew basket.",
    },
    tr: {
      name: "KEF FLC120",
      origin: "KEF Programlanabilir Filtre Kahve Makinesi",
      tastingNotes: "Şebekeden su bağlantılı ve manuel su doldurma, Susuz çalışma koruması, Hızlı demleme süresi (6 dakika), Birbirinden bağımsız kullanılabilen ısıtıcılar, Kapasite 144 fincan/saat, 1,8 lt. cam pot kapasitesi, Paslanmaz çelik demleme haznesi",
      description: "KEF FLC120 programlanabilir filtre kahve makinesi; şebekeden su bağlantılı ve paslanmaz çelik demleme haznelidir.",
    }
  },
  'kef-flc120-2': {
    en: {
      name: "KEF FLC120-2",
      origin: "KEF Programmable Filter Coffee Machine",
      tastingNotes: "Water connection and manual filling, Dry-boil protection, Fast brewing time (6 min.), Capacity 144 cup/hour, Stainless steel brew basket",
      description: "KEF FLC120-2 programmable filter coffee machine with mains water connection and a stainless steel brew basket.",
    },
    tr: {
      name: "KEF FLC120-2",
      origin: "KEF Programlanabilir Filtre Kahve Makinesi",
      tastingNotes: "Şebekeden su bağlantılı ve manuel su doldurma, Susuz çalışma koruması, Hızlı demleme süresi (6 dakika), Kapasite 144 fincan/saat, Paslanmaz çelik demleme haznesi",
      description: "KEF FLC120-2 programlanabilir filtre kahve makinesi; şebekeden su bağlantılı ve paslanmaz çelik demleme haznelidir.",
    }
  },
  'kef-flc120-t': {
    en: {
      name: "KEF FLC120-T",
      origin: "KEF Programmable Filter Coffee Machine",
      tastingNotes: "Water connection and manual filling, Dry-boil protection, Fast brewing time (6 min.), Capacity 144 cup/hour, 1.9 lt thermos capacity, Stainless steel brew basket",
      description: "KEF FLC120-T programmable filter coffee machine with mains water connection and a stainless steel brew basket.",
    },
    tr: {
      name: "KEF FLC120-T",
      origin: "KEF Programlanabilir Filtre Kahve Makinesi",
      tastingNotes: "Şebekeden su bağlantılı ve manuel su doldurma, Susuz çalışma koruması, Hızlı demleme süresi (6 dakika), Kapasite 144 fincan/saat, 1.9 Lt Termos kapasitesi, Paslanmaz çelik demleme haznesi",
      description: "KEF FLC120-T programlanabilir filtre kahve makinesi; şebekeden su bağlantılı ve paslanmaz çelik demleme haznelidir.",
    }
  },
  'kef-flc120-ap': {
    en: {
      name: "KEF FLC120-AP",
      origin: "KEF Programmable Filter Coffee Machine",
      tastingNotes: "Water connection and manual filling, Dry-boil protection, Fast brewing time (7 min.), Capacity 144 cup/hour, 2.2 lt thermos capacity, Stainless steel brew basket",
      description: "KEF FLC120-AP programmable filter coffee machine with mains water connection and a stainless steel brew basket.",
    },
    tr: {
      name: "KEF FLC120-AP",
      origin: "KEF Programlanabilir Filtre Kahve Makinesi",
      tastingNotes: "Şebekeden su bağlantılı ve manuel su doldurma, Susuz çalışma koruması, Hızlı demleme süresi (7 dakika), Kapasite 144 fincan/saat, 2,2 Lt Termos kapasitesi, Paslanmaz çelik demleme haznesi",
      description: "KEF FLC120-AP programlanabilir filtre kahve makinesi; şebekeden su bağlantılı ve paslanmaz çelik demleme haznelidir.",
    }
  },
  'kef-flc250': {
    en: {
      name: "KEF FLC250",
      origin: "KEF Programmable Filter Coffee Machine",
      tastingNotes: "Water connection and manual filling, Dry-boil protection, Fast brewing time (8 min.), Capacity 144 cup/hour, 2.5 lt thermos capacity, Stainless steel brew basket",
      description: "KEF FLC250 programmable filter coffee machine with mains water connection and a stainless steel brew basket.",
    },
    tr: {
      name: "KEF FLC250",
      origin: "KEF Programlanabilir Filtre Kahve Makinesi",
      tastingNotes: "Şebekeden su bağlantılı ve manuel su doldurma, Susuz çalışma koruması, Hızlı demleme süresi (8 dakika), Kapasite 144 fincan/saat, 2,5Lt Termos kapasitesi, Paslanmaz çelik demleme haznesi",
      description: "KEF FLC250 programlanabilir filtre kahve makinesi; şebekeden su bağlantılı ve paslanmaz çelik demleme haznelidir.",
    }
  },
  'kef-fls-2.2': {
    en: {
      name: "KEF FLS-2.2",
      origin: "KEF Filtronist Touchscreen Batch Brewer",
      tastingNotes: "User friendly 4.3 inch touchscreen, 4 different programs, Eco mode, 2.2 Air Pot / 2.5 lt thermal container included, Stainless steel brew basket and body, Pulse brew system, Capacity 30 lt/hour",
      description: "KEF Filtronist FLS-2.2 high-capacity touchscreen batch brewer with pulse brew and pre-wet settings for professional filter coffee service.",
    },
    tr: {
      name: "KEF FLS-2.2",
      origin: "KEF Filtronist Dokunmatik Ekranlı Demleyici",
      tastingNotes: "Kullanıcı dostu 4,3 inç dokunmatik ekran, 4 farklı program, Eko mod, 2.2 Air Pot / 2,5 lt Termal Konteyner dahil, Paslanmaz çelik demleme haznesi ve gövde, Darbeli demleme sistemi, Kapasite 30 lt/saat",
      description: "KEF Filtronist FLS-2.2, profesyonel filtre kahve servisi için darbeli demleme ve ön ıslatma ayarlarına sahip yüksek kapasiteli dokunmatik ekranlı demleyicidir.",
    }
  },
  'kef-fls-2.5': {
    en: {
      name: "KEF FLS-2.5",
      origin: "KEF Filtronist Touchscreen Batch Brewer",
      tastingNotes: "User friendly 4.3 inch touchscreen, 4 different programs, Eco mode, 2.5 lt thermal container included, Stainless steel brew basket and body, Pulse brew system, Capacity 30 lt/hour",
      description: "KEF Filtronist FLS-2.5 high-capacity touchscreen batch brewer with pulse brew and pre-wet settings for professional filter coffee service.",
    },
    tr: {
      name: "KEF FLS-2.5",
      origin: "KEF Filtronist Dokunmatik Ekranlı Demleyici",
      tastingNotes: "Kullanıcı dostu 4,3 inç dokunmatik ekran, 4 farklı program, Eko mod, 2,5 lt Termal Konteyner dahil, Paslanmaz çelik demleme haznesi ve gövde, Darbeli demleme sistemi, Kapasite 30 lt/saat",
      description: "KEF Filtronist FLS-2.5, profesyonel filtre kahve servisi için darbeli demleme ve ön ıslatma ayarlarına sahip yüksek kapasiteli dokunmatik ekranlı demleyicidir.",
    }
  },
  'kef-fls-2.5-short': {
    en: {
      name: "KEF FLS-2.5 SHORT",
      origin: "KEF Filtronist Touchscreen Batch Brewer",
      tastingNotes: "User friendly 4.3 inch touchscreen, 4 different programs, Eco mode, Compact short body, Stainless steel brew basket and body, Pulse brew system, Capacity 30 lt/hour",
      description: "KEF Filtronist FLS-2.5 SHORT high-capacity touchscreen batch brewer with pulse brew and pre-wet settings for professional filter coffee service.",
    },
    tr: {
      name: "KEF FLS-2.5 SHORT",
      origin: "KEF Filtronist Dokunmatik Ekranlı Demleyici",
      tastingNotes: "Kullanıcı dostu 4,3 inç dokunmatik ekran, 4 farklı program, Eko mod, Kompakt kısa gövde, Paslanmaz çelik demleme haznesi ve gövde, Darbeli demleme sistemi, Kapasite 30 lt/saat",
      description: "KEF Filtronist FLS-2.5 SHORT, profesyonel filtre kahve servisi için darbeli demleme ve ön ıslatma ayarlarına sahip yüksek kapasiteli dokunmatik ekranlı demleyicidir.",
    }
  },
  'kef-fls-3.8-short': {
    en: {
      name: "KEF FLS-3.8 SHORT",
      origin: "KEF Filtronist Touchscreen Batch Brewer",
      tastingNotes: "User friendly 4.3 inch touchscreen, 4 different programs, Eco mode, 3.8 lt thermal container included, Compact short body, Pulse brew system, Capacity 30 lt/hour",
      description: "KEF Filtronist FLS-3.8 SHORT high-capacity touchscreen batch brewer with pulse brew and pre-wet settings for professional filter coffee service.",
    },
    tr: {
      name: "KEF FLS-3.8 SHORT",
      origin: "KEF Filtronist Dokunmatik Ekranlı Demleyici",
      tastingNotes: "Kullanıcı dostu 4,3 inç dokunmatik ekran, 4 farklı program, Eko mod, 3,8 lt Termal Konteyner dahil, Kompakt kısa gövde, Darbeli demleme sistemi, Kapasite 30 lt/saat",
      description: "KEF Filtronist FLS-3.8 SHORT, profesyonel filtre kahve servisi için darbeli demleme ve ön ıslatma ayarlarına sahip yüksek kapasiteli dokunmatik ekranlı demleyicidir.",
    }
  },
  'kef-fls-3.8': {
    en: {
      name: "KEF FLS-3.8",
      origin: "KEF Filtronist Touchscreen Batch Brewer",
      tastingNotes: "User friendly 4.3 inch touchscreen, 4 different programs, Eco mode, 3.8 lt thermal container included, Stainless steel brew basket and body, Pulse brew system, Capacity 30 lt/hour",
      description: "KEF Filtronist FLS-3.8 high-capacity touchscreen batch brewer with pulse brew and pre-wet settings for professional filter coffee service.",
    },
    tr: {
      name: "KEF FLS-3.8",
      origin: "KEF Filtronist Dokunmatik Ekranlı Demleyici",
      tastingNotes: "Kullanıcı dostu 4,3 inç dokunmatik ekran, 4 farklı program, Eko mod, 3,8 lt Termal Konteyner dahil, Paslanmaz çelik demleme haznesi ve gövde, Darbeli demleme sistemi, Kapasite 30 lt/saat",
      description: "KEF Filtronist FLS-3.8, profesyonel filtre kahve servisi için darbeli demleme ve ön ıslatma ayarlarına sahip yüksek kapasiteli dokunmatik ekranlı demleyicidir.",
    }
  },
  'kef-fls-5.7': {
    en: {
      name: "KEF FLS-5.7",
      origin: "KEF Filtronist Touchscreen Batch Brewer",
      tastingNotes: "User friendly 7 inch touchscreen, 4 different programs, Eco mode, 5.7 lt thermal container included, Stainless steel brew basket and body, Pulse brew system, Capacity 40 lt/hour",
      description: "KEF Filtronist FLS-5.7 high-capacity touchscreen batch brewer with pulse brew and pre-wet settings for professional filter coffee service.",
    },
    tr: {
      name: "KEF FLS-5.7",
      origin: "KEF Filtronist Dokunmatik Ekranlı Demleyici",
      tastingNotes: "Kullanıcı dostu 7 inç dokunmatik ekran, 4 farklı program, Eko modu, 5,7 lt Termal Konteyner dahil, Paslanmaz çelik demleme haznesi ve gövde, Darbeli demleme sistemi, Kapasite 40 lt/saat",
      description: "KEF Filtronist FLS-5.7, profesyonel filtre kahve servisi için darbeli demleme ve ön ıslatma ayarlarına sahip yüksek kapasiteli dokunmatik ekranlı demleyicidir.",
    }
  },
  'kef-fls-6': {
    en: {
      name: "KEF FLS-6",
      origin: "KEF Filtronist Touchscreen Batch Brewer",
      tastingNotes: "User friendly 7 inch touchscreen, 4 different programs, Eco mode, 6 lt thermal container included, Stainless steel brew basket and body, Pulse brew system, Capacity 40 lt/hour",
      description: "KEF Filtronist FLS-6 high-capacity touchscreen batch brewer with pulse brew and pre-wet settings for professional filter coffee service.",
    },
    tr: {
      name: "KEF FLS-6",
      origin: "KEF Filtronist Dokunmatik Ekranlı Demleyici",
      tastingNotes: "Kullanıcı dostu 7 inç dokunmatik ekran, 4 farklı program, Eko modu, 6 lt Termal Konteyner dahil, Paslanmaz çelik demleme haznesi ve gövde, Darbeli demleme sistemi, Kapasite 40 lt/saat",
      description: "KEF Filtronist FLS-6, profesyonel filtre kahve servisi için darbeli demleme ve ön ıslatma ayarlarına sahip yüksek kapasiteli dokunmatik ekranlı demleyicidir.",
    }
  },
  'kef-fls-5.7-short': {
    en: {
      name: "KEF FLS-5.7 SHORT",
      origin: "KEF Filtronist Touchscreen Batch Brewer",
      tastingNotes: "User friendly 7 inch touchscreen, 4 different programs, Eco mode, Compact short body, Stainless steel brew basket and body, Pulse brew system, Capacity 40 lt/hour",
      description: "KEF Filtronist FLS-5.7 SHORT high-capacity touchscreen batch brewer with pulse brew and pre-wet settings for professional filter coffee service.",
    },
    tr: {
      name: "KEF FLS-5.7 SHORT",
      origin: "KEF Filtronist Dokunmatik Ekranlı Demleyici",
      tastingNotes: "Kullanıcı dostu 7 inç dokunmatik ekran, 4 farklı program, Eko modu, Kompakt kısa gövde, Paslanmaz çelik demleme haznesi ve gövde, Darbeli demleme sistemi, Kapasite 40 lt/saat",
      description: "KEF Filtronist FLS-5.7 SHORT, profesyonel filtre kahve servisi için darbeli demleme ve ön ıslatma ayarlarına sahip yüksek kapasiteli dokunmatik ekranlı demleyicidir.",
    }
  },
  'kef-fls-6-short': {
    en: {
      name: "KEF FLS-6 SHORT",
      origin: "KEF Filtronist Touchscreen Batch Brewer",
      tastingNotes: "User friendly 7 inch touchscreen, 4 different programs, Eco mode, Compact short body, Stainless steel brew basket and body, Pulse brew system, Capacity 40 lt/hour",
      description: "KEF Filtronist FLS-6 SHORT high-capacity touchscreen batch brewer with pulse brew and pre-wet settings for professional filter coffee service.",
    },
    tr: {
      name: "KEF FLS-6 SHORT",
      origin: "KEF Filtronist Dokunmatik Ekranlı Demleyici",
      tastingNotes: "Kullanıcı dostu 7 inç dokunmatik ekran, 4 farklı program, Eko modu, Kompakt kısa gövde, Paslanmaz çelik demleme haznesi ve gövde, Darbeli demleme sistemi, Kapasite 40 lt/saat",
      description: "KEF Filtronist FLS-6 SHORT, profesyonel filtre kahve servisi için darbeli demleme ve ön ıslatma ayarlarına sahip yüksek kapasiteli dokunmatik ekranlı demleyicidir.",
    }
  },
  'kef-fls-8x2': {
    en: {
      name: "KEF FLS-8x2",
      origin: "KEF Filtronist Touchscreen Batch Brewer",
      tastingNotes: "User friendly 7 inch touchscreen, 4 different programs, Eco mode, Dual brew head, high-volume body, Stainless steel brew basket and body, Pulse brew system, Capacity 40 lt/hour",
      description: "KEF Filtronist FLS-8x2 high-capacity touchscreen batch brewer with pulse brew and pre-wet settings for professional filter coffee service.",
    },
    tr: {
      name: "KEF FLS-8x2",
      origin: "KEF Filtronist Dokunmatik Ekranlı Demleyici",
      tastingNotes: "Kullanıcı dostu 7 inç dokunmatik ekran, 4 farklı program, Eko modu, Çift demleme başlıklı, yüksek hacimli gövde, Paslanmaz çelik demleme haznesi ve gövde, Darbeli demleme sistemi, Kapasite 40 lt/saat",
      description: "KEF Filtronist FLS-8x2, profesyonel filtre kahve servisi için darbeli demleme ve ön ıslatma ayarlarına sahip yüksek kapasiteli dokunmatik ekranlı demleyicidir.",
    }
  },
  'kef-magia-coffee-mc16': {
    en: {
      name: "KEF MC16",
      origin: "KEF Magia Undercounter Coffee Brewer",
      tastingNotes: "4.3 inch touchscreen undercounter boiler, Isolated water tank for energy saving, Filter paper rinse function, Adjustable temperature control, Live temperature readout, Tank capacity 12 lt, 4 adjustable brew programs",
      description: "KEF Magia Coffee MC16 undercounter brewer with touchscreen control and adjustable brew programs.",
    },
    tr: {
      name: "KEF MC16",
      origin: "KEF Magia Tezgah Altı Kahve Demleme Sistemi",
      tastingNotes: "4,3 inç Dokunmatik Ekranlı Tezgah Altı Kazan, Enerji tasarrufu için izole su tankı, Filtre kağıdı durulama özelliği, Ayarlanabilir sıcaklık kontrolü, Canlı sıcaklık okuma, Tank kapasitesi 12 lt, 4 Ayarlanabilir Demleme programı",
      description: "KEF Magia Coffee MC16 tezgah altı demleme sistemi; dokunmatik ekran kontrolü ve ayarlanabilir demleme programlarına sahiptir.",
    }
  },
  'kef-magia-coffee-mc16-duo': {
    en: {
      name: "KEF MC16 Duo",
      origin: "KEF Magia Undercounter Coffee Brewer",
      tastingNotes: "4.3 inch touchscreen undercounter boiler, Isolated water tank for energy saving, Filter paper rinse function, Adjustable temperature control, Live temperature readout, Tank capacity 18 lt, 4 adjustable brew programs",
      description: "KEF Magia Coffee MC16 Duo undercounter brewer with touchscreen control and adjustable brew programs.",
    },
    tr: {
      name: "KEF MC16 Duo",
      origin: "KEF Magia Tezgah Altı Kahve Demleme Sistemi",
      tastingNotes: "4,3 inç Dokunmatik Ekranlı Tezgah Altı Kazan, Enerji tasarrufu için izole su tankı, Filtre kağıdı durulama özelliği, Ayarlanabilir sıcaklık kontrolü, Canlı sıcaklık okuma, Tank kapasitesi 18 lt, 4 Ayarlanabilir Demleme programı",
      description: "KEF Magia Coffee MC16 Duo tezgah altı demleme sistemi; dokunmatik ekran kontrolü ve ayarlanabilir demleme programlarına sahiptir.",
    }
  },
  'kef-tb16-warmer': {
    en: {
      name: "KEF TB16 Warmer",
      origin: "KEF Hot Water Dispenser",
      tastingNotes: "High definition display, Isolated water tank for energy saving, Eco mode, energy saving mode, AISI 316 stainless steel isolated water tank, Adjustable temperature control, Tank capacity 16 lt / immediate draw-off 10 lt, Capacity 30 lt/hour",
      description: "KEF TB16 Warmer hot water dispenser with isolated water tank and adjustable temperature control for consistent service.",
    },
    tr: {
      name: "KEF TB16 Warmer",
      origin: "KEF Sıcak Su Dispenseri",
      tastingNotes: "Kullanıcı dostu yüksek çözünürlüklü ekran, Enerji tasarrufu için yalıtılmış su deposu, Eko modu, güç tasarrufu modu, Aisi 316 paslanmaz çelik yalıtımlı su deposu, Ayarlanabilir sıcaklık kontrolü, Tank kapasitesi 16 lt; anlık su çıkışı 10 lt, Kapasite 30L/saat",
      description: "KEF TB16 Warmer sıcak su dispenseri; izoleli su deposu ve ayarlanabilir sıcaklık kontrolü ile tutarlı servis sağlar.",
    }
  },
  'kef-tb16-steam': {
    en: {
      name: "KEF TB16 Steam",
      origin: "KEF Hot Water Dispenser",
      tastingNotes: "High definition display, Isolated water tank for energy saving, Eco mode, energy saving mode, AISI 316 stainless steel isolated water tank, Adjustable temperature control, Tank capacity 16 lt / immediate draw-off 10 lt, Capacity 30 lt/hour",
      description: "KEF TB16 Steam hot water dispenser with isolated water tank and adjustable temperature control for consistent service.",
    },
    tr: {
      name: "KEF TB16 Steam",
      origin: "KEF Sıcak Su Dispenseri",
      tastingNotes: "Kullanıcı dostu yüksek çözünürlüklü ekran, Enerji tasarrufu için yalıtılmış su deposu, Eko modu, güç tasarrufu modu, Aisi 316 paslanmaz çelik yalıtımlı su deposu, Ayarlanabilir sıcaklık kontrolü, Tank kapasitesi 16 lt; anlık su çıkışı 10 lt, Kapasite 30L/saat",
      description: "KEF TB16 Steam sıcak su dispenseri; izoleli su deposu ve ayarlanabilir sıcaklık kontrolü ile tutarlı servis sağlar.",
    }
  },
  'kef-wb8': {
    en: {
      name: "KEF WB8",
      origin: "KEF Hot Water Dispenser",
      tastingNotes: "High definition display, Isolated water tank for energy saving, Eco mode, energy saving mode, AISI 316 stainless steel isolated water tank, Adjustable temperature control, Tank capacity 8 lt / immediate draw-off 5.7 lt, Capacity 30 lt/hour",
      description: "KEF WB8 hot water dispenser with isolated water tank and adjustable temperature control for consistent service.",
    },
    tr: {
      name: "KEF WB8",
      origin: "KEF Sıcak Su Dispenseri",
      tastingNotes: "Kullanıcı dostu yüksek çözünürlüklü ekran, Enerji tasarrufu için yalıtılmış su deposu, Eko modu, güç tasarrufu modu, Aisi 316 paslanmaz çelik yalıtımlı su deposu, Ayarlanabilir sıcaklık kontrolü, Tank kapasitesi 8 lt; anlık çıkışı 5,7 lt, Kapasite 30L/saat",
      description: "KEF WB8 sıcak su dispenseri; izoleli su deposu ve ayarlanabilir sıcaklık kontrolü ile tutarlı servis sağlar.",
    }
  },
  'kef-wb16': {
    en: {
      name: "KEF WB16",
      origin: "KEF Hot Water Dispenser",
      tastingNotes: "High definition display, Isolated water tank for energy saving, Eco mode, energy saving mode, AISI 316 stainless steel isolated water tank, Adjustable temperature control, Tank capacity 12 lt / immediate draw-off 8.5 lt, Capacity 30 lt/hour",
      description: "KEF WB16 hot water dispenser with isolated water tank and adjustable temperature control for consistent service.",
    },
    tr: {
      name: "KEF WB16",
      origin: "KEF Sıcak Su Dispenseri",
      tastingNotes: "Kullanıcı dostu yüksek çözünürlüklü ekran, Enerji tasarrufu için izole su deposu, Eko modu, enerji tasarrufu modu, Aisi 316 paslanmaz çelik izoleli su deposu, Ayarlanabilir sıcaklık kontrolü, Tank kapasitesi 12 lt; anlık su çıkışı 8,5 lt, Kapasite 30 lt/saat",
      description: "KEF WB16 sıcak su dispenseri; izoleli su deposu ve ayarlanabilir sıcaklık kontrolü ile tutarlı servis sağlar.",
    }
  },
  'kef-magia-boiler-mb16': {
    en: {
      name: "KEF MB16",
      origin: "KEF Undercounter Boiler",
      tastingNotes: "4.3 inch touchscreen undercounter boiler, Isolated water tank for energy saving, AISI 316 stainless steel isolated water tank, Manual access to mains water supply, Adjustable temperature control, Live temperature readout, Tank capacity 12/19 lt; draw-off 9/15 lt, 3 adjustable dosing programs",
      description: "KEF Magia Boiler MB16 undercounter boiler with touchscreen control and adjustable dosing programs.",
    },
    tr: {
      name: "KEF MB16",
      origin: "KEF Tezgah Altı Kazan",
      tastingNotes: "4,3 inç Dokunmatik Ekranlı Tezgah Altı Kazan, Enerji tasarrufu için izole su tankı, AISI 316 paslanmaz çelik izole su tankı, Manuel şebeke suyu alma imkanı, Ayarlanabilir sıcaklık kontrolü, Canlı sıcaklık okuma, Tank kapasitesi 12/19 lt; anlık çıkışı 9/15 lt, 3 Ayarlanabilir dozaj programı",
      description: "KEF Magia Boiler MB16 tezgah altı kazan; dokunmatik ekran kontrolü ve ayarlanabilir dozaj programlarına sahiptir.",
    }
  },
  'kef-magia-boiler-mb16-duo': {
    en: {
      name: "KEF MB16 Duo",
      origin: "KEF Undercounter Boiler",
      tastingNotes: "4.3 inch touchscreen undercounter boiler, Isolated water tank for energy saving, AISI 316 stainless steel isolated water tank, Manual access to mains water supply, Adjustable temperature control, Live temperature readout, Dual tank, higher capacity, 3 adjustable dosing programs",
      description: "KEF Magia Boiler MB16 Duo undercounter boiler with touchscreen control and adjustable dosing programs.",
    },
    tr: {
      name: "KEF MB16 Duo",
      origin: "KEF Tezgah Altı Kazan",
      tastingNotes: "4,3 inç Dokunmatik Ekranlı Tezgah Altı Kazan, Enerji tasarrufu için izole su tankı, AISI 316 paslanmaz çelik izole su tankı, Manuel şebeke suyu alma imkanı, Ayarlanabilir sıcaklık kontrolü, Canlı sıcaklık okuma, Çift tanklı, yüksek kapasiteli, 3 Ayarlanabilir dozaj programı",
      description: "KEF Magia Boiler MB16 Duo tezgah altı kazan; dokunmatik ekran kontrolü ve ayarlanabilir dozaj programlarına sahiptir.",
    }
  },
  'kef-magia-dose-md16': {
    en: {
      name: "KEF MD16",
      origin: "KEF Undercounter Beverage Dispenser",
      tastingNotes: "7 inch touchscreen undercounter beverage dispenser, 3 adjustable drink programs, Ability to dispense hot, cold, or mixed beverages, AISI 304 stainless steel body, Adjustable volume control, Integrated water connection, Easy-to-clean tap and removable drip tray, Automatic on/off",
      description: "KEF Magia Dose MD16 undercounter beverage dispenser for hot, cold, or mixed drinks with automatic on/off.",
    },
    tr: {
      name: "KEF MD16",
      origin: "KEF Tezgah Altı İçecek Dağıtıcı",
      tastingNotes: "7 inç Dokunmatik Ekranlı Tezgah Altı İçecek Dağıtıcı, 3 ayrı programlanabilir içecek seçeneği, Sıcak, soğuk ve karışık içecek hazırlama imkanı, Paslanmaz çelik gövde (AISI 304), Hacim kontrolü, Dahili su bağlantısı, Kolay temizlenebilir musluk ve damlama tepsisi, Otomatik açma/kapama",
      description: "KEF Magia Dose MD16 tezgah altı içecek dağıtıcı; sıcak, soğuk veya karışık içecekler için otomatik açma/kapama özelliğine sahiptir.",
    }
  },
  'kef-flt120-g1': {
    en: {
      name: "KEF FLT120 (G1)",
      origin: "KEF Filter Coffee Machine — Graffiti Edition",
      tastingNotes: "Hot plates that can be used separately, Dry-boil protection, Fast brewing time (6 min.), Capacity 144 cup/hour, 1.8 lt glass jug capacity, Graffiti-design finish",
      description: "KEF FLT120 (G1) filter coffee machine in a limited graffiti-design finish for standout café counters.",
    },
    tr: {
      name: "KEF FLT120 (G1)",
      origin: "KEF Filtre Kahve Makinesi — Grafiti Tasarım",
      tastingNotes: "Birbirinden bağımsız kullanılabilen ısıtıcılar, Susuz çalışma koruması, Hızlı demleme süresi (6 dakika), Kapasite 144 fincan/saat, 1.8 lt cam pot kapasitesi, Grafiti tasarımlı kaplama",
      description: "KEF FLT120 (G1) filtre kahve makinesi; kafe tezgahlarında dikkat çeken sınırlı grafiti tasarımlı kaplamayla sunulur.",
    }
  },
  'kef-flt120-2-g1': {
    en: {
      name: "KEF FLT120-2 (G1)",
      origin: "KEF Filter Coffee Machine — Graffiti Edition",
      tastingNotes: "Hot plates that can be used separately, Dry-boil protection, Fast brewing time (6 min.), Capacity 144 cup/hour, 1.8 lt glass jug capacity, Graffiti-design finish",
      description: "KEF FLT120-2 (G1) filter coffee machine in a limited graffiti-design finish for standout café counters.",
    },
    tr: {
      name: "KEF FLT120-2 (G1)",
      origin: "KEF Filtre Kahve Makinesi — Grafiti Tasarım",
      tastingNotes: "Birbirinden bağımsız kullanılabilen ısıtıcılar, Susuz çalışma koruması, Hızlı demleme süresi (6 dakika), Kapasite 144 fincan/saat, 1.8 lt cam pot kapasitesi, Grafiti tasarımlı kaplama",
      description: "KEF FLT120-2 (G1) filtre kahve makinesi; kafe tezgahlarında dikkat çeken sınırlı grafiti tasarımlı kaplamayla sunulur.",
    }
  },
  'kef-flt120-g2': {
    en: {
      name: "KEF FLT120 (G2)",
      origin: "KEF Filter Coffee Machine — Graffiti Edition",
      tastingNotes: "Hot plates that can be used separately, Dry-boil protection, Fast brewing time (6 min.), Capacity 144 cup/hour, 1.8 lt glass jug capacity, Graffiti-design finish",
      description: "KEF FLT120 (G2) filter coffee machine in a limited graffiti-design finish for standout café counters.",
    },
    tr: {
      name: "KEF FLT120 (G2)",
      origin: "KEF Filtre Kahve Makinesi — Grafiti Tasarım",
      tastingNotes: "Birbirinden bağımsız kullanılabilen ısıtıcılar, Susuz çalışma koruması, Hızlı demleme süresi (6 dakika), Kapasite 144 fincan/saat, 1.8 lt cam pot kapasitesi, Grafiti tasarımlı kaplama",
      description: "KEF FLT120 (G2) filtre kahve makinesi; kafe tezgahlarında dikkat çeken sınırlı grafiti tasarımlı kaplamayla sunulur.",
    }
  },
  'kef-flt120-2-g2': {
    en: {
      name: "KEF FLT120-2 (G2)",
      origin: "KEF Filter Coffee Machine — Graffiti Edition",
      tastingNotes: "Hot plates that can be used separately, Dry-boil protection, Fast brewing time (6 min.), Capacity 144 cup/hour, 1.8 lt glass jug capacity, Graffiti-design finish",
      description: "KEF FLT120-2 (G2) filter coffee machine in a limited graffiti-design finish for standout café counters.",
    },
    tr: {
      name: "KEF FLT120-2 (G2)",
      origin: "KEF Filtre Kahve Makinesi — Grafiti Tasarım",
      tastingNotes: "Birbirinden bağımsız kullanılabilen ısıtıcılar, Susuz çalışma koruması, Hızlı demleme süresi (6 dakika), Kapasite 144 fincan/saat, 1.8 lt cam pot kapasitesi, Grafiti tasarımlı kaplama",
      description: "KEF FLT120-2 (G2) filtre kahve makinesi; kafe tezgahlarında dikkat çeken sınırlı grafiti tasarımlı kaplamayla sunulur.",
    }
  },
  'kef-flt120-g3': {
    en: {
      name: "KEF FLT120 (G3)",
      origin: "KEF Filter Coffee Machine — Graffiti Edition",
      tastingNotes: "Hot plates that can be used separately, Dry-boil protection, Fast brewing time (6 min.), Capacity 144 cup/hour, 1.8 lt glass jug capacity, Graffiti-design finish",
      description: "KEF FLT120 (G3) filter coffee machine in a limited graffiti-design finish for standout café counters.",
    },
    tr: {
      name: "KEF FLT120 (G3)",
      origin: "KEF Filtre Kahve Makinesi — Grafiti Tasarım",
      tastingNotes: "Birbirinden bağımsız kullanılabilen ısıtıcılar, Susuz çalışma koruması, Hızlı demleme süresi (6 dakika), Kapasite 144 fincan/saat, 1.8 lt cam pot kapasitesi, Grafiti tasarımlı kaplama",
      description: "KEF FLT120 (G3) filtre kahve makinesi; kafe tezgahlarında dikkat çeken sınırlı grafiti tasarımlı kaplamayla sunulur.",
    }
  },
  'kef-flt120-2-g3': {
    en: {
      name: "KEF FLT120-2 (G3)",
      origin: "KEF Filter Coffee Machine — Graffiti Edition",
      tastingNotes: "Hot plates that can be used separately, Dry-boil protection, Fast brewing time (6 min.), Capacity 144 cup/hour, 1.8 lt glass jug capacity, Graffiti-design finish",
      description: "KEF FLT120-2 (G3) filter coffee machine in a limited graffiti-design finish for standout café counters.",
    },
    tr: {
      name: "KEF FLT120-2 (G3)",
      origin: "KEF Filtre Kahve Makinesi — Grafiti Tasarım",
      tastingNotes: "Birbirinden bağımsız kullanılabilen ısıtıcılar, Susuz çalışma koruması, Hızlı demleme süresi (6 dakika), Kapasite 144 fincan/saat, 1.8 lt cam pot kapasitesi, Grafiti tasarımlı kaplama",
      description: "KEF FLT120-2 (G3) filtre kahve makinesi; kafe tezgahlarında dikkat çeken sınırlı grafiti tasarımlı kaplamayla sunulur.",
    }
  },
  'kef-cmp-1': {
    en: {
      name: "KEF CMP-1",
      origin: "KEF Accessory",
      tastingNotes: "1.8 lt glass jug",
      description: "KEF CMP-1 replacement brewing vessel, compatible with KEF filter coffee machines.",
    },
    tr: {
      name: "KEF CMP-1",
      origin: "KEF Aksesuar",
      tastingNotes: "1,8 lt cam pot",
      description: "KEF CMP-1, KEF filtre kahve makineleriyle uyumlu yedek demleme haznesi.",
    }
  },
  'kef-t1-9': {
    en: {
      name: "KEF T1-9",
      origin: "KEF Accessory",
      tastingNotes: "1.9 lt thermos",
      description: "KEF T1-9 replacement brewing vessel, compatible with KEF filter coffee machines.",
    },
    tr: {
      name: "KEF T1-9",
      origin: "KEF Aksesuar",
      tastingNotes: "1,9 lt termos",
      description: "KEF T1-9, KEF filtre kahve makineleriyle uyumlu yedek demleme haznesi.",
    }
  },
  'kef-fk925': {
    en: {
      name: "KEF FK925",
      origin: "KEF Filter Paper",
      tastingNotes: "1000x 90/250 filter paper",
      description: "KEF FK925 paper filters for KEF filter coffee machines, box of the listed quantity.",
    },
    tr: {
      name: "KEF FK925",
      origin: "KEF Filtre Kağıdı",
      tastingNotes: "1000x 90/250 Filtre Kağıdı",
      description: "KEF FK925 filtre kağıdı, KEF filtre kahve makineleri için belirtilen adette kutu halinde.",
    }
  },
  'kef-fk1125': {
    en: {
      name: "KEF FK1125",
      origin: "KEF Filter Paper",
      tastingNotes: "1000x 110/250 filter paper",
      description: "KEF FK1125 paper filters for KEF filter coffee machines, box of the listed quantity.",
    },
    tr: {
      name: "KEF FK1125",
      origin: "KEF Filtre Kağıdı",
      tastingNotes: "1000x 110/250 Filtre Kağıdı",
      description: "KEF FK1125 filtre kağıdı, KEF filtre kahve makineleri için belirtilen adette kutu halinde.",
    }
  },
  'kef-fk1133': {
    en: {
      name: "KEF FK1133",
      origin: "KEF Filter Paper",
      tastingNotes: "500x 110/330 filter paper",
      description: "KEF FK1133 paper filters for KEF filter coffee machines, box of the listed quantity.",
    },
    tr: {
      name: "KEF FK1133",
      origin: "KEF Filtre Kağıdı",
      tastingNotes: "500x 110/330 Filtre Kağıdı",
      description: "KEF FK1133 filtre kağıdı, KEF filtre kahve makineleri için belirtilen adette kutu halinde.",
    }
  },
  'kef-fk1136': {
    en: {
      name: "KEF FK1136",
      origin: "KEF Filter Paper",
      tastingNotes: "500x 110/360 filter paper",
      description: "KEF FK1136 paper filters for KEF filter coffee machines, box of the listed quantity.",
    },
    tr: {
      name: "KEF FK1136",
      origin: "KEF Filtre Kağıdı",
      tastingNotes: "500x 110/360 Filtre Kağıdı",
      description: "KEF FK1136 filtre kağıdı, KEF filtre kahve makineleri için belirtilen adette kutu halinde.",
    }
  },
  'kef-t2-2': {
    en: {
      name: "KEF T2-2",
      origin: "KEF Accessory",
      tastingNotes: "2.2 lt air flask (pump thermos)",
      description: "KEF T2-2 replacement brewing vessel, compatible with KEF filter coffee machines.",
    },
    tr: {
      name: "KEF T2-2",
      origin: "KEF Aksesuar",
      tastingNotes: "2,2 lt pompalı termos",
      description: "KEF T2-2, KEF filtre kahve makineleriyle uyumlu yedek demleme haznesi.",
    }
  },
  'kef-t2-5': {
    en: {
      name: "KEF T2-5",
      origin: "KEF Vacuum Beverage Dispenser",
      tastingNotes: "2.5 lt vacuum beverage dispenser",
      description: "KEF T2-5 vacuum-insulated beverage dispenser that keeps brewed coffee hot for hours without a hot plate.",
    },
    tr: {
      name: "KEF T2-5",
      origin: "KEF Vakumlu İçecek Dispenseri",
      tastingNotes: "2,5 lt vakumlu içecek dispenseri",
      description: "KEF T2-5, sıcak plakaya ihtiyaç duymadan demlenen kahveyi saatlerce sıcak tutan vakumlu izoleli içecek dispenseridir.",
    }
  },
  'kef-t6-0': {
    en: {
      name: "KEF T6-0",
      origin: "KEF Vacuum Beverage Dispenser",
      tastingNotes: "6 lt vacuum beverage dispenser",
      description: "KEF T6-0 vacuum-insulated beverage dispenser that keeps brewed coffee hot for hours without a hot plate.",
    },
    tr: {
      name: "KEF T6-0",
      origin: "KEF Vakumlu İçecek Dispenseri",
      tastingNotes: "6 lt vakumlu içecek dispenseri",
      description: "KEF T6-0, sıcak plakaya ihtiyaç duymadan demlenen kahveyi saatlerce sıcak tutan vakumlu izoleli içecek dispenseridir.",
    }
  },
  'kef-ts3-8': {
    en: {
      name: "KEF TS3-8",
      origin: "KEF Vacuum Beverage Dispenser",
      tastingNotes: "3.8 lt vacuum beverage dispenser",
      description: "KEF TS3-8 vacuum-insulated beverage dispenser that keeps brewed coffee hot for hours without a hot plate.",
    },
    tr: {
      name: "KEF TS3-8",
      origin: "KEF Vakumlu İçecek Dispenseri",
      tastingNotes: "3,8 lt vakumlu içecek dispenseri",
      description: "KEF TS3-8, sıcak plakaya ihtiyaç duymadan demlenen kahveyi saatlerce sıcak tutan vakumlu izoleli içecek dispenseridir.",
    }
  },
  'kef-ts5-7': {
    en: {
      name: "KEF TS5-7",
      origin: "KEF Vacuum Beverage Dispenser",
      tastingNotes: "5.7 lt vacuum beverage dispenser with stand",
      description: "KEF TS5-7 vacuum-insulated beverage dispenser that keeps brewed coffee hot for hours without a hot plate.",
    },
    tr: {
      name: "KEF TS5-7",
      origin: "KEF Vakumlu İçecek Dispenseri",
      tastingNotes: "5,7 lt vakumlu içecek dispenseri standlı",
      description: "KEF TS5-7, sıcak plakaya ihtiyaç duymadan demlenen kahveyi saatlerce sıcak tutan vakumlu izoleli içecek dispenseridir.",
    }
  },
  'kef-ts7-6': {
    en: {
      name: "KEF TS7-6",
      origin: "KEF Vacuum Beverage Dispenser",
      tastingNotes: "7.6 lt vacuum beverage dispenser with stand",
      description: "KEF TS7-6 vacuum-insulated beverage dispenser that keeps brewed coffee hot for hours without a hot plate.",
    },
    tr: {
      name: "KEF TS7-6",
      origin: "KEF Vakumlu İçecek Dispenseri",
      tastingNotes: "7,6 lt vakumlu içecek dispenseri standlı",
      description: "KEF TS7-6, sıcak plakaya ihtiyaç duymadan demlenen kahveyi saatlerce sıcak tutan vakumlu izoleli içecek dispenseridir.",
    }
  },
  'kef-t3-8': {
    en: {
      name: "KEF T3-8",
      origin: "KEF Vacuum Beverage Dispenser",
      tastingNotes: "3.8 lt vacuum beverage dispenser",
      description: "KEF T3-8 vacuum-insulated beverage dispenser that keeps brewed coffee hot for hours without a hot plate.",
    },
    tr: {
      name: "KEF T3-8",
      origin: "KEF Vakumlu İçecek Dispenseri",
      tastingNotes: "3,8 lt vakumlu içecek dispenseri",
      description: "KEF T3-8, sıcak plakaya ihtiyaç duymadan demlenen kahveyi saatlerce sıcak tutan vakumlu izoleli içecek dispenseridir.",
    }
  },
  'kef-t5-7': {
    en: {
      name: "KEF T5-7",
      origin: "KEF Vacuum Beverage Dispenser",
      tastingNotes: "5.7 lt vacuum beverage dispenser",
      description: "KEF T5-7 vacuum-insulated beverage dispenser that keeps brewed coffee hot for hours without a hot plate.",
    },
    tr: {
      name: "KEF T5-7",
      origin: "KEF Vakumlu İçecek Dispenseri",
      tastingNotes: "5,7 lt vakumlu içecek dispenseri",
      description: "KEF T5-7, sıcak plakaya ihtiyaç duymadan demlenen kahveyi saatlerce sıcak tutan vakumlu izoleli içecek dispenseridir.",
    }
  },
  'kef-t7-6': {
    en: {
      name: "KEF T7-6",
      origin: "KEF Vacuum Beverage Dispenser",
      tastingNotes: "7.6 lt vacuum beverage dispenser",
      description: "KEF T7-6 vacuum-insulated beverage dispenser that keeps brewed coffee hot for hours without a hot plate.",
    },
    tr: {
      name: "KEF T7-6",
      origin: "KEF Vakumlu İçecek Dispenseri",
      tastingNotes: "7,6 lt vakumlu içecek dispenseri",
      description: "KEF T7-6, sıcak plakaya ihtiyaç duymadan demlenen kahveyi saatlerce sıcak tutan vakumlu izoleli içecek dispenseridir.",
    }
  },
  'kef-s1': {
    en: {
      name: "KEF S1",
      origin: "KEF Jug Warmer",
      tastingNotes: "1 jug warmer plate",
      description: "KEF S1 hot plate warmer for keeping glass coffee jugs at serving temperature.",
    },
    tr: {
      name: "KEF S1",
      origin: "KEF Pot Isıtıcısı",
      tastingNotes: "1 Pot Isıtıcı",
      description: "KEF S1, cam kahve potlarını servis sıcaklığında tutan ısıtıcı plakadır.",
    }
  },
  'kef-s2': {
    en: {
      name: "KEF S2",
      origin: "KEF Jug Warmer",
      tastingNotes: "2 jug warmer plate",
      description: "KEF S2 hot plate warmer for keeping glass coffee jugs at serving temperature.",
    },
    tr: {
      name: "KEF S2",
      origin: "KEF Pot Isıtıcısı",
      tastingNotes: "2 Pot Isıtıcı",
      description: "KEF S2, cam kahve potlarını servis sıcaklığında tutan ısıtıcı plakadır.",
    }
  },
  'kef-as1': {
    en: {
      name: "KEF AS1",
      origin: "KEF Airpot Station",
      tastingNotes: "Single airpot station",
      description: "KEF AS1 airpot display station for holding thermal coffee dispensers at the service counter.",
    },
    tr: {
      name: "KEF AS1",
      origin: "KEF Airpot İstasyonu",
      tastingNotes: "Tekli Airpot İstasyonu",
      description: "KEF AS1, servis tezgahında termal kahve dispenserlerini tutan airpot sunum istasyonudur.",
    }
  },
  'kef-as2': {
    en: {
      name: "KEF AS2",
      origin: "KEF Airpot Station",
      tastingNotes: "Double airpot station",
      description: "KEF AS2 airpot display station for holding thermal coffee dispensers at the service counter.",
    },
    tr: {
      name: "KEF AS2",
      origin: "KEF Airpot İstasyonu",
      tastingNotes: "Çiftli Airpot İstasyonu",
      description: "KEF AS2, servis tezgahında termal kahve dispenserlerini tutan airpot sunum istasyonudur.",
    }
  },
  'dc-zero-plus-2gr': {
    en: {
      name: "Dalla Corte ZERO PLUS 2 GR",
      origin: "Dalla Corte Espresso Coffee Machine",
      tastingNotes: "2-3 group espresso machine, Cool touch steam wand and Super Dry system, Patented multi-boiler technology, Hot water and steam boiler: 7.5 liters, Coffee water boilers: 0.75 liters, Volumetric dosing, Each group temperature adjustable ±0.1°, 54mm and 58mm diameter porta filters, 2 standard hand-free steam wands, 1 hot water tap, Auto cleaning feature",
      description: "Dalla Corte ZERO PLUS 2 GR professional multi-boiler espresso machine with volumetric dosing and independently adjustable group temperatures.",
    },
    tr: {
      name: "Dalla Corte ZERO PLUS 2 GR",
      origin: "Dalla Corte Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu espresso kahve makinesi, El yakmaz buhar çubukları ve kuru buhar sistemi, Patentli multi-boiler teknolojisi, Sıcak su ve buhar kazanı: 7.5 litre, Kahve suyu kazanları: 0.75 litre, Volumetric dozajlama, Her grubun sıcaklığı ayrı ayrı ±0.1 derece ayarlanabilir, 54 mm ve 58 mm çapında porta filtre kullanılabilir, 2 adet standart el yakmaz buhar çubuğu ve 1 adet standart el yakmaz sıcak su musluğu, Oto Temizlik Özelliği",
      description: "Dalla Corte ZERO PLUS 2 GR, volumetrik dozajlama ve bağımsız ayarlanabilen grup sıcaklıklarına sahip profesyonel multi-boiler espresso makinesidir.",
    }
  },
  'dc-zero-plus-3gr': {
    en: {
      name: "Dalla Corte ZERO PLUS 3 GR",
      origin: "Dalla Corte Espresso Coffee Machine",
      tastingNotes: "2-3 group espresso machine, Cool touch steam wand and Super Dry system, Patented multi-boiler technology, Hot water and steam boiler: 7.5 liters, Coffee water boilers: 0.75 liters, Volumetric dosing, Each group temperature adjustable ±0.1°, 54mm and 58mm diameter porta filters, 2 standard hand-free steam wands, 1 hot water tap, Auto cleaning feature",
      description: "Dalla Corte ZERO PLUS 3 GR professional multi-boiler espresso machine with volumetric dosing and independently adjustable group temperatures.",
    },
    tr: {
      name: "Dalla Corte ZERO PLUS 3 GR",
      origin: "Dalla Corte Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu espresso kahve makinesi, El yakmaz buhar çubukları ve kuru buhar sistemi, Patentli multi-boiler teknolojisi, Sıcak su ve buhar kazanı: 7.5 litre, Kahve suyu kazanları: 0.75 litre, Volumetric dozajlama, Her grubun sıcaklığı ayrı ayrı ±0.1 derece ayarlanabilir, 54 mm ve 58 mm çapında porta filtre kullanılabilir, 2 adet standart el yakmaz buhar çubuğu ve 1 adet standart el yakmaz sıcak su musluğu, Oto Temizlik Özelliği",
      description: "Dalla Corte ZERO PLUS 3 GR, volumetrik dozajlama ve bağımsız ayarlanabilen grup sıcaklıklarına sahip profesyonel multi-boiler espresso makinesidir.",
    }
  },
  'dc-xt-barista-2gr': {
    en: {
      name: "Dalla Corte XT BARISTA 2 GR",
      origin: "Dalla Corte Espresso Coffee Machine",
      tastingNotes: "2-3 group espresso machine, Communication with the grinder via patented serial cable connection, Patented multi-boiler technology, Hot water and steam boiler: 7.5 liters, Coffee water boilers: 0.5 liters, Volumetric dosing, flow rate control, Dispenses coffee in grams/second with mechanical and digital adjustment, 54mm and 58mm diameter porta filters, 2 standard hand-free steam wands, 1 hot water tap, Auto cleaning feature",
      description: "Dalla Corte XT BARISTA 2 GR professional multi-boiler espresso machine with volumetric dosing and independently adjustable group temperatures.",
    },
    tr: {
      name: "Dalla Corte XT BARISTA 2 GR",
      origin: "Dalla Corte Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu espresso kahve makinesi, Patentli seri kablo bağlantısı ile değirmenle iletişim, Patentli multi-boiler teknolojisi, Sıcak su ve buhar kazanı: 7.5 litre, Kahve suyu kazanları: 0.5 litre, Volumetric dozajlama, akış debi kontrolü, Kullanımda gram/saniye olarak kahve verebilme, mekanik ve dijital ayar, 54 mm ve 58 mm çapında porta filtre kullanılabilir, 2 adet standart el yakmaz buhar çubuğu ve 1 adet standart el yakmaz sıcak su musluğu, Oto Temizlik Özelliği",
      description: "Dalla Corte XT BARISTA 2 GR, volumetrik dozajlama ve bağımsız ayarlanabilen grup sıcaklıklarına sahip profesyonel multi-boiler espresso makinesidir.",
    }
  },
  'dc-xt-barista-3gr': {
    en: {
      name: "Dalla Corte XT BARISTA 3 GR",
      origin: "Dalla Corte Espresso Coffee Machine",
      tastingNotes: "2-3 group espresso machine, Communication with the grinder via patented serial cable connection, Patented multi-boiler technology, Hot water and steam boiler: 7.5 liters, Coffee water boilers: 0.5 liters, Volumetric dosing, flow rate control, Dispenses coffee in grams/second with mechanical and digital adjustment, 54mm and 58mm diameter porta filters, 2 standard hand-free steam wands, 1 hot water tap, Auto cleaning feature",
      description: "Dalla Corte XT BARISTA 3 GR professional multi-boiler espresso machine with volumetric dosing and independently adjustable group temperatures.",
    },
    tr: {
      name: "Dalla Corte XT BARISTA 3 GR",
      origin: "Dalla Corte Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu espresso kahve makinesi, Patentli seri kablo bağlantısı ile değirmenle iletişim, Patentli multi-boiler teknolojisi, Sıcak su ve buhar kazanı: 7.5 litre, Kahve suyu kazanları: 0.5 litre, Volumetric dozajlama, akış debi kontrolü, Kullanımda gram/saniye olarak kahve verebilme, mekanik ve dijital ayar, 54 mm ve 58 mm çapında porta filtre kullanılabilir, 2 adet standart el yakmaz buhar çubuğu ve 1 adet standart el yakmaz sıcak su musluğu, Oto Temizlik Özelliği",
      description: "Dalla Corte XT BARISTA 3 GR, volumetrik dozajlama ve bağımsız ayarlanabilen grup sıcaklıklarına sahip profesyonel multi-boiler espresso makinesidir.",
    }
  },
  'dc-xt-classic-2gr': {
    en: {
      name: "Dalla Corte XT CLASSIC 2 GR",
      origin: "Dalla Corte Espresso Coffee Machine",
      tastingNotes: "2-3 group espresso machine, Communication with the grinder via patented serial cable connection, Patented multi-boiler technology, Hot water and steam boiler: 7.5 liters, Coffee water boilers: 0.5 liters, Volumetric dosing, Dispenses coffee in grams/second with mechanical and digital adjustment, 54mm and 58mm diameter porta filters, 2 standard hand-free steam wands, 1 hot water tap, Auto cleaning feature",
      description: "Dalla Corte XT CLASSIC 2 GR professional multi-boiler espresso machine with volumetric dosing and independently adjustable group temperatures.",
    },
    tr: {
      name: "Dalla Corte XT CLASSIC 2 GR",
      origin: "Dalla Corte Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu espresso kahve makinesi, Patentli seri kablo bağlantısı ile değirmenle iletişim, Patentli multi-boiler teknolojisi, Sıcak su ve buhar kazanı: 7.5 litre, Kahve suyu kazanları: 0.5 litre, Volumetric dozajlama, Kullanımda kaşık ve kaşık boilerini enerji tasarrufu için kapatabilme özelliği, 54 mm ve 58 mm çapında porta filtre kullanılabilir, 2 adet standart el yakmaz buhar çubuğu ve 1 adet standart el yakmaz sıcak su musluğu, Oto Temizlik Özelliği",
      description: "Dalla Corte XT CLASSIC 2 GR, volumetrik dozajlama ve bağımsız ayarlanabilen grup sıcaklıklarına sahip profesyonel multi-boiler espresso makinesidir.",
    }
  },
  'dc-xt-classic-3gr': {
    en: {
      name: "Dalla Corte XT CLASSIC 3 GR",
      origin: "Dalla Corte Espresso Coffee Machine",
      tastingNotes: "2-3 group espresso machine, Communication with the grinder via patented serial cable connection, Patented multi-boiler technology, Hot water and steam boiler: 7.5 liters, Coffee water boilers: 0.5 liters, Volumetric dosing, Dispenses coffee in grams/second with mechanical and digital adjustment, 54mm and 58mm diameter porta filters, 2 standard hand-free steam wands, 1 hot water tap, Auto cleaning feature",
      description: "Dalla Corte XT CLASSIC 3 GR professional multi-boiler espresso machine with volumetric dosing and independently adjustable group temperatures.",
    },
    tr: {
      name: "Dalla Corte XT CLASSIC 3 GR",
      origin: "Dalla Corte Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu espresso kahve makinesi, Patentli seri kablo bağlantısı ile değirmenle iletişim, Patentli multi-boiler teknolojisi, Sıcak su ve buhar kazanı: 7.5 litre, Kahve suyu kazanları: 0.5 litre, Volumetric dozajlama, Kullanımda kaşık ve kaşık boilerini enerji tasarrufu için kapatabilme özelliği, 54 mm ve 58 mm çapında porta filtre kullanılabilir, 2 adet standart el yakmaz buhar çubuğu ve 1 adet standart el yakmaz sıcak su musluğu, Oto Temizlik Özelliği",
      description: "Dalla Corte XT CLASSIC 3 GR, volumetrik dozajlama ve bağımsız ayarlanabilen grup sıcaklıklarına sahip profesyonel multi-boiler espresso makinesidir.",
    }
  },
  'dc-icon-hv-2gr': {
    en: {
      name: "Dalla Corte ICON HV 2 GR",
      origin: "Dalla Corte Espresso Coffee Machine",
      tastingNotes: "2-3 group espresso machine, Communication with the grinder via patented serial cable connection, Patented multi-boiler technology, Hot water and steam boiler: 7.5 liters, Coffee water boilers: 0.5 liters, Volumetric dosing, Dispenses coffee in grams/second with mechanical and digital adjustment, 54mm and 58mm diameter porta filters, 2 steam wands and 1 standard hot water tap, Tall cup version — net price difference: 525 Euros",
      description: "Dalla Corte ICON HV 2 GR professional multi-boiler espresso machine with volumetric dosing and independently adjustable group temperatures.",
    },
    tr: {
      name: "Dalla Corte ICON HV 2 GR",
      origin: "Dalla Corte Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu espresso kahve makinesi, Patentli seri kablo bağlantısı ile değirmenle iletişim, Patentli multi-boiler teknolojisi, Sıcak su ve buhar kazanı: 7.5 litre, Kahve suyu kazanları: 0.5 litre, Volumetric dozajlama ve ±0.1 derece ısı ayarı, Kullanımda olmayan kaşık ve kaşık boilerini enerji tasarrufu için kapatabilme özelliği, 54 mm ve 58 mm çapında porta filtre kullanılabilir, 2 adet buhar çubukları ve 1 adet sıcak su musluğu, Yüksek şase - net fiyat farkı: 525 Euro",
      description: "Dalla Corte ICON HV 2 GR, volumetrik dozajlama ve bağımsız ayarlanabilen grup sıcaklıklarına sahip profesyonel multi-boiler espresso makinesidir.",
    }
  },
  'dc-icon-hv-3gr': {
    en: {
      name: "Dalla Corte ICON HV 3 GR",
      origin: "Dalla Corte Espresso Coffee Machine",
      tastingNotes: "2-3 group espresso machine, Communication with the grinder via patented serial cable connection, Patented multi-boiler technology, Hot water and steam boiler: 7.5 liters, Coffee water boilers: 0.5 liters, Volumetric dosing, Dispenses coffee in grams/second with mechanical and digital adjustment, 54mm and 58mm diameter porta filters, 2 steam wands and 1 standard hot water tap, Tall cup version — net price difference: 525 Euros",
      description: "Dalla Corte ICON HV 3 GR professional multi-boiler espresso machine with volumetric dosing and independently adjustable group temperatures.",
    },
    tr: {
      name: "Dalla Corte ICON HV 3 GR",
      origin: "Dalla Corte Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu espresso kahve makinesi, Patentli seri kablo bağlantısı ile değirmenle iletişim, Patentli multi-boiler teknolojisi, Sıcak su ve buhar kazanı: 7.5 litre, Kahve suyu kazanları: 0.5 litre, Volumetric dozajlama ve ±0.1 derece ısı ayarı, Kullanımda olmayan kaşık ve kaşık boilerini enerji tasarrufu için kapatabilme özelliği, 54 mm ve 58 mm çapında porta filtre kullanılabilir, 2 adet buhar çubukları ve 1 adet sıcak su musluğu, Yüksek şase - net fiyat farkı: 525 Euro",
      description: "Dalla Corte ICON HV 3 GR, volumetrik dozajlama ve bağımsız ayarlanabilen grup sıcaklıklarına sahip profesyonel multi-boiler espresso makinesidir.",
    }
  },
  'dc-evo-hv-2gr': {
    en: {
      name: "Dalla Corte EVO HV 2 GR",
      origin: "Dalla Corte Espresso Coffee Machine",
      tastingNotes: "2-3 group espresso machine, Communication with the grinder via patented serial cable connection, Patented multi-boiler technology, Hot water and steam boiler: 7.5 liters, Coffee water boilers: 0.5 liters, Volumetric dosing ±0.1° heat adjustment, Dispenses coffee in grams/second with mechanical and digital adjustment, 54mm diameter porta filters, 2 steam wands and 1 hot water tap, Tall cup version",
      description: "Dalla Corte EVO HV 2 GR professional multi-boiler espresso machine with volumetric dosing and independently adjustable group temperatures.",
    },
    tr: {
      name: "Dalla Corte EVO HV 2 GR",
      origin: "Dalla Corte Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu espresso kahve makinesi, Patentli seri kablo bağlantısı ile değirmenle iletişim, Patentli multi-boiler teknolojisi, Sıcak su ve buhar kazanı: 7.5 litre, Kahve suyu kazanları: 0.5 litre, Volumetric dozajlama ve ±0.1 derece ısı ayarı, Kullanımda olmayan kaşık ve kaşık boilerini enerji tasarrufu için kapatabilme özelliği, 54 mm çapında porta filtre kullanılabilir, 2 adet buhar çubukları ve 1 adet sıcak su musluğu, Yüksek şase",
      description: "Dalla Corte EVO HV 2 GR, volumetrik dozajlama ve bağımsız ayarlanabilen grup sıcaklıklarına sahip profesyonel multi-boiler espresso makinesidir.",
    }
  },
  'dc-evo-hv-3gr': {
    en: {
      name: "Dalla Corte EVO HV 3 GR",
      origin: "Dalla Corte Espresso Coffee Machine",
      tastingNotes: "2-3 group espresso machine, Communication with the grinder via patented serial cable connection, Patented multi-boiler technology, Hot water and steam boiler: 7.5 liters, Coffee water boilers: 0.5 liters, Volumetric dosing ±0.1° heat adjustment, Dispenses coffee in grams/second with mechanical and digital adjustment, 54mm diameter porta filters, 2 steam wands and 1 hot water tap, Tall cup version",
      description: "Dalla Corte EVO HV 3 GR professional multi-boiler espresso machine with volumetric dosing and independently adjustable group temperatures.",
    },
    tr: {
      name: "Dalla Corte EVO HV 3 GR",
      origin: "Dalla Corte Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu espresso kahve makinesi, Patentli seri kablo bağlantısı ile değirmenle iletişim, Patentli multi-boiler teknolojisi, Sıcak su ve buhar kazanı: 7.5 litre, Kahve suyu kazanları: 0.5 litre, Volumetric dozajlama ve ±0.1 derece ısı ayarı, Kullanımda olmayan kaşık ve kaşık boilerini enerji tasarrufu için kapatabilme özelliği, 54 mm çapında porta filtre kullanılabilir, 2 adet buhar çubukları ve 1 adet sıcak su musluğu, Yüksek şase",
      description: "Dalla Corte EVO HV 3 GR, volumetrik dozajlama ve bağımsız ayarlanabilen grup sıcaklıklarına sahip profesyonel multi-boiler espresso makinesidir.",
    }
  },
  'dc-mina': {
    en: {
      name: "Dalla Corte MINA",
      origin: "Dalla Corte Espresso Coffee Machine",
      tastingNotes: "1 group espresso coffee machine, Patented multi-boiler technology, Hot water and steam boiler: 3 liters, Coffee water boiler: 0.5 liters, Volumetric dosing and ±0.1 degree heat adjustment, Dispenses coffee in grams/second, 54mm diameter porta filter, Coffee brewing profiles can be set via the phone application",
      description: "Dalla Corte MINA single-group espresso machine with patented multi-boiler technology, built for home baristas.",
    },
    tr: {
      name: "Dalla Corte MINA",
      origin: "Dalla Corte Espresso Kahve Makinesi",
      tastingNotes: "1 gruplu espresso kahve makinesi, Patentli multi-boiler teknolojisi, Sıcak su ve buhar kazanı: 3 litre, Kahve suyu kazanı: 0.5 litre, Volumetric dozajlama ve ±0.1 derece ısı ayarı, Kahveyi gram/saniye olarak verebilme, 54 mm çapında porta filtre kullanılabilir, Telefon uygulamasıyla kahve demlenme profilleri ayarlanabilir",
      description: "Dalla Corte MINA, ev baristaları için üretilmiş, patentli multi-boiler teknolojisine sahip tek gruplu espresso makinesidir.",
    }
  },
  'dc-studio-aqua': {
    en: {
      name: "Dalla Corte STUDIO AQUA",
      origin: "Dalla Corte Espresso Coffee Machine",
      tastingNotes: "Home barista coffee machine, Hot water boiler 2.5 lt, Coffee group boiler 0.5 lt, Digital display, Professional temperature meter, Personal setting optimization, Rotary pump, PID temperature control",
      description: "Dalla Corte STUDIO AQUA single-group espresso machine with patented multi-boiler technology, built for home baristas.",
    },
    tr: {
      name: "Dalla Corte STUDIO AQUA",
      origin: "Dalla Corte Espresso Kahve Makinesi",
      tastingNotes: "Ev Barista kahve makinesi, Sıcak Su Kazanı 2.5 Lt, Kahve Grup Kazanı 0.5 L, Dijital Ekran, Profesyonel Sıcaklık Ölçer, Kişisel Ayar Optimizasyonu, Rotary pompası, Sıcaklık kontrolü (PID)",
      description: "Dalla Corte STUDIO AQUA, ev baristaları için üretilmiş, patentli multi-boiler teknolojisine sahip tek gruplu espresso makinesidir.",
    }
  },
  'dc-two': {
    en: {
      name: "Dalla Corte DC TWO",
      origin: "Dalla Corte Coffee Grinder",
      tastingNotes: "Precise control over grind size for optimal extraction and flavor profiling, 65mm flat burrs made from high-quality steel, ensuring uniform particle size and longevity, Independent adjustments for each grinder, allowing two different grind settings simultaneously, High capacity: 4 g/sec, Powerful 500W motor ensures consistent performance even under heavy use, Engineered for quieter operation, minimizing noise, Hopper capacity: 1.5 kg (dual hopper)",
      description: "Dalla Corte DC TWO professional coffee grinder with 65mm flat burrs for precise, consistent extraction.",
    },
    tr: {
      name: "Dalla Corte DC TWO",
      origin: "Dalla Corte Kahve Değirmeni",
      tastingNotes: "En iyi ekstraksiyon ve aroma profili için öğütme boyutu üzerinde hassas kontrol sağlar, Yüksek kaliteli çelikten yapılmış 65 mm düz burrlar, uniform partikül boyutu ve dayanıklılık sağlar, Bağımsız olarak ayarlanabilen çift öğütme seçeneği, aynı anda iki farklı öğütme ayarını mümkün kılar, Yüksek öğütme kapasitesi: 4 g/saniye, Güçlü 500W motor, yoğun kullanımda bile tutarlı performans sağlar, Yoğun ortamlarda daha sessiz çalışma için tasarlanmıştır, gürültüyü minimuma indirir, Hopper Kapasitesi: 1.5 kg (çift hazneli)",
      description: "Dalla Corte DC TWO, hassas ve tutarlı ekstraksiyon için 65mm düz burrlara sahip profesyonel kahve değirmenidir.",
    }
  },
  'dc-one': {
    en: {
      name: "Dalla Corte DC ONE",
      origin: "Dalla Corte Coffee Grinder",
      tastingNotes: "Precise control over grind size for optimal extraction and flavor profiling, 65mm flat burrs made from high-quality steel, ensuring uniform particle size and longevity, High capacity: 4 g/sec, Engineered for quieter operation, minimizing noise, Hopper capacity: 1.5 kg",
      description: "Dalla Corte DC ONE professional coffee grinder with 65mm flat burrs for precise, consistent extraction.",
    },
    tr: {
      name: "Dalla Corte DC ONE",
      origin: "Dalla Corte Kahve Değirmeni",
      tastingNotes: "En iyi ekstraksiyon ve aroma profili için öğütme boyutu üzerinde hassas kontrol sağlar, Yüksek kaliteli çelikten yapılmış 65 mm düz burrlar, uniform partikül boyutu ve dayanıklılık sağlar, Yüksek öğütme kapasitesi: 4 g/saniye, Yoğun ortamlarda daha sessiz çalışma için tasarlanmıştır, gürültüyü minimuma indirir, Hopper Kapasitesi: 1.5 kg",
      description: "Dalla Corte DC ONE, hassas ve tutarlı ekstraksiyon için 65mm düz burrlara sahip profesyonel kahve değirmenidir.",
    }
  },
  'tempesta-saep-gara-2gr': {
    en: {
      name: "Tempesta SAEP GARA 2 GR",
      origin: "Tempesta Espresso Coffee Machine",
      tastingNotes: "2-3 group espresso machine, Cool touch steam wand and Super Dry system, Automatic On/Off and Standby energy saver, Drip tray and feet height adjustable, A 5\" display for each group, WiFi connection, Manual activation button, Multi boiler system and independent group temperature settings, Insulated boilers and energy saving software functions",
      description: "Tempesta SAEP GARA 2 GR professional multi-boiler espresso machine with a 5\" display per group and WiFi connectivity.",
    },
    tr: {
      name: "Tempesta SAEP GARA 2 GR",
      origin: "Tempesta Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu espresso kahve makinesi, El yakmaz buhar çubukları ve kuru buhar sistemi, Otomatik açma/kapama ve ekleme enerji tasarrufu, Ayarlanabilir damlama tepsisi ve ayak yüksekliği, Her grup için ayrı bir 5'' ekran, WiFi bağlantısı, Manuel kahve demleme tuşu, Çoklu boiler sistemi ile ayarlanabilir grup başlık sıcakları, İzolasyonlu boiler ve enerji tasarrufu sağlayan yazılım",
      description: "Tempesta SAEP GARA 2 GR, her grup için ayrı 5'' ekran ve WiFi bağlantısına sahip profesyonel çoklu boiler espresso makinesidir.",
    }
  },
  'tempesta-saep-gara-3gr': {
    en: {
      name: "Tempesta SAEP GARA 3 GR",
      origin: "Tempesta Espresso Coffee Machine",
      tastingNotes: "2-3 group espresso machine, Cool touch steam wand and Super Dry system, Automatic On/Off and Standby energy saver, Drip tray and feet height adjustable, A 5\" display for each group, WiFi connection, Manual activation button, Multi boiler system and independent group temperature settings, Insulated boilers and energy saving software functions",
      description: "Tempesta SAEP GARA 3 GR professional multi-boiler espresso machine with a 5\" display per group and WiFi connectivity.",
    },
    tr: {
      name: "Tempesta SAEP GARA 3 GR",
      origin: "Tempesta Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu espresso kahve makinesi, El yakmaz buhar çubukları ve kuru buhar sistemi, Otomatik açma/kapama ve ekleme enerji tasarrufu, Ayarlanabilir damlama tepsisi ve ayak yüksekliği, Her grup için ayrı bir 5'' ekran, WiFi bağlantısı, Manuel kahve demleme tuşu, Çoklu boiler sistemi ile ayarlanabilir grup başlık sıcakları, İzolasyonlu boiler ve enerji tasarrufu sağlayan yazılım",
      description: "Tempesta SAEP GARA 3 GR, her grup için ayrı 5'' ekran ve WiFi bağlantısına sahip profesyonel çoklu boiler espresso makinesidir.",
    }
  },
  'tempesta-saep-2gr': {
    en: {
      name: "Tempesta SAEP 2 GR",
      origin: "Tempesta Espresso Coffee Machine",
      tastingNotes: "2-3 group espresso machine, Cool touch steam wand and Super Dry system, Automatic On/Off and Standby energy saver, Drip tray and feet height adjustable, A 5\" display for each group, WiFi connection, Manual activation button, Multi boiler system and independent group temperature settings, Insulated boilers and energy saving software functions",
      description: "Tempesta SAEP 2 GR professional multi-boiler espresso machine with a 5\" display per group and WiFi connectivity.",
    },
    tr: {
      name: "Tempesta SAEP 2 GR",
      origin: "Tempesta Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu espresso kahve makinesi, El yakmaz buhar çubukları ve kuru buhar sistemi, Otomatik açma/kapama ve ekleme enerji tasarrufu, Ayarlanabilir damlama tepsisi ve ayak yüksekliği, Her grup için ayrı bir 5'' ekran, WiFi bağlantısı, Manuel kahve demleme tuşu, Çoklu boiler sistemi ile ayarlanabilir grup başlık sıcakları, İzolasyonlu boiler ve enerji tasarrufu sağlayan yazılım",
      description: "Tempesta SAEP 2 GR, her grup için ayrı 5'' ekran ve WiFi bağlantısına sahip profesyonel çoklu boiler espresso makinesidir.",
    }
  },
  'tempesta-saep-3gr': {
    en: {
      name: "Tempesta SAEP 3 GR",
      origin: "Tempesta Espresso Coffee Machine",
      tastingNotes: "2-3 group espresso machine, Cool touch steam wand and Super Dry system, Automatic On/Off and Standby energy saver, Drip tray and feet height adjustable, A 5\" display for each group, WiFi connection, Manual activation button, Multi boiler system and independent group temperature settings, Insulated boilers and energy saving software functions",
      description: "Tempesta SAEP 3 GR professional multi-boiler espresso machine with a 5\" display per group and WiFi connectivity.",
    },
    tr: {
      name: "Tempesta SAEP 3 GR",
      origin: "Tempesta Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu espresso kahve makinesi, El yakmaz buhar çubukları ve kuru buhar sistemi, Otomatik açma/kapama ve ekleme enerji tasarrufu, Ayarlanabilir damlama tepsisi ve ayak yüksekliği, Her grup için ayrı bir 5'' ekran, WiFi bağlantısı, Manuel kahve demleme tuşu, Çoklu boiler sistemi ile ayarlanabilir grup başlık sıcakları, İzolasyonlu boiler ve enerji tasarrufu sağlayan yazılım",
      description: "Tempesta SAEP 3 GR, her grup için ayrı 5'' ekran ve WiFi bağlantısına sahip profesyonel çoklu boiler espresso makinesidir.",
    }
  },
  'tempesta-saef-2gr': {
    en: {
      name: "Tempesta SAEF 2 GR",
      origin: "Tempesta Espresso Coffee Machine",
      tastingNotes: "2-3 group FRC espresso machine, Digital boiler pressure display and control, Cool touch steam wand and Super Dry system, Automatic On/Off and Standby energy saver, Drip tray and feet height adjustable, A 5\" display for each group, WiFi connection, Manual activation button with flow rate control (FRC), Multi boiler system and independent group temperature settings, Insulated boilers and energy saving software functions",
      description: "Tempesta SAEF 2 GR professional multi-boiler espresso machine with a 5\" display per group and WiFi connectivity.",
    },
    tr: {
      name: "Tempesta SAEF 2 GR",
      origin: "Tempesta Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu FRC espresso kahve makinesi, Dijital boiler basınç ekranı ve kontrolü, El yakmaz buhar çubukları ve kuru buhar sistemi, Otomatik açma/kapama ve ekleme enerji tasarrufu, Ayarlanabilir damlama tepsisi ve ayak yüksekliği, Her grup için ayrı bir 5'' ekran, WiFi bağlantısı, Manuel kahve demleme tuşu, akış hızı kontrolü (FRC), Çoklu boiler sistemi ile ayarlanabilir grup başlık sıcakları, İzolasyonlu boiler ve enerji tasarrufu sağlayan yazılım",
      description: "Tempesta SAEF 2 GR, her grup için ayrı 5'' ekran ve WiFi bağlantısına sahip profesyonel çoklu boiler espresso makinesidir.",
    }
  },
  'tempesta-saef-3gr': {
    en: {
      name: "Tempesta SAEF 3 GR",
      origin: "Tempesta Espresso Coffee Machine",
      tastingNotes: "2-3 group FRC espresso machine, Digital boiler pressure display and control, Cool touch steam wand and Super Dry system, Automatic On/Off and Standby energy saver, Drip tray and feet height adjustable, A 5\" display for each group, WiFi connection, Manual activation button with flow rate control (FRC), Multi boiler system and independent group temperature settings, Insulated boilers and energy saving software functions",
      description: "Tempesta SAEF 3 GR professional multi-boiler espresso machine with a 5\" display per group and WiFi connectivity.",
    },
    tr: {
      name: "Tempesta SAEF 3 GR",
      origin: "Tempesta Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu FRC espresso kahve makinesi, Dijital boiler basınç ekranı ve kontrolü, El yakmaz buhar çubukları ve kuru buhar sistemi, Otomatik açma/kapama ve ekleme enerji tasarrufu, Ayarlanabilir damlama tepsisi ve ayak yüksekliği, Her grup için ayrı bir 5'' ekran, WiFi bağlantısı, Manuel kahve demleme tuşu, akış hızı kontrolü (FRC), Çoklu boiler sistemi ile ayarlanabilir grup başlık sıcakları, İzolasyonlu boiler ve enerji tasarrufu sağlayan yazılım",
      description: "Tempesta SAEF 3 GR, her grup için ayrı 5'' ekran ve WiFi bağlantısına sahip profesyonel çoklu boiler espresso makinesidir.",
    }
  },
  'wega-polar-evd2': {
    en: {
      name: "Wega POLAR EVD2",
      origin: "Wega Espresso Coffee Machine",
      tastingNotes: "2-3 group espresso coffee machine, Single boiler heat exchanger (HX) system, High steam performance for busy operations, Volumetric dosing control, Electronic temperature control, Ergonomic steam and hot water levers, LED illuminated work area, Stainless steel body, Automatic boiler refill, Boiler capacity: 11L (2 grp)",
      description: "Wega POLAR EVD2 professional espresso machine, engineered for durable, consistent performance in busy café environments.",
    },
    tr: {
      name: "Wega POLAR EVD2",
      origin: "Wega Espresso Kahve Makinesi",
      tastingNotes: "2-3 grup espresso kahve makinesi, Isı eşanjörlü tek boyler sistemi, Yoğun kullanıma uygun yüksek buhar performansı, Otomatik dozaj (volumetrik kontrol), Elektronik sıcaklık kontrolü, Ergonomik buhar ve sıcak su kolları, LED aydınlatmalı çalışma alanı, Paslanmaz çelik gövde, Otomatik kazan dolumu, Boyler kapasitesi: 11 L (2 gr)",
      description: "Wega POLAR EVD2, yoğun kafe ortamlarında dayanıklı ve tutarlı performans için tasarlanmış profesyonel espresso makinesidir.",
    }
  },
  'wega-polar-evd3': {
    en: {
      name: "Wega POLAR EVD3",
      origin: "Wega Espresso Coffee Machine",
      tastingNotes: "2-3 group espresso coffee machine, Single boiler heat exchanger (HX) system, High steam performance for busy operations, Volumetric dosing control, Electronic temperature control, Ergonomic steam and hot water levers, LED illuminated work area, Stainless steel body, Automatic boiler refill, Boiler capacity: 17L (3 grp)",
      description: "Wega POLAR EVD3 professional espresso machine, engineered for durable, consistent performance in busy café environments.",
    },
    tr: {
      name: "Wega POLAR EVD3",
      origin: "Wega Espresso Kahve Makinesi",
      tastingNotes: "2-3 grup espresso kahve makinesi, Isı eşanjörlü tek boyler sistemi, Yoğun kullanıma uygun yüksek buhar performansı, Otomatik dozaj (volumetrik kontrol), Elektronik sıcaklık kontrolü, Ergonomik buhar ve sıcak su kolları, LED aydınlatmalı çalışma alanı, Paslanmaz çelik gövde, Otomatik kazan dolumu, Boyler kapasitesi: 17 L (3 gr)",
      description: "Wega POLAR EVD3, yoğun kafe ortamlarında dayanıklı ve tutarlı performans için tasarlanmış profesyonel espresso makinesidir.",
    }
  },
  'wega-urban-evd2': {
    en: {
      name: "Wega URBAN EVD2",
      origin: "Wega Espresso Coffee Machine",
      tastingNotes: "2-3-4 group espresso coffee machine, Multi boiler, Service boiler boost function for busy periods, Wi-Fi management with smart phone and tablet PC, Raised groups 122mm, Optional 21 gr depth portafilter, Cool touch steam wand and dry steam technology, Self Learning Software (SLS), Work area LED downlighters as standard, Boiler capacity: 10.4L",
      description: "Wega URBAN EVD2 professional espresso machine, engineered for durable, consistent performance in busy café environments.",
    },
    tr: {
      name: "Wega URBAN EVD2",
      origin: "Wega Espresso Kahve Makinesi",
      tastingNotes: "2-3-4 gruplu espresso kahve makinesi, Çoklu boyler, Yoğun zamanlarda daha yüksek buhar elde etmek için Boost özelliği, Wi-fi bağlantı ile akıllı telefon yada tablet ile erişim ve kontrol sistemi, Yüksek şase 122 mm, Opsiyonel 21 gr derinliğinde kaşıklar, El yakmaz buhar çubukları ve kuru buhar teknolojisi, Kendi kendine öğrenme yazılımı (SLS), Çalışma alanında LED aydınlatma, Boyler kapasitesi: 10,4 Litre",
      description: "Wega URBAN EVD2, yoğun kafe ortamlarında dayanıklı ve tutarlı performans için tasarlanmış profesyonel espresso makinesidir.",
    }
  },
  'wega-urban-evd3': {
    en: {
      name: "Wega URBAN EVD3",
      origin: "Wega Espresso Coffee Machine",
      tastingNotes: "2-3-4 group espresso coffee machine, Multi boiler, Service boiler boost function for busy periods, Wi-Fi management with smart phone and tablet PC, Raised groups 122mm, Optional 21 gr depth portafilter, Cool touch steam wand and dry steam technology, Self Learning Software (SLS), Work area LED downlighters as standard, Boiler capacity: 16.6L",
      description: "Wega URBAN EVD3 professional espresso machine, engineered for durable, consistent performance in busy café environments.",
    },
    tr: {
      name: "Wega URBAN EVD3",
      origin: "Wega Espresso Kahve Makinesi",
      tastingNotes: "2-3-4 gruplu espresso kahve makinesi, Çoklu boyler, Yoğun zamanlarda daha yüksek buhar elde etmek için Boost özelliği, Wi-fi bağlantı ile akıllı telefon yada tablet ile erişim ve kontrol sistemi, Yüksek şase 122 mm, Opsiyonel 21 gr derinliğinde kaşıklar, El yakmaz buhar çubukları ve kuru buhar teknolojisi, Kendi kendine öğrenme yazılımı (SLS), Çalışma alanında LED aydınlatma, Boyler kapasitesi: 16,6 Litre",
      description: "Wega URBAN EVD3, yoğun kafe ortamlarında dayanıklı ve tutarlı performans için tasarlanmış profesyonel espresso makinesidir.",
    }
  },
  'wega-urban-evd4': {
    en: {
      name: "Wega URBAN EVD4",
      origin: "Wega Espresso Coffee Machine",
      tastingNotes: "2-3-4 group espresso coffee machine, Multi boiler, Service boiler boost function for busy periods, Wi-Fi management with smart phone and tablet PC, Raised groups 122mm, Optional 21 gr depth portafilter, Cool touch steam wand and dry steam technology, Self Learning Software (SLS), Work area LED downlighters as standard, Boiler capacity: 17.8L",
      description: "Wega URBAN EVD4 professional espresso machine, engineered for durable, consistent performance in busy café environments.",
    },
    tr: {
      name: "Wega URBAN EVD4",
      origin: "Wega Espresso Kahve Makinesi",
      tastingNotes: "2-3-4 gruplu espresso kahve makinesi, Çoklu boyler, Yoğun zamanlarda daha yüksek buhar elde etmek için Boost özelliği, Wi-fi bağlantı ile akıllı telefon yada tablet ile erişim ve kontrol sistemi, Yüksek şase 122 mm, Opsiyonel 21 gr derinliğinde kaşıklar, El yakmaz buhar çubukları ve kuru buhar teknolojisi, Kendi kendine öğrenme yazılımı (SLS), Çalışma alanında LED aydınlatma, Boyler kapasitesi: 17,8 Litre",
      description: "Wega URBAN EVD4, yoğun kafe ortamlarında dayanıklı ve tutarlı performans için tasarlanmış profesyonel espresso makinesidir.",
    }
  },
  'wega-nova-evd2': {
    en: {
      name: "Wega NOVA EVD2",
      origin: "Wega Espresso Coffee Machine",
      tastingNotes: "2-3 group espresso coffee machine, Programmable electronic dosing, System for adjusting the height of the cup bearing surface, Anti-Burn and adjustable steam wand, Autolevel and volumetric pump, Slide lever control tap (2-3 group), Work area LED downlighters as standard, Boiler capacity: 12-17 Liter",
      description: "Wega NOVA EVD2 professional espresso machine, engineered for durable, consistent performance in busy café environments.",
    },
    tr: {
      name: "Wega NOVA EVD2",
      origin: "Wega Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu espresso kahve makinesi, Programlanabilir elektronik dozaj ayarlama, Özel bardak yüksekliği ayarlama sistemi, Kullanımı kolay, el yakmayan ve ayarlanabilir buhar çubukları, Otomatik seviye ve volumetrik pompa, Kaydırma kolu kontrol musluğu (2-3 gr.), Çalışma alanında LED aydınlatma, Boyler kapasitesi: 12-17 Litre",
      description: "Wega NOVA EVD2, yoğun kafe ortamlarında dayanıklı ve tutarlı performans için tasarlanmış profesyonel espresso makinesidir.",
    }
  },
  'wega-nova-evd3': {
    en: {
      name: "Wega NOVA EVD3",
      origin: "Wega Espresso Coffee Machine",
      tastingNotes: "2-3 group espresso coffee machine, Programmable electronic dosing, System for adjusting the height of the cup bearing surface, Anti-Burn and adjustable steam wand, Autolevel and volumetric pump, Slide lever control tap (2-3 group), Work area LED downlighters as standard, Boiler capacity: 12-17 Liter",
      description: "Wega NOVA EVD3 professional espresso machine, engineered for durable, consistent performance in busy café environments.",
    },
    tr: {
      name: "Wega NOVA EVD3",
      origin: "Wega Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu espresso kahve makinesi, Programlanabilir elektronik dozaj ayarlama, Özel bardak yüksekliği ayarlama sistemi, Kullanımı kolay, el yakmayan ve ayarlanabilir buhar çubukları, Otomatik seviye ve volumetrik pompa, Kaydırma kolu kontrol musluğu (2-3 gr.), Çalışma alanında LED aydınlatma, Boyler kapasitesi: 12-17 Litre",
      description: "Wega NOVA EVD3, yoğun kafe ortamlarında dayanıklı ve tutarlı performans için tasarlanmış profesyonel espresso makinesidir.",
    }
  },
  'wega-polaris-pro-evd2': {
    en: {
      name: "Wega POLARIS PRO EVD2",
      origin: "Wega Espresso Coffee Machine",
      tastingNotes: "2-3 group espresso coffee machine, Programmable electronic dosing, Automatic group washing cycle, Raised groups 122mm, Autolevel and volumetric pump, Slide lever control tap (2-3 group), Polaris Tron Display (for 2-3 group EVD), Work area LED downlighters as standard, Boiler capacity: 12-17 Liter",
      description: "Wega POLARIS PRO EVD2 professional espresso machine, engineered for durable, consistent performance in busy café environments.",
    },
    tr: {
      name: "Wega POLARIS PRO EVD2",
      origin: "Wega Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu espresso kahve makinesi, Programlanabilir elektronik dozaj ayarlama, Otomatik grup yıkama, Yüksek şase 122 mm, Otomatik seviye ve volumetrik pompa, Kaydırma kolu kontrol musluğu (2-3 gr.), Polaris Tron Ekran (2-3 grup EVD için), Çalışma alanında LED aydınlatma, Boyler kapasitesi: 12-17 Litre",
      description: "Wega POLARIS PRO EVD2, yoğun kafe ortamlarında dayanıklı ve tutarlı performans için tasarlanmış profesyonel espresso makinesidir.",
    }
  },
  'wega-polaris-pro-evd3': {
    en: {
      name: "Wega POLARIS PRO EVD3",
      origin: "Wega Espresso Coffee Machine",
      tastingNotes: "2-3 group espresso coffee machine, Programmable electronic dosing, Automatic group washing cycle, Raised groups 122mm, Autolevel and volumetric pump, Slide lever control tap (2-3 group), Polaris Tron Display (for 2-3 group EVD), Work area LED downlighters as standard, Boiler capacity: 12-17 Liter",
      description: "Wega POLARIS PRO EVD3 professional espresso machine, engineered for durable, consistent performance in busy café environments.",
    },
    tr: {
      name: "Wega POLARIS PRO EVD3",
      origin: "Wega Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu espresso kahve makinesi, Programlanabilir elektronik dozaj ayarlama, Otomatik grup yıkama, Yüksek şase 122 mm, Otomatik seviye ve volumetrik pompa, Kaydırma kolu kontrol musluğu (2-3 gr.), Polaris Tron Ekran (2-3 grup EVD için), Çalışma alanında LED aydınlatma, Boyler kapasitesi: 12-17 Litre",
      description: "Wega POLARIS PRO EVD3, yoğun kafe ortamlarında dayanıklı ve tutarlı performans için tasarlanmış profesyonel espresso makinesidir.",
    }
  },
  'wega-rower-evd2-tc': {
    en: {
      name: "Wega ROWER EVD2 TC",
      origin: "Wega Espresso Coffee Machine",
      tastingNotes: "2 group semi-automatic espresso coffee machine, Electro mechanical push buttons, Digital screen, 2 cool touch steam wands, Single hot water outlet, Adjustable drip tray (8/11/14 cm), Shot timer, Boiler capacity: 11.5 Liter, Automatic cleaning system",
      description: "Wega ROWER EVD2 TC professional espresso machine, engineered for durable, consistent performance in busy café environments.",
    },
    tr: {
      name: "Wega ROWER EVD2 TC",
      origin: "Wega Espresso Kahve Makinesi",
      tastingNotes: "2 gruplu yarı otomatik espresso kahve makinesi, Elektromekanik kontrol tuşu, Dijital ekran, 2 adet el yakmaz buhar çubuğu, Tekli sıcak su çıkışı, Ayarlanabilir bardak tepsisi (8/11/14 cm), Doz zamanlayıcısı, Boyler kapasitesi: 11,5 Litre, Otomatik yıkama sistemi",
      description: "Wega ROWER EVD2 TC, yoğun kafe ortamlarında dayanıklı ve tutarlı performans için tasarlanmış profesyonel espresso makinesidir.",
    }
  },
  'wega-lunna-epu2': {
    en: {
      name: "Wega LUNNA EPU2",
      origin: "Wega Espresso Coffee Machine",
      tastingNotes: "2-3 group semi-automatic espresso coffee machine, Electro mechanical push buttons, Pre-Infusion, 2 steam wands, Single hot water outlet, Standard automatic water level control, Built-in motor pump, Boiler capacity: 10.5-17 Liter",
      description: "Wega LUNNA EPU2 professional espresso machine, engineered for durable, consistent performance in busy café environments.",
    },
    tr: {
      name: "Wega LUNNA EPU2",
      origin: "Wega Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu yarı otomatik espresso kahve makinesi, Elektromekanik kontrol tuşu, Standart ön demleme, 2 adet buhar çubuğu, Tekli sıcak su çıkışı, Standart otomatik su seviyesi ayarı, Dahili motor pompası, Boyler kapasitesi: 10,5-17 Litre",
      description: "Wega LUNNA EPU2, yoğun kafe ortamlarında dayanıklı ve tutarlı performans için tasarlanmış profesyonel espresso makinesidir.",
    }
  },
  'wega-pegaso-epu3': {
    en: {
      name: "Wega PEGASO EPU3",
      origin: "Wega Espresso Coffee Machine",
      tastingNotes: "2-3 group semi-automatic espresso coffee machine, Electro mechanical push buttons, Pre-Infusion, 2 steam wands, Single hot water outlet, Standard automatic water level control, Built-in motor pump, Boiler capacity: 10.5-17 Liter",
      description: "Wega PEGASO EPU3 professional espresso machine, engineered for durable, consistent performance in busy café environments.",
    },
    tr: {
      name: "Wega PEGASO EPU3",
      origin: "Wega Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu yarı otomatik espresso kahve makinesi, Elektromekanik kontrol tuşu, Standart ön demleme, 2 adet buhar çubuğu, Tekli sıcak su çıkışı, Standart otomatik su seviyesi ayarı, Dahili motor pompası, Boyler kapasitesi: 10,5-17 Litre",
      description: "Wega PEGASO EPU3, yoğun kafe ortamlarında dayanıklı ve tutarlı performans için tasarlanmış profesyonel espresso makinesidir.",
    }
  },
  'wega-lunna-evd2-tc': {
    en: {
      name: "Wega LUNNA EVD2 TC",
      origin: "Wega Espresso Coffee Machine",
      tastingNotes: "2-3 group automatic espresso coffee machine, 4 programmable doses per group, Pre-Infusion, 2 steam wands, Automatic hot water outlet (2-3 gr), Built-in motor pump, Raised group 122mm, Boiler capacity: 10.5-17 Liter",
      description: "Wega LUNNA EVD2 TC professional espresso machine, engineered for durable, consistent performance in busy café environments.",
    },
    tr: {
      name: "Wega LUNNA EVD2 TC",
      origin: "Wega Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu otomatik espresso kahve makinesi, Her bir grup için 4 adet programlanabilir dozaj ayarı, Standart ön demleme, 2 adet buhar çubuğu, Otomatik sıcak su çıkışı (2-3gr), Dahili motor pompası, 122 mm yükseltilmiş grup, Boyler kapasitesi: 10,5-17 Litre",
      description: "Wega LUNNA EVD2 TC, yoğun kafe ortamlarında dayanıklı ve tutarlı performans için tasarlanmış profesyonel espresso makinesidir.",
    }
  },
  'wega-pegaso-evd3-tc': {
    en: {
      name: "Wega PEGASO EVD3 TC",
      origin: "Wega Espresso Coffee Machine",
      tastingNotes: "2-3 group automatic espresso coffee machine, 4 programmable doses per group, Pre-Infusion, 2 steam wands, Automatic hot water outlet (2-3 gr), Built-in motor pump, Raised group 122mm, Boiler capacity: 10.5-17 Liter",
      description: "Wega PEGASO EVD3 TC professional espresso machine, engineered for durable, consistent performance in busy café environments.",
    },
    tr: {
      name: "Wega PEGASO EVD3 TC",
      origin: "Wega Espresso Kahve Makinesi",
      tastingNotes: "2-3 gruplu otomatik espresso kahve makinesi, Her bir grup için 4 adet programlanabilir dozaj ayarı, Standart ön demleme, 2 adet buhar çubuğu, Otomatik sıcak su çıkışı (2-3gr), Dahili motor pompası, 122 mm yükseltilmiş grup, Boyler kapasitesi: 10,5-17 Litre",
      description: "Wega PEGASO EVD3 TC, yoğun kafe ortamlarında dayanıklı ve tutarlı performans için tasarlanmış profesyonel espresso makinesidir.",
    }
  },
  'wega-io-evd2': {
    en: {
      name: "Wega IO EVD2",
      origin: "Wega Espresso Coffee Machine",
      tastingNotes: "2 group espresso coffee machine, Automatic leveling, Stainless steel steam tube and hot water dispenser, Connection to the water mains option, Possibility of bringing 122 mm raised groups to 82 mm, Work area LED downlighters as standard, Boiler capacity: 10.5 Liter",
      description: "Wega IO EVD2 professional espresso machine, engineered for durable, consistent performance in busy café environments.",
    },
    tr: {
      name: "Wega IO EVD2",
      origin: "Wega Espresso Kahve Makinesi",
      tastingNotes: "2 gruplu espresso kahve makinesi, Otomatik seviye ayarlama, Paslanmaz çelik buhar çubuğu ve sıcak su dispanseri, Şebeke suyuna bağlayabilme, 122mm yükseltilmiş grupları 82mm'ye getirebilme, Çalışma alanında LED aydınlatma, Boyler kapasitesi: 10,5 Litre",
      description: "Wega IO EVD2, yoğun kafe ortamlarında dayanıklı ve tutarlı performans için tasarlanmış profesyonel espresso makinesidir.",
    }
  },
  'wega-home-espresso-stainless': {
    en: {
      name: "Wega Espresso Machine (Stainless Steel)",
      origin: "Wega Home Espresso Machine",
      tastingNotes: "Steam wand for frothing milk, Hot water wand for tea, Coffee extraction lever, Upper cup-support, Internal 2.5-litre water tank, Boiler capacity: 1.8 lt, Materials: Stainless steel, brass, wood, Finish: Stainless Steel",
      description: "Wega home espresso machine in a Stainless Steel finish, with a dual boiler and internal water tank for home barista use.",
    },
    tr: {
      name: "Wega Espresso Machine (Stainless Steel)",
      origin: "Wega Ev Tipi Espresso Makinesi",
      tastingNotes: "Sütü köpürtmek için buhar çubuğu, Çay için sıcak su musluğu, Kahve çıkarma kolu, Üst fincan desteği, 2,5 litrelik su deposu, Boyler kapasitesi: 1,8 lt, Malzemeler: Paslanmaz çelik, pirinç, ahşap, Kaplama: Stainless Steel",
      description: "Wega ev tipi espresso makinesi, Stainless Steel kaplama seçeneğiyle; ev baristaları için çift boylerli ve dahili su depolu tasarıma sahiptir.",
    }
  },
  'wega-home-espresso-matt-black': {
    en: {
      name: "Wega Espresso Machine (Matt Black)",
      origin: "Wega Home Espresso Machine",
      tastingNotes: "Steam wand for frothing milk, Hot water wand for tea, Coffee extraction lever, Upper cup-support, Internal 2.5-litre water tank, Boiler capacity: 1.8 lt, Materials: Stainless steel, brass, wood, Finish: Matt Black",
      description: "Wega home espresso machine in a Matt Black finish, with a dual boiler and internal water tank for home barista use.",
    },
    tr: {
      name: "Wega Espresso Machine (Matt Black)",
      origin: "Wega Ev Tipi Espresso Makinesi",
      tastingNotes: "Sütü köpürtmek için buhar çubuğu, Çay için sıcak su musluğu, Kahve çıkarma kolu, Üst fincan desteği, 2,5 litrelik su deposu, Boyler kapasitesi: 1,8 lt, Malzemeler: Paslanmaz çelik, pirinç, ahşap, Kaplama: Matt Black",
      description: "Wega ev tipi espresso makinesi, Matt Black kaplama seçeneğiyle; ev baristaları için çift boylerli ve dahili su depolu tasarıma sahiptir.",
    }
  },
  'wega-home-espresso-personalized': {
    en: {
      name: "Wega Espresso Machine (Personalized)",
      origin: "Wega Home Espresso Machine",
      tastingNotes: "Steam wand for frothing milk, Hot water wand for tea, Coffee extraction lever, Upper cup-support, Internal 2.5-litre water tank, Boiler capacity: 1.8 lt, Materials: Stainless steel, brass, wood, Finish: Personalized panel",
      description: "Wega home espresso machine in a Personalized finish, with a dual boiler and internal water tank for home barista use.",
    },
    tr: {
      name: "Wega Espresso Machine (Personalized)",
      origin: "Wega Ev Tipi Espresso Makinesi",
      tastingNotes: "Sütü köpürtmek için buhar çubuğu, Çay için sıcak su musluğu, Kahve çıkarma kolu, Üst fincan desteği, 2,5 litrelik su deposu, Boyler kapasitesi: 1,8 lt, Malzemeler: Paslanmaz çelik, pirinç, ahşap, Kaplama: Kişiselleştirilmiş panel",
      description: "Wega ev tipi espresso makinesi, Personalized kaplama seçeneğiyle; ev baristaları için çift boylerli ve dahili su depolu tasarıma sahiptir.",
    }
  },
  'sanremo-cafe-racer-2gr-naked': {
    en: {
      name: "Sanremo CAFE RACER 2 GR (Naked)",
      origin: "Sanremo Espresso Coffee Machine",
      tastingNotes: "Fully automatic 2 group espresso machine, Multi-boiler system (8 L + 0.5 L group boiler), Smart-Touch control panel, 4 programmable recipes per group, SOFT Pre-Infusion (Flowactive), PID temperature control (±0.5°C), Electronic pressure regulation, Adjustable working area (85–150 mm) - Tall Cup, 2 steam wands + hot water outlet, 316L stainless steel boiler, transparent side panels",
      description: "Sanremo CAFE RACER 2 GR (Naked) fully automatic espresso machine with a multi-boiler system and Smart-Touch control panel.",
    },
    tr: {
      name: "Sanremo CAFE RACER 2 GR (Naked)",
      origin: "Sanremo Espresso Kahve Makinesi",
      tastingNotes: "Tam otomatik 2 gruplu espresso makinesi, Çoklu kazan sistemi (8 L + 0,5 L grup kazanı), Smart-Touch kontrol paneli, Her grup için 4 programlanabilir reçete, SOFT Pre-Infusion (Flowactive), PID sıcaklık kontrolü (±0,5 °C), Elektronik basınç kontrolü, Ayarlanabilir çalışma alanı (85–150 mm) - Tall Cup, 2 adet buhar çubuğu + sıcak su çıkışı, 316L paslanmaz çelik kazan, şeffaf yan paneller",
      description: "Sanremo CAFE RACER 2 GR (Naked), çoklu kazan sistemi ve Smart-Touch kontrol paneline sahip tam otomatik espresso makinesidir.",
    }
  },
  'sanremo-cafe-racer-2gr-renegade': {
    en: {
      name: "Sanremo CAFE RACER 2 GR (Renegade)",
      origin: "Sanremo Espresso Coffee Machine",
      tastingNotes: "Fully automatic 2 group espresso machine, Multi-boiler system (8 L + 0.5 L group boiler), Smart-Touch control panel, 4 programmable recipes per group, SOFT Pre-Infusion (Flowactive), PID temperature control (±0.5°C), Electronic pressure regulation, Adjustable working area (85–150 mm) - Tall Cup, 2 steam wands + hot water outlet, 316L stainless steel boiler, transparent side panels",
      description: "Sanremo CAFE RACER 2 GR (Renegade) fully automatic espresso machine with a multi-boiler system and Smart-Touch control panel.",
    },
    tr: {
      name: "Sanremo CAFE RACER 2 GR (Renegade)",
      origin: "Sanremo Espresso Kahve Makinesi",
      tastingNotes: "Tam otomatik 2 gruplu espresso makinesi, Çoklu kazan sistemi (8 L + 0,5 L grup kazanı), Smart-Touch kontrol paneli, Her grup için 4 programlanabilir reçete, SOFT Pre-Infusion (Flowactive), PID sıcaklık kontrolü (±0,5 °C), Elektronik basınç kontrolü, Ayarlanabilir çalışma alanı (85–150 mm) - Tall Cup, 2 adet buhar çubuğu + sıcak su çıkışı, 316L paslanmaz çelik kazan, şeffaf yan paneller",
      description: "Sanremo CAFE RACER 2 GR (Renegade), çoklu kazan sistemi ve Smart-Touch kontrol paneline sahip tam otomatik espresso makinesidir.",
    }
  },
  'sanremo-d8-2gr': {
    en: {
      name: "Sanremo D8 2GR",
      origin: "Sanremo Espresso Coffee Machine",
      tastingNotes: "Fully automatic 2/3 group espresso machine, Advanced boiler system for high temperature stability, Smart-Touch control panel, 4 programmable recipes per group, SOFT Pre-Infusion (Flowactive), PID temperature control (±0.5°C), Electronic pressure regulation, Adjustable working area (85–150 mm) - Tall Cup",
      description: "Sanremo D8 2GR fully automatic espresso machine with a multi-boiler system and Smart-Touch control panel.",
    },
    tr: {
      name: "Sanremo D8 2GR",
      origin: "Sanremo Espresso Kahve Makinesi",
      tastingNotes: "Tam otomatik 2/3 gruplu espresso makinesi, Yüksek stabilite sağlayan gelişmiş kazan sistemi, Smart-Touch kontrol paneli, Her grup için 4 programlanabilir reçete, SOFT Pre-Infusion (Flowactive), PID sıcaklık kontrolü (±0,5 °C), Elektronik basınç kontrolü, Ayarlanabilir çalışma alanı (85–150 mm) - Tall Cup",
      description: "Sanremo D8 2GR, çoklu kazan sistemi ve Smart-Touch kontrol paneline sahip tam otomatik espresso makinesidir.",
    }
  },
  'sanremo-d8-3gr': {
    en: {
      name: "Sanremo D8 3GR",
      origin: "Sanremo Espresso Coffee Machine",
      tastingNotes: "Fully automatic 2/3 group espresso machine, Advanced boiler system for high temperature stability, Smart-Touch control panel, 4 programmable recipes per group, SOFT Pre-Infusion (Flowactive), PID temperature control (±0.5°C), Electronic pressure regulation, Adjustable working area (85–150 mm) - Tall Cup",
      description: "Sanremo D8 3GR fully automatic espresso machine with a multi-boiler system and Smart-Touch control panel.",
    },
    tr: {
      name: "Sanremo D8 3GR",
      origin: "Sanremo Espresso Kahve Makinesi",
      tastingNotes: "Tam otomatik 2/3 gruplu espresso makinesi, Yüksek stabilite sağlayan gelişmiş kazan sistemi, Smart-Touch kontrol paneli, Her grup için 4 programlanabilir reçete, SOFT Pre-Infusion (Flowactive), PID sıcaklık kontrolü (±0,5 °C), Elektronik basınç kontrolü, Ayarlanabilir çalışma alanı (85–150 mm) - Tall Cup",
      description: "Sanremo D8 3GR, çoklu kazan sistemi ve Smart-Touch kontrol paneline sahip tam otomatik espresso makinesidir.",
    }
  },
  'sanremo-d8-plus-2gr': {
    en: {
      name: "Sanremo D8+ 2GR",
      origin: "Sanremo Espresso Coffee Machine",
      tastingNotes: "Fully automatic 2/3 group espresso machine, Advanced boiler system for high temperature stability, Smart-Touch control panel, 4 programmable recipes per group, SOFT Pre-Infusion (Flowactive), PID temperature control (±0.5°C), Electronic pressure regulation, Adjustable working area (85–150 mm) - Tall Cup, Heat-resistant steam wand and LED lighting",
      description: "Sanremo D8+ 2GR fully automatic espresso machine with a multi-boiler system and Smart-Touch control panel.",
    },
    tr: {
      name: "Sanremo D8+ 2GR",
      origin: "Sanremo Espresso Kahve Makinesi",
      tastingNotes: "Tam otomatik 2/3 gruplu espresso makinesi, Yüksek stabilite sağlayan gelişmiş kazan sistemi, Smart-Touch kontrol paneli, Her grup için 4 programlanabilir reçete, SOFT Pre-Infusion (Flowactive), PID sıcaklık kontrolü (±0,5 °C), Elektronik basınç kontrolü, Ayarlanabilir çalışma alanı (85–150 mm) - Tall Cup, El yakmaz buhar çubuğu ve LED aydınlatması ile",
      description: "Sanremo D8+ 2GR, çoklu kazan sistemi ve Smart-Touch kontrol paneline sahip tam otomatik espresso makinesidir.",
    }
  },
  'sanremo-d8-plus-3gr': {
    en: {
      name: "Sanremo D8+ 3GR",
      origin: "Sanremo Espresso Coffee Machine",
      tastingNotes: "Fully automatic 2/3 group espresso machine, Advanced boiler system for high temperature stability, Smart-Touch control panel, 4 programmable recipes per group, SOFT Pre-Infusion (Flowactive), PID temperature control (±0.5°C), Electronic pressure regulation, Adjustable working area (85–150 mm) - Tall Cup, Heat-resistant steam wand and LED lighting",
      description: "Sanremo D8+ 3GR fully automatic espresso machine with a multi-boiler system and Smart-Touch control panel.",
    },
    tr: {
      name: "Sanremo D8+ 3GR",
      origin: "Sanremo Espresso Kahve Makinesi",
      tastingNotes: "Tam otomatik 2/3 gruplu espresso makinesi, Yüksek stabilite sağlayan gelişmiş kazan sistemi, Smart-Touch kontrol paneli, Her grup için 4 programlanabilir reçete, SOFT Pre-Infusion (Flowactive), PID sıcaklık kontrolü (±0,5 °C), Elektronik basınç kontrolü, Ayarlanabilir çalışma alanı (85–150 mm) - Tall Cup, El yakmaz buhar çubuğu ve LED aydınlatması ile",
      description: "Sanremo D8+ 3GR, çoklu kazan sistemi ve Smart-Touch kontrol paneline sahip tam otomatik espresso makinesidir.",
    }
  },
  'sanremo-d8-pro-2gr': {
    en: {
      name: "Sanremo D8 PRO 2 GR",
      origin: "Sanremo Espresso Coffee Machine",
      tastingNotes: "Fully automatic 2/3 group espresso machine, Advanced boiler system for high temperature stability, Smart-Touch control panel, 4 programmable recipes per group, SOFT Pre-Infusion (Flowactive), PID temperature control (±0.5°C), Electronic pressure regulation, Adjustable working area (85–150 mm) - Tall Cup",
      description: "Sanremo D8 PRO 2 GR fully automatic espresso machine with a multi-boiler system and Smart-Touch control panel.",
    },
    tr: {
      name: "Sanremo D8 PRO 2 GR",
      origin: "Sanremo Espresso Kahve Makinesi",
      tastingNotes: "Tam otomatik 2/3 gruplu espresso makinesi, Yüksek stabilite sağlayan gelişmiş kazan sistemi, Smart-Touch kontrol paneli, Her grup için 4 programlanabilir reçete, SOFT Pre-Infusion (Flowactive), PID sıcaklık kontrolü (±0,5 °C), Elektronik basınç kontrolü, Ayarlanabilir çalışma alanı (85–150 mm) - Tall Cup",
      description: "Sanremo D8 PRO 2 GR, çoklu kazan sistemi ve Smart-Touch kontrol paneline sahip tam otomatik espresso makinesidir.",
    }
  },
  'sanremo-d8-pro-3gr': {
    en: {
      name: "Sanremo D8 PRO 3 GR",
      origin: "Sanremo Espresso Coffee Machine",
      tastingNotes: "Fully automatic 2/3 group espresso machine, Advanced boiler system for high temperature stability, Smart-Touch control panel, 4 programmable recipes per group, SOFT Pre-Infusion (Flowactive), PID temperature control (±0.5°C), Electronic pressure regulation, Adjustable working area (85–150 mm) - Tall Cup",
      description: "Sanremo D8 PRO 3 GR fully automatic espresso machine with a multi-boiler system and Smart-Touch control panel.",
    },
    tr: {
      name: "Sanremo D8 PRO 3 GR",
      origin: "Sanremo Espresso Kahve Makinesi",
      tastingNotes: "Tam otomatik 2/3 gruplu espresso makinesi, Yüksek stabilite sağlayan gelişmiş kazan sistemi, Smart-Touch kontrol paneli, Her grup için 4 programlanabilir reçete, SOFT Pre-Infusion (Flowactive), PID sıcaklık kontrolü (±0,5 °C), Elektronik basınç kontrolü, Ayarlanabilir çalışma alanı (85–150 mm) - Tall Cup",
      description: "Sanremo D8 PRO 3 GR, çoklu kazan sistemi ve Smart-Touch kontrol paneline sahip tam otomatik espresso makinesidir.",
    }
  },
  'franke-a300-ms-ec-1g-h2-w3': {
    en: {
      name: "Franke A300 MS EC 1G H2 W3",
      origin: "Franke Superautomatic Coffee Machine",
      tastingNotes: "Easy to disassemble and clean brewing unit, Option to add 2nd grinder, Option to add 2 milk / chocolate containers, Water connection or 4.8 lt water tank, Height adjustable coffee outlet mouth (80-185mm), EasyClean (EC) automatic cleaning and rinsing program, Option for FoamMaster™ milk system, Capacity: 124 espresso/hour (single)",
      description: "Franke A300 MS EC 1G H2 W3 superautomatic coffee machine with an easy-to-clean brewing unit and touchscreen menu, built for high-volume specialty beverage service.",
    },
    tr: {
      name: "Franke A300 MS EC 1G H2 W3",
      origin: "Franke Tam Otomatik Kahve Makinesi",
      tastingNotes: "Kolay sökülerek temizlenebilen demleme ünitesi, 2. değirmen ekleme opsiyonu, 1 veya 2 adet toz hazne ekleme opsiyonu, Su bağlantılı ya da su hazneli 4,8 lt, Yüksekliği ayarlanabilir kahve çıkış ağzı (80–185mm), EasyClean (EC) otomatik temizleme ve durulama programı, FoamMaster™ süt sistemi opsiyonu, Kapasite: 124 espresso/saat (tek)",
      description: "Franke A300 MS EC 1G H2 W3, yüksek hacimli özel içecek servisi için kolay temizlenebilir demleme ünitesi ve dokunmatik ekran menüsüne sahip tam otomatik kahve makinesidir.",
    }
  },
  'franke-a300-fm-ec-1g-h2-w3-1p': {
    en: {
      name: "Franke A300 FM EC 1G H2 W3 1P",
      origin: "Franke Superautomatic Coffee Machine",
      tastingNotes: "Easy to disassemble and clean brewing unit, Option to add 2nd grinder, Option to add 2 milk / chocolate containers, Water connection or 4.8 lt water tank, Height adjustable coffee outlet mouth (80-185mm), EasyClean (EC) automatic cleaning and rinsing program, FoamMaster™ milk system included, Capacity: 124 espresso/hour (single)",
      description: "Franke A300 FM EC 1G H2 W3 1P superautomatic coffee machine with an easy-to-clean brewing unit and touchscreen menu, built for high-volume specialty beverage service.",
    },
    tr: {
      name: "Franke A300 FM EC 1G H2 W3 1P",
      origin: "Franke Tam Otomatik Kahve Makinesi",
      tastingNotes: "Kolay sökülerek temizlenebilen demleme ünitesi, 2. değirmen ekleme opsiyonu, 1 veya 2 adet toz hazne ekleme opsiyonu, Su bağlantılı ya da su hazneli 4,8 lt, Yüksekliği ayarlanabilir kahve çıkış ağzı (80–185mm), EasyClean (EC) otomatik temizleme ve durulama programı, FoamMaster™ süt sistemi dahil, Kapasite: 124 espresso/saat (tek)",
      description: "Franke A300 FM EC 1G H2 W3 1P, yüksek hacimli özel içecek servisi için kolay temizlenebilir demleme ünitesi ve dokunmatik ekran menüsüne sahip tam otomatik kahve makinesidir.",
    }
  },
  'franke-a400-ms-ec-1g-h1': {
    en: {
      name: "Franke A400 MS EC 1G H1",
      origin: "Franke Superautomatic Coffee Machine",
      tastingNotes: "Easy to disassemble and clean brewing unit, Option to add 2nd grinder, Option to add 2 milk / chocolate containers, 4 lt water tank or water connection, 8 inch touchscreen, 2 different user menus, Height adjustable coffee outlet mouth (80-185mm), EasyClean (EC) automatic cleaning and rinsing program, Optional CleanMaster (CM) fully automatic cleaning program, Capacity: 140 espresso/hour (single)",
      description: "Franke A400 MS EC 1G H1 superautomatic coffee machine with an easy-to-clean brewing unit and touchscreen menu, built for high-volume specialty beverage service.",
    },
    tr: {
      name: "Franke A400 MS EC 1G H1",
      origin: "Franke Tam Otomatik Kahve Makinesi",
      tastingNotes: "Kolay sökülerek temizlenebilen demleme ünitesi, 2. değirmen ekleme opsiyonu, 1 veya 2 adet toz hazne ekleme opsiyonu, Su bağlantılı ya da su hazneli 4 lt, 8 inç dokunmatik ekran, 2 farklı kullanıcı menüsü, Yüksekliği ayarlanabilir kahve çıkış ağzı (80–185mm), EasyClean (EC) otomatik temizleme ve durulama programı, Opsiyonel CleanMaster (CM) tam otomatik temizleme programı, Kapasite: 140 espresso/saat (tek)",
      description: "Franke A400 MS EC 1G H1, yüksek hacimli özel içecek servisi için kolay temizlenebilir demleme ünitesi ve dokunmatik ekran menüsüne sahip tam otomatik kahve makinesidir.",
    }
  },
  'franke-a400-ms-ec-1g-h1-1p': {
    en: {
      name: "Franke A400 MS EC 1G H1 1P",
      origin: "Franke Superautomatic Coffee Machine",
      tastingNotes: "Easy to disassemble and clean brewing unit, Option to add 2nd grinder, Option to add 2 milk / chocolate containers, 4 lt water tank or water connection, 8 inch touchscreen, 2 different user menus, Height adjustable coffee outlet mouth (80-185mm), EasyClean (EC) automatic cleaning and rinsing program, Optional CleanMaster (CM) fully automatic cleaning program, Capacity: 140 espresso/hour (single)",
      description: "Franke A400 MS EC 1G H1 1P superautomatic coffee machine with an easy-to-clean brewing unit and touchscreen menu, built for high-volume specialty beverage service.",
    },
    tr: {
      name: "Franke A400 MS EC 1G H1 1P",
      origin: "Franke Tam Otomatik Kahve Makinesi",
      tastingNotes: "Kolay sökülerek temizlenebilen demleme ünitesi, 2. değirmen ekleme opsiyonu, 1 veya 2 adet toz hazne ekleme opsiyonu, Su bağlantılı ya da su hazneli 4 lt, 8 inç dokunmatik ekran, 2 farklı kullanıcı menüsü, Yüksekliği ayarlanabilir kahve çıkış ağzı (80–185mm), EasyClean (EC) otomatik temizleme ve durulama programı, Opsiyonel CleanMaster (CM) tam otomatik temizleme programı, Kapasite: 140 espresso/saat (tek)",
      description: "Franke A400 MS EC 1G H1 1P, yüksek hacimli özel içecek servisi için kolay temizlenebilir demleme ünitesi ve dokunmatik ekran menüsüne sahip tam otomatik kahve makinesidir.",
    }
  },
  'franke-a600-mc-ec-1g-h1': {
    en: {
      name: "Franke A600 MC EC 1G H1",
      origin: "Franke Superautomatic Coffee Machine",
      tastingNotes: "Easy to disassemble and clean brewing unit, Option to add 2nd grinder, Option to add 2 milk / chocolate containers, 8 inch touchscreen, 2 different user menus, Height adjustable coffee outlet mouth (80-185mm), EasyClean (EC) automatic cleaning and rinsing program, Optional CleanMaster (CM) fully automatic cleaning program, Capacity: 150 espresso/hour (single)",
      description: "Franke A600 MC EC 1G H1 superautomatic coffee machine with an easy-to-clean brewing unit and touchscreen menu, built for high-volume specialty beverage service.",
    },
    tr: {
      name: "Franke A600 MC EC 1G H1",
      origin: "Franke Tam Otomatik Kahve Makinesi",
      tastingNotes: "Kolay sökülerek temizlenebilen demleme ünitesi, 2. değirmen ekleme opsiyonu, 1 veya 2 adet toz hazne ekleme opsiyonu, 8 inç dokunmatik ekran, 2 farklı kullanıcı menüsü, Yüksekliği ayarlanabilir kahve çıkış ağzı (80–185mm), EasyClean (EC) otomatik temizleme ve durulama programı, Opsiyonel CleanMaster (CM) tam otomatik temizleme programı, Kapasite: 150 espresso/saat (tek)",
      description: "Franke A600 MC EC 1G H1, yüksek hacimli özel içecek servisi için kolay temizlenebilir demleme ünitesi ve dokunmatik ekran menüsüne sahip tam otomatik kahve makinesidir.",
    }
  },
  'franke-a800-fm-ec-1g-1p-h1': {
    en: {
      name: "Franke A800 FM EC 1G 1P H1",
      origin: "Franke Superautomatic Coffee Machine",
      tastingNotes: "Easy to disassemble and clean brewing unit, Option to add 2nd grinder, Option to add 2 milk / chocolate containers, 10.4 inch touchscreen, 2 different user menus, Height adjustable coffee outlet mouth (80-185mm), EasyClean (EC) automatic cleaning and rinsing program, Steam spout, Autosteam or Autosteam PRO can be used, Capacity: 160 espresso/hour (single)",
      description: "Franke A800 FM EC 1G 1P H1 superautomatic coffee machine with an easy-to-clean brewing unit and touchscreen menu, built for high-volume specialty beverage service.",
    },
    tr: {
      name: "Franke A800 FM EC 1G 1P H1",
      origin: "Franke Tam Otomatik Kahve Makinesi",
      tastingNotes: "Kolay sökülerek temizlenebilen demleme ünitesi, 2. değirmen ekleme opsiyonu, 1 veya 2 adet toz hazne ekleme opsiyonu, 10,4 inç dokunmatik ekran, 2 farklı kullanıcı menüsü, Yüksekliği ayarlanabilir kahve çıkış ağzı (80–185mm), EasyClean (EC) otomatik temizleme ve durulama programı, Buhar musluğu, Autosteam ya da Autosteam PRO eklenebilir, Kapasite: 160 espresso/saat (tek)",
      description: "Franke A800 FM EC 1G 1P H1, yüksek hacimli özel içecek servisi için kolay temizlenebilir demleme ünitesi ve dokunmatik ekran menüsüne sahip tam otomatik kahve makinesidir.",
    }
  },
  'franke-a800-fm-ec-2g-1p-h1': {
    en: {
      name: "Franke A800 FM EC 2G 1P H1",
      origin: "Franke Superautomatic Coffee Machine",
      tastingNotes: "Easy to disassemble and clean brewing unit, 2nd grinder included, Option to add 2 milk / chocolate containers, 10.4 inch touchscreen, 2 different user menus, Height adjustable coffee outlet mouth (80-185mm), EasyClean (EC) automatic cleaning and rinsing program, Steam spout, Autosteam or Autosteam PRO can be used, Capacity: 160 espresso/hour (single)",
      description: "Franke A800 FM EC 2G 1P H1 superautomatic coffee machine with an easy-to-clean brewing unit and touchscreen menu, built for high-volume specialty beverage service.",
    },
    tr: {
      name: "Franke A800 FM EC 2G 1P H1",
      origin: "Franke Tam Otomatik Kahve Makinesi",
      tastingNotes: "Kolay sökülerek temizlenebilen demleme ünitesi, 2. değirmen dahil, 1 veya 2 adet toz hazne ekleme opsiyonu, 10,4 inç dokunmatik ekran, 2 farklı kullanıcı menüsü, Yüksekliği ayarlanabilir kahve çıkış ağzı (80–185mm), EasyClean (EC) otomatik temizleme ve durulama programı, Buhar musluğu, Autosteam ya da Autosteam PRO eklenebilir, Kapasite: 160 espresso/saat (tek)",
      description: "Franke A800 FM EC 2G 1P H1, yüksek hacimli özel içecek servisi için kolay temizlenebilir demleme ünitesi ve dokunmatik ekran menüsüne sahip tam otomatik kahve makinesidir.",
    }
  },
  'franke-a1000-fm-cm-1g-h1-1p': {
    en: {
      name: "Franke A1000 FM CM 1G H1 1P",
      origin: "Franke Superautomatic Coffee Machine",
      tastingNotes: "Easy to disassemble and clean brewing unit, Brewing unit with IQ Flow™, Option to add 2 milk / chocolate containers, 10.4 inch touchscreen with multimedia functions, Height adjustable coffee outlet mouth (80-180mm), EasyClean (EC) automatic cleaning and rinsing program, Barista quality FoamMaster milk foam system, Capacity: 160 espresso/hour (single)",
      description: "Franke A1000 FM CM 1G H1 1P superautomatic coffee machine with an easy-to-clean brewing unit and touchscreen menu, built for high-volume specialty beverage service.",
    },
    tr: {
      name: "Franke A1000 FM CM 1G H1 1P",
      origin: "Franke Tam Otomatik Kahve Makinesi",
      tastingNotes: "Kolay sökülerek temizlenebilen demleme ünitesi, Demleme ünitesi IQ Flow™ ile, 1 veya 2 adet toz hazne ekleme opsiyonu, 10,4 inç dokunmatik ekranlı multimedya fonksiyonu ile, Yüksekliği ayarlanabilir kahve çıkış ağzı (80–180mm), EasyClean (EC) otomatik temizleme ve durulama programı, Barista kalitesinde FoamMaster süt köpüğü sistemi, Kapasite: 160 espresso/saat (tek)",
      description: "Franke A1000 FM CM 1G H1 1P, yüksek hacimli özel içecek servisi için kolay temizlenebilir demleme ünitesi ve dokunmatik ekran menüsüne sahip tam otomatik kahve makinesidir.",
    }
  },
  'franke-s700-2g-h1-s2': {
    en: {
      name: "Franke S700 2G H1 S2",
      origin: "Franke Superautomatic Coffee Machine",
      tastingNotes: "Semi-automatic coffee machine, Easy to disassemble and clean brewing unit, iQFlow technology, 3 boilers for high steam performance, 2 coffee grinders (1.8-2.0 kg / 0.6 kg), 8 inch touch screen and LED ambient lighting, Height adjustable coffee outlet mouth (80-185mm), Capacity: 160 espresso/hour (single)",
      description: "Franke S700 2G H1 S2 superautomatic coffee machine with an easy-to-clean brewing unit, built for high-volume specialty beverage service.",
    },
    tr: {
      name: "Franke S700 2G H1 S2",
      origin: "Franke Tam Otomatik Kahve Makinesi",
      tastingNotes: "Yarı otomatik kahve makinesi, Kolay sökülerek temizlenebilen demleme ünitesi, iQFlow teknolojisi, Yüksek buhar performansı için 3 boiler, 2 kahve değirmeni (1.8-2.0 kg / 0.6 kg), 8 inç dokunmatik ekran ve LED ambiyans aydınlatması, Yüksekliği ayarlanabilir kahve çıkış ağzı (80–185mm), Kapasite: 160 espresso/saat (tek)",
      description: "Franke S700 2G H1 S2, yüksek hacimli özel içecek servisi için kolay temizlenebilir demleme ünitesine sahip tam otomatik kahve makinesidir.",
    }
  },
  'franke-due': {
    en: {
      name: "Franke Due",
      origin: "Franke Superautomatic Coffee Machine",
      tastingNotes: "IQ Flow™ enabled, two different brewing units, Programmable Barista Lever for direct access to favorites, Removable bean hoppers: 2 x 1.1 kg or 4 x 0.55 kg, 2-4 precision grinders with long-lasting ceramic grinding disks, Two 8\" touch screens for an intuitive and efficient beverage selection, Barista Module, Automatic cleaning system, Individual brewing temperature to perfectly match every roast type, Choice of six Franke colors for the side panels, Pure Shot dispenses the selected beverage pure and without dilution",
      description: "Franke Due superautomatic coffee machine with an easy-to-clean brewing unit, built for high-volume specialty beverage service.",
    },
    tr: {
      name: "Franke Due",
      origin: "Franke Tam Otomatik Kahve Makinesi",
      tastingNotes: "IQ Flow™ özellikli iki farklı demleme ünitesi, Favorilere doğrudan erişim için programlanabilir Barista Lever, Çıkarılabilir kahve hazneleri: 2 x 1,1 kg veya 4 x 0,55 kg, Uzun ömürlü seramik taşlama diskerine sahip 2-4 hassas öğütücü, Sezgisel ve verimli bir içecek seçimi için iki adet 8 inç dokunmatik ekran, Barista Modülü, Otomatik temizleme sistemi, Bireysel demleme sıcaklığı her demleme tipine mükemmel uyum sağlamak için, Yan paneller için altı Franke rengi seçeneği, Pure Shot, seçilen içeceği saf ve seyreltmeden dağıtır",
      description: "Franke Due, yüksek hacimli özel içecek servisi için kolay temizlenebilir demleme ünitesine sahip tam otomatik kahve makinesidir.",
    }
  },
  'franke-mytico-vario': {
    en: {
      name: "Franke Mytico Vario",
      origin: "Franke Superautomatic Coffee Machine",
      tastingNotes: "IQ Flow™ enabled, two different brewing units, Programmable Barista Lever for direct access to favorites, Removable bean hoppers: 1 x 1.1 kg or 2 x 0.55 kg, Powder dosing unit: 1 x 0.5 kg, Two 8\" touch screens for an intuitive and efficient beverage selection, Barista Module, Automatic cleaning system, Individual brewing temperature to perfectly match every roast type, Choice of six Franke colors for the side panels, Pure Shot dispenses the selected beverage pure and without dilution",
      description: "Franke Mytico Vario superautomatic coffee machine with an easy-to-clean brewing unit, built for high-volume specialty beverage service.",
    },
    tr: {
      name: "Franke Mytico Vario",
      origin: "Franke Tam Otomatik Kahve Makinesi",
      tastingNotes: "IQ Flow™ özellikli iki farklı demleme ünitesi, Favorilere doğrudan erişim için programlanabilir Barista Lever, Çıkarılabilir çekirdek hazneleri: 1 x 1,1 kg veya 2 x 0,55 kg, Toz dozajlama ünitesi: 1 x 0,5 kg, Sezgisel ve verimli bir içecek seçimi için iki adet 8 inç dokunmatik ekran, Barista Modülü, Otomatik temizleme sistemi, Bireysel demleme sıcaklığı her demleme tipine mükemmel uyum sağlamak için, Yan paneller için altı Franke rengi seçeneği, Pure Shot, seçilen içeceği saf ve seyreltmeden dağıtır",
      description: "Franke Mytico Vario, yüksek hacimli özel içecek servisi için kolay temizlenebilir demleme ünitesine sahip tam otomatik kahve makinesidir.",
    }
  },
  'kef-f100-mpw': {
    en: {
      name: "KEF F100-MPW",
      origin: "KEF Automatic Coffee Machine",
      tastingNotes: "10.1\" full-color control panel, shining light belt and metallic texture, Detachable milk system with non-interfering auto cleaning feature, Customizable Auto cleaning, 16 g capacity proprietary brewing system, Efficient pre-brewing, Ceramic flat burrs, 2 powder hoppers for instant beverages, Beans hopper capacity 1200 g, Water tank 8 lt and water connection",
      description: "KEF F100-MPW automatic coffee machine with a full-color touch panel and a detachable, self-cleaning milk system.",
    },
    tr: {
      name: "KEF F100-MPW",
      origin: "KEF Tam Otomatik Kahve Makinesi",
      tastingNotes: "10.1'' tam renkli kontrol paneli, parlak ışık kemeri ve metalik doku, Karışmayan otomatik temizleme özelliğine sahip sökülebilir süt sistemi, Özelleştirilebilir Otomatik temizleme, 16 g kapasiteli tescilli demleme sistemi, Verimli ön demleme, Seramik düz çapaklar, 2 adet toz içecek haznesi, Çekirdek kahve haznesi 1200 g, 8 lt su tanklı ve su bağlantılı",
      description: "KEF F100-MPW, tam renkli dokunmatik panel ve kendiliğinden temizlenen, çıkarılabilir süt sistemine sahip tam otomatik kahve makinesidir.",
    }
  },
  'kef-f100-mpw-t': {
    en: {
      name: "KEF F100-MPW-T (Steam Wand)",
      origin: "KEF Automatic Coffee Machine",
      tastingNotes: "10.1\" full-color control panel, shining light belt and metallic texture, Detachable milk system with non-interfering auto cleaning feature, Customizable Auto cleaning, 16 g capacity proprietary brewing system, Efficient pre-brewing, Ceramic flat burrs, 2 powder hoppers for instant beverages, Beans hopper capacity 1200 g, Water tank 8 lt and water connection, Includes steam wand",
      description: "KEF F100-MPW-T (Steam Wand) automatic coffee machine with a full-color touch panel and a detachable, self-cleaning milk system.",
    },
    tr: {
      name: "KEF F100-MPW-T (Steam Wand)",
      origin: "KEF Tam Otomatik Kahve Makinesi",
      tastingNotes: "10.1'' tam renkli kontrol paneli, parlak ışık kemeri ve metalik doku, Karışmayan otomatik temizleme özelliğine sahip sökülebilir süt sistemi, Özelleştirilebilir Otomatik temizleme, 16 g kapasiteli tescilli demleme sistemi, Verimli ön demleme, Seramik düz çapaklar, 2 adet toz içecek haznesi, Çekirdek kahve haznesi 1200 g, 8 lt su tanklı ve su bağlantılı, Buhar çubuğu dahildir",
      description: "KEF F100-MPW-T (Steam Wand), tam renkli dokunmatik panel ve kendiliğinden temizlenen, çıkarılabilir süt sistemine sahip tam otomatik kahve makinesidir.",
    }
  },
  'kef-m12-big-plus': {
    en: {
      name: "KEF M12 Big Plus",
      origin: "KEF Automatic Coffee Machine",
      tastingNotes: "10.1\" full-color control panel, shining light belt and metallic texture, Detachable milk system with non-interfering auto cleaning feature, Customizable Auto cleaning, 16 g capacity proprietary brewing system, Efficient pre-brewing, Ceramic flat burrs, 9 grind size options, Beans hopper capacity 1200 g, Water tank 8 lt and water connection",
      description: "KEF M12 Big Plus automatic coffee machine with a full-color touch panel and a detachable, self-cleaning milk system.",
    },
    tr: {
      name: "KEF M12 Big Plus",
      origin: "KEF Tam Otomatik Kahve Makinesi",
      tastingNotes: "10.1'' tam renkli kontrol paneli, parlak ışık kemeri ve metalik doku, Karışmayan otomatik temizleme özelliğine sahip sökülebilir süt sistemi, Özelleştirilebilir Otomatik temizleme, 16 g kapasiteli tescilli demleme sistemi, Verimli ön demleme, Seramik düz çapaklar, 9 öğütme boyutu seçenekleri, Çekirdek kahve haznesi 1200 g, 8 lt su tanklı ve su bağlantılı",
      description: "KEF M12 Big Plus, tam renkli dokunmatik panel ve kendiliğinden temizlenen, çıkarılabilir süt sistemine sahip tam otomatik kahve makinesidir.",
    }
  },
  'kef-mf3pro': {
    en: {
      name: "KEF MF3Pro",
      origin: "KEF Milk Cooler",
      tastingNotes: "4 lt capacity, Positioning on the left side of the coffee machine",
      description: "KEF MF3Pro milk cooler cabinet, positioned alongside the coffee machine to keep milk fresh and ready.",
    },
    tr: {
      name: "KEF MF3Pro",
      origin: "KEF Süt Soğutucu",
      tastingNotes: "4 lt kapasiteli, Kahve makinesinin sol tarafında konumlandırma",
      description: "KEF MF3Pro süt soğutucu dolabı, kahve makinesinin yanında konumlandırılarak sütü taze ve hazır tutar.",
    }
  },
  'kef-bcn9': {
    en: {
      name: "KEF BCN9",
      origin: "KEF Milk Cooler",
      tastingNotes: "4.5 lt capacity, Positioning on the left side of the coffee machine",
      description: "KEF BCN9 milk cooler cabinet, positioned alongside the coffee machine to keep milk fresh and ready.",
    },
    tr: {
      name: "KEF BCN9",
      origin: "KEF Süt Soğutucu",
      tastingNotes: "4,5 lt kapasiteli, Kahve makinesinin sol tarafında konumlandırma",
      description: "KEF BCN9 süt soğutucu dolabı, kahve makinesinin yanında konumlandırılarak sütü taze ve hazır tutar.",
    }
  },
  'kef-mc16-milk-cooler': {
    en: {
      name: "KEF MC16",
      origin: "KEF Milk Cooler",
      tastingNotes: "9 lt capacity, Positioning on the left side of the coffee machine",
      description: "KEF MC16 milk cooler cabinet, positioned alongside the coffee machine to keep milk fresh and ready.",
    },
    tr: {
      name: "KEF MC16",
      origin: "KEF Süt Soğutucu",
      tastingNotes: "9 lt kapasiteli, Kahve makinesinin sol tarafında konumlandırma",
      description: "KEF MC16 süt soğutucu dolabı, kahve makinesinin yanında konumlandırılarak sütü taze ve hazır tutar.",
    }
  },
  'bwt-fs20i00a00': {
    en: {
      name: "BWT FS20I00A00",
      origin: "BWT Water Filtration System",
      tastingNotes: "bestmax HoReCa water filtration system, Intake pressure: min 2 – max 8 bar, Water temperature: 4–30°C, Total height: 287 mm, Capacity: ≥1025 L",
      description: "BWT FS20I00A00 water filtration cartridge for HoReCa coffee and beverage equipment.",
    },
    tr: {
      name: "BWT FS20I00A00",
      origin: "BWT Su Filtrasyon Sistemi",
      tastingNotes: "bestmax HoReCa su filtrasyon sistemi, Giriş basıncı: min 2 – max 8 bar, Su derecesi: 4–30°C, Yükseklik: 287 mm, Kapasite: ≥1025 L",
      description: "BWT FS20I00A00, HoReCa kahve ve içecek ekipmanları için su filtrasyon kartuşudur.",
    }
  },
  'bwt-fs22i00a00': {
    en: {
      name: "BWT FS22I00A00",
      origin: "BWT Water Filtration System",
      tastingNotes: "bestmax HoReCa water filtration system, Intake pressure: min 2 – max 8 bar, Water temperature: 4–30°C, Total height: 368 mm, Capacity: ≥1710 L",
      description: "BWT FS22I00A00 water filtration cartridge for HoReCa coffee and beverage equipment.",
    },
    tr: {
      name: "BWT FS22I00A00",
      origin: "BWT Su Filtrasyon Sistemi",
      tastingNotes: "bestmax HoReCa su filtrasyon sistemi, Giriş basıncı: min 2 – max 8 bar, Su derecesi: 4–30°C, Yükseklik: 368 mm, Kapasite: ≥1710 L",
      description: "BWT FS22I00A00, HoReCa kahve ve içecek ekipmanları için su filtrasyon kartuşudur.",
    }
  },
  'bwt-fs23i00a00': {
    en: {
      name: "BWT FS23I00A00",
      origin: "BWT Water Filtration System",
      tastingNotes: "bestmax HoReCa water filtration system, Intake pressure: min 2 – max 8 bar, Water temperature: 4–30°C, Total height: 429 mm, Capacity: ≥4285 L",
      description: "BWT FS23I00A00 water filtration cartridge for HoReCa coffee and beverage equipment.",
    },
    tr: {
      name: "BWT FS23I00A00",
      origin: "BWT Su Filtrasyon Sistemi",
      tastingNotes: "bestmax HoReCa su filtrasyon sistemi, Giriş basıncı: min 2 – max 8 bar, Su derecesi: 4–30°C, Yükseklik: 429 mm, Kapasite: ≥4285 L",
      description: "BWT FS23I00A00, HoReCa kahve ve içecek ekipmanları için su filtrasyon kartuşudur.",
    }
  },
  'bwt-fs24i00a00': {
    en: {
      name: "BWT FS24I00A00",
      origin: "BWT Water Filtration System",
      tastingNotes: "bestmax HoReCa water filtration system, Intake pressure: min 2 – max 8 bar, Water temperature: 4–30°C, Total height: 485 mm, Capacity: ≥6510 L",
      description: "BWT FS24I00A00 water filtration cartridge for HoReCa coffee and beverage equipment.",
    },
    tr: {
      name: "BWT FS24I00A00",
      origin: "BWT Su Filtrasyon Sistemi",
      tastingNotes: "bestmax HoReCa su filtrasyon sistemi, Giriş basıncı: min 2 – max 8 bar, Su derecesi: 4–30°C, Yükseklik: 485 mm, Kapasite: ≥6510 L",
      description: "BWT FS24I00A00, HoReCa kahve ve içecek ekipmanları için su filtrasyon kartuşudur.",
    }
  },
  'bwt-fs26i00a00': {
    en: {
      name: "BWT FS26I00A00",
      origin: "BWT Water Filtration System",
      tastingNotes: "bestmax HoReCa water filtration system, Intake pressure: min 2 – max 8 bar, Water temperature: 4–30°C, Total height: 512 mm, Capacity: ≥8910 L",
      description: "BWT FS26I00A00 water filtration cartridge for HoReCa coffee and beverage equipment.",
    },
    tr: {
      name: "BWT FS26I00A00",
      origin: "BWT Su Filtrasyon Sistemi",
      tastingNotes: "bestmax HoReCa su filtrasyon sistemi, Giriş basıncı: min 2 – max 8 bar, Su derecesi: 4–30°C, Yükseklik: 512 mm, Kapasite: ≥8910 L",
      description: "BWT FS26I00A00, HoReCa kahve ve içecek ekipmanları için su filtrasyon kartuşudur.",
    }
  },
  'bwt-fs28i00a00': {
    en: {
      name: "BWT FS28I00A00",
      origin: "BWT Water Filtration System",
      tastingNotes: "bestmax HoReCa water filtration system, Intake pressure: min 2 – max 8 bar, Water temperature: 4–30°C, Total height: 512 mm, Capacity: ≥11655 L",
      description: "BWT FS28I00A00 water filtration cartridge for HoReCa coffee and beverage equipment.",
    },
    tr: {
      name: "BWT FS28I00A00",
      origin: "BWT Su Filtrasyon Sistemi",
      tastingNotes: "bestmax HoReCa su filtrasyon sistemi, Giriş basıncı: min 2 – max 8 bar, Su derecesi: 4–30°C, Yükseklik: 512 mm, Kapasite: ≥11655 L",
      description: "BWT FS28I00A00, HoReCa kahve ve içecek ekipmanları için su filtrasyon kartuşudur.",
    }
  },
  'bwt-fs30i00a00': {
    en: {
      name: "BWT FS30I00A00",
      origin: "BWT Water Filtration System",
      tastingNotes: "bestmax HoReCa water filtration system, Intake pressure: min 2 – max 8 bar, Water temperature: 4–30°C, Total height: 576 mm, Capacity: ≥20570 L",
      description: "BWT FS30I00A00 water filtration cartridge for HoReCa coffee and beverage equipment.",
    },
    tr: {
      name: "BWT FS30I00A00",
      origin: "BWT Su Filtrasyon Sistemi",
      tastingNotes: "bestmax HoReCa su filtrasyon sistemi, Giriş basıncı: min 2 – max 8 bar, Su derecesi: 4–30°C, Yükseklik: 576 mm, Kapasite: ≥20570 L",
      description: "BWT FS30I00A00, HoReCa kahve ve içecek ekipmanları için su filtrasyon kartuşudur.",
    }
  },
  'bwt-premium-fs22p00a00': {
    en: {
      name: "BWT bestmax PREMIUM FS22P00A00",
      origin: "BWT Water Filtration System",
      tastingNotes: "bestmax PREMIUM professional filtration for coffee and vending machines, Intake pressure: min 2 – max 8 bar, Water temperature: 4–30°C, Total height: 368 mm, Capacity: 750 L",
      description: "BWT bestmax PREMIUM FS22P00A00 water filtration cartridge for HoReCa coffee and beverage equipment.",
    },
    tr: {
      name: "BWT bestmax PREMIUM FS22P00A00",
      origin: "BWT Su Filtrasyon Sistemi",
      tastingNotes: "bestmax PREMIUM kahve ve vending makineleri için profesyonel su filtrasyonu, Giriş basıncı: min 2 – max 8 bar, Su derecesi: 4–30°C, Yükseklik: 368 mm, Kapasite: 750 L",
      description: "BWT bestmax PREMIUM FS22P00A00, HoReCa kahve ve içecek ekipmanları için su filtrasyon kartuşudur.",
    }
  },
  'bwt-premium-fs23p00a00': {
    en: {
      name: "BWT bestmax PREMIUM FS23P00A00",
      origin: "BWT Water Filtration System",
      tastingNotes: "bestmax PREMIUM professional filtration for coffee and vending machines, Intake pressure: min 2 – max 8 bar, Water temperature: 4–30°C, Total height: 429 mm, Capacity: 1800 L",
      description: "BWT bestmax PREMIUM FS23P00A00 water filtration cartridge for HoReCa coffee and beverage equipment.",
    },
    tr: {
      name: "BWT bestmax PREMIUM FS23P00A00",
      origin: "BWT Su Filtrasyon Sistemi",
      tastingNotes: "bestmax PREMIUM kahve ve vending makineleri için profesyonel su filtrasyonu, Giriş basıncı: min 2 – max 8 bar, Su derecesi: 4–30°C, Yükseklik: 429 mm, Kapasite: 1800 L",
      description: "BWT bestmax PREMIUM FS23P00A00, HoReCa kahve ve içecek ekipmanları için su filtrasyon kartuşudur.",
    }
  },
  'bwt-premium-fs24p00a00': {
    en: {
      name: "BWT bestmax PREMIUM FS24P00A00",
      origin: "BWT Water Filtration System",
      tastingNotes: "bestmax PREMIUM professional filtration for coffee and vending machines, Intake pressure: min 2 – max 8 bar, Water temperature: 4–30°C, Total height: 485 mm, Capacity: 2700 L",
      description: "BWT bestmax PREMIUM FS24P00A00 water filtration cartridge for HoReCa coffee and beverage equipment.",
    },
    tr: {
      name: "BWT bestmax PREMIUM FS24P00A00",
      origin: "BWT Su Filtrasyon Sistemi",
      tastingNotes: "bestmax PREMIUM kahve ve vending makineleri için profesyonel su filtrasyonu, Giriş basıncı: min 2 – max 8 bar, Su derecesi: 4–30°C, Yükseklik: 485 mm, Kapasite: 2700 L",
      description: "BWT bestmax PREMIUM FS24P00A00, HoReCa kahve ve içecek ekipmanları için su filtrasyon kartuşudur.",
    }
  },
  'bwt-premium-fs28p00a00': {
    en: {
      name: "BWT bestmax PREMIUM FS28P00A00",
      origin: "BWT Water Filtration System",
      tastingNotes: "bestmax PREMIUM professional filtration for coffee and vending machines, Intake pressure: min 2 – max 8 bar, Water temperature: 4–30°C, Total height: 512 mm, Capacity: 4300 L",
      description: "BWT bestmax PREMIUM FS28P00A00 water filtration cartridge for HoReCa coffee and beverage equipment.",
    },
    tr: {
      name: "BWT bestmax PREMIUM FS28P00A00",
      origin: "BWT Su Filtrasyon Sistemi",
      tastingNotes: "bestmax PREMIUM kahve ve vending makineleri için profesyonel su filtrasyonu, Giriş basıncı: min 2 – max 8 bar, Su derecesi: 4–30°C, Yükseklik: 512 mm, Kapasite: 4300 L",
      description: "BWT bestmax PREMIUM FS28P00A00, HoReCa kahve ve içecek ekipmanları için su filtrasyon kartuşudur.",
    }
  },
  'bwt-premium-fs30p00a00': {
    en: {
      name: "BWT bestmax PREMIUM FS30P00A00",
      origin: "BWT Water Filtration System",
      tastingNotes: "bestmax PREMIUM professional filtration for coffee and vending machines, Intake pressure: min 2 – max 8 bar, Water temperature: 4–30°C, Total height: 576 mm, Capacity: 7000 L",
      description: "BWT bestmax PREMIUM FS30P00A00 water filtration cartridge for HoReCa coffee and beverage equipment.",
    },
    tr: {
      name: "BWT bestmax PREMIUM FS30P00A00",
      origin: "BWT Su Filtrasyon Sistemi",
      tastingNotes: "bestmax PREMIUM kahve ve vending makineleri için profesyonel su filtrasyonu, Giriş basıncı: min 2 – max 8 bar, Su derecesi: 4–30°C, Yükseklik: 576 mm, Kapasite: 7000 L",
      description: "BWT bestmax PREMIUM FS30P00A00, HoReCa kahve ve içecek ekipmanları için su filtrasyon kartuşudur.",
    }
  },
  'bwt-bestico-fs22p00a00': {
    en: {
      name: "BWT bestico FS22P00A00",
      origin: "BWT Water Filtration System",
      tastingNotes: "bestico special water filtration system for ice machines, Universal filter head, fits all BWT water+more filter cartridges, Locking for secure bypass setting and easy-to-read display, Sophisticated new connection technique for maximum flexibility in installation, Optional: maximum flexibility in the choice of connectors, DVGW-tested non-return valve integrated at inlet/outlet, Intake pressure: min 2 – max 8 bar, Water temperature: 4–30°C, Capacity: 60,000 L",
      description: "BWT bestico FS22P00A00 water filtration cartridge for HoReCa coffee and beverage equipment.",
    },
    tr: {
      name: "BWT bestico FS22P00A00",
      origin: "BWT Su Filtrasyon Sistemi",
      tastingNotes: "bestico buz makineleri için özel su filtrasyon sistemi, Tüm BWT water+more filtre kartuşlarıyla uyumlu üniversal filtre başlığı, Bypass ayarının güvenli şekilde sabitlenmesi ve kolay okunabilir gösterge, Maksimum montaj esnekliği sağlayan gelişmiş yeni bağlantı teknolojisi, Opsiyonel: bağlantı elemanı seçiminde maksimum esneklik, DVGW testli geri akış önleyici vana giriş/çıkışta entegredir, Giriş basıncı: min 2 – max 8 bar, Su derecesi: 4–30°C, Kapasite: 60.000 L",
      description: "BWT bestico FS22P00A00, HoReCa kahve ve içecek ekipmanları için su filtrasyon kartuşudur.",
    }
  },
  'bwt-besthead-flex-fs00z20a00': {
    en: {
      name: "BWT besthead FLEX FS00Z20A00",
      origin: "BWT Water Filtration System",
      tastingNotes: "BWT besthead FLEX filter head, 2 connectors 90° elbow, FLEX Insert, M 3/8\", GFRP material",
      description: "BWT besthead FLEX FS00Z20A00 water filtration cartridge for HoReCa coffee and beverage equipment.",
    },
    tr: {
      name: "BWT besthead FLEX FS00Z20A00",
      origin: "BWT Su Filtrasyon Sistemi",
      tastingNotes: "BWT besthead FLEX filtre başlığı, 2 adet 90° dirsek bağlantılı, FLEX Insert, M 3/8'', GFRP malzemeden",
      description: "BWT besthead FLEX FS00Z20A00, HoReCa kahve ve içecek ekipmanları için su filtrasyon kartuşudur.",
    }
  },
  'bwt-besthead-flex-fs00z39a00': {
    en: {
      name: "BWT besthead FLEX FS00Z39A00 (connection kit)",
      origin: "BWT Water Filtration System",
      tastingNotes: "BWT connection kit besthead flex, Connection hose DN 8, 1.5 m, with ball valve, FLEX Insert 90° elbow made from GFRP, cap nut FM 3/8\", Connector straight, FLEX Insert x M 3/8\", made from GFP",
      description: "BWT besthead FLEX FS00Z39A00 (connection kit) water filtration cartridge for HoReCa coffee and beverage equipment.",
    },
    tr: {
      name: "BWT besthead FLEX FS00Z39A00 (connection kit)",
      origin: "BWT Su Filtrasyon Sistemi",
      tastingNotes: "BWT besthead flex bağlantı kiti, Bağlantı hortumu DN 8, 1,5 m, küresel vana ile, FLEX Insert 90° dirsek GFRP malzemeden, kapak somunu FM 3/8'', Düz bağlantı parçası, FLEX Insert x M 3/8'', GFRP malzemeden",
      description: "BWT besthead FLEX FS00Z39A00 (connection kit), HoReCa kahve ve içecek ekipmanları için su filtrasyon kartuşudur.",
    }
  },
  'puly-0851000': {
    en: {
      name: "Puly Caff Puly Caff Plus NSF 900g Flapper",
      origin: "Puly Caff Cleaning Product",
      tastingNotes: "Removes coffee stain from the group, electric valves and water circuit, Ideal for cleaning and machine life time",
      description: "Puly Caff Puly Caff Plus NSF 900g Flapper professional cleaning product for coffee equipment maintenance.",
    },
    tr: {
      name: "Puly Caff Puly Caff Plus NSF 900g Flapper",
      origin: "Puly Caff Temizlik Ürünü",
      tastingNotes: "Kahve makinelerinin gruplarını, elektrikli valflerini ve su sistemini temizler, Parçaların temizliği ve ömrü için de idealdir",
      description: "Puly Caff Puly Caff Plus NSF 900g Flapper, kahve ekipmanları bakımı için profesyonel temizlik ürünüdür.",
    }
  },
  'puly-0870000': {
    en: {
      name: "Puly Caff Puly Milk Plus NSF 1000 ml Liquid",
      origin: "Puly Caff Cleaning Product",
      tastingNotes: "Steam wand and milk frother cleaner for milk and coffee residues, Perfect for automatic cappuccino frother, steam wand and stainless steel pitchers",
      description: "Puly Caff Puly Milk Plus NSF 1000 ml Liquid professional cleaning product for coffee equipment maintenance.",
    },
    tr: {
      name: "Puly Caff Puly Milk Plus NSF 1000 ml Liquid",
      origin: "Puly Caff Temizlik Ürünü",
      tastingNotes: "Buhar ve süt çubuğu temizleme sıvısı, Buhar çubuğu ve çelik sütlük temizliği için idealdir",
      description: "Puly Caff Puly Milk Plus NSF 1000 ml Liquid, kahve ekipmanları bakımı için profesyonel temizlik ürünüdür.",
    }
  },
  'puly-0205000': {
    en: {
      name: "Puly Caff Puly Grind",
      origin: "Puly Caff Cleaning Product",
      tastingNotes: "100% organic, gluten-free coffee grinder blade and grinder chamber cleaner, Cleans the internal grinder blades without having to readjust the grinder blades",
      description: "Puly Caff Puly Grind professional cleaning product for coffee equipment maintenance.",
    },
    tr: {
      name: "Puly Caff Puly Grind",
      origin: "Puly Caff Temizlik Ürünü",
      tastingNotes: "%100 organik, glutensiz kahve değirmeni bıçağı ve öğütücü bölmesi temizleyicisi, Öğütücü bıçaklarını yeniden ayarlamanıza gerek kalmadan, iç taşlama dişlerini temizler",
      description: "Puly Caff Puly Grind, kahve ekipmanları bakımı için profesyonel temizlik ürünüdür.",
    }
  },
  'puly-0860000': {
    en: {
      name: "Puly Caff Puly Caff Plus NSF 2.5 gr",
      origin: "Puly Caff Cleaning Product",
      tastingNotes: "Removes coffee stain from the group, electric valves and water circuit, Suitable for manual and superautomatic espresso machines",
      description: "Puly Caff Puly Caff Plus NSF 2.5 gr professional cleaning product for coffee equipment maintenance.",
    },
    tr: {
      name: "Puly Caff Puly Caff Plus NSF 2.5 gr",
      origin: "Puly Caff Temizlik Ürünü",
      tastingNotes: "Kahve makinelerinin gruplarını, elektrikli valflerini ve su sistemini temizler, Tüm manuel ve süper otomatik espresso makinelerine uygundur",
      description: "Puly Caff Puly Caff Plus NSF 2.5 gr, kahve ekipmanları bakımı için profesyonel temizlik ürünüdür.",
    }
  },
  'puly-0825000': {
    en: {
      name: "Puly Caff Filtre Kahve Makinesi Tableti / Puly Brew Tabs 120 tabs 4g",
      origin: "Puly Caff Cleaning Product",
      tastingNotes: "Detergent for filter coffee machines, tablets calibrated 20 mm, Removes residues of coffee and eliminates unpleasant odors",
      description: "Puly Caff Filtre Kahve Makinesi Tableti / Puly Brew Tabs 120 tabs 4g professional cleaning product for coffee equipment maintenance.",
    },
    tr: {
      name: "Puly Caff Filtre Kahve Makinesi Tableti / Puly Brew Tabs 120 tabs 4g",
      origin: "Puly Caff Temizlik Ürünü",
      tastingNotes: "Filtre kahve makineleri için 20 mm kalibre edilmiş tablet deterjan, Kahve artıkları ve hoş olmayan kokuları ortadan kaldırır",
      description: "Puly Caff Filtre Kahve Makinesi Tableti / Puly Brew Tabs 120 tabs 4g, kahve ekipmanları bakımı için profesyonel temizlik ürünüdür.",
    }
  },
  'puly-0570000': {
    en: {
      name: "Puly Caff Pulybar Igenic",
      origin: "Puly Caff Cleaning Product",
      tastingNotes: "Stainless steel, marble, wood, plastic, glass surface cleaner, Perfect for pub, restaurant, fast food, coffee shops, offices",
      description: "Puly Caff Pulybar Igenic professional cleaning product for coffee equipment maintenance.",
    },
    tr: {
      name: "Puly Caff Pulybar Igenic",
      origin: "Puly Caff Temizlik Ürünü",
      tastingNotes: "Paslanmaz çelik, mermer, ahşap, plastik, cam yüzey temizleyici, Bar, restoran, fast food, kafe, ofis vb. için mükemmeldir",
      description: "Puly Caff Pulybar Igenic, kahve ekipmanları bakımı için profesyonel temizlik ürünüdür.",
    }
  },
  'puly-0206000': {
    en: {
      name: "Puly Caff Hazne Temizleyici / Puly Grind Hopper Cleaner",
      origin: "Puly Caff Cleaning Product",
      tastingNotes: "Grinder hopper cleaner spray, Use on your grinder hopper to remove unsightly coffee oil stains",
      description: "Puly Caff Hazne Temizleyici / Puly Grind Hopper Cleaner professional cleaning product for coffee equipment maintenance.",
    },
    tr: {
      name: "Puly Caff Hazne Temizleyici / Puly Grind Hopper Cleaner",
      origin: "Puly Caff Temizlik Ürünü",
      tastingNotes: "Kahve değirmeni hazne temizleyici, Kahve yağı lekelerini çıkarmak için kahve değirmeni haznesinde kullanılır",
      description: "Puly Caff Hazne Temizleyici / Puly Grind Hopper Cleaner, kahve ekipmanları bakımı için profesyonel temizlik ürünüdür.",
    }
  },
  'puly-0812000': {
    en: {
      name: "Puly Caff Temizlik Kiti / Puly Caff Soak Cleaning System",
      origin: "Puly Caff Cleaning Product",
      tastingNotes: "Set of important cleaning agents to keep your coffee machine clean on the inside and maintain its brewing performance",
      description: "Puly Caff Temizlik Kiti / Puly Caff Soak Cleaning System professional cleaning product for coffee equipment maintenance.",
    },
    tr: {
      name: "Puly Caff Temizlik Kiti / Puly Caff Soak Cleaning System",
      origin: "Puly Caff Temizlik Ürünü",
      tastingNotes: "Kahve makinenizin içini temiz tutmak ve demleme performansını korumak için önemli bir temizleme maddeleri seti",
      description: "Puly Caff Temizlik Kiti / Puly Caff Soak Cleaning System, kahve ekipmanları bakımı için profesyonel temizlik ürünüdür.",
    }
  },
  'kef-grinder-h1': {
    en: {
      name: "KEF H1",
      origin: "KEF Coffee Grinder",
      tastingNotes: "Hardened special steel 64 mm diameter burrs for a better taste experience, LC display with visualized grind size for convenient grind size adjustment and repeat accuracy, Start-Stop automation for hands-free operation with portafilters, All-purpose grinder, Small footprint (130 mm) saves space, Solid aluminum body for a high quality finish and easy to clean, Low noise level for a quiet working environment, Hopper capacity: 380 g, Grind speed: 2.5-3.0 g/s",
      description: "KEF H1 coffee grinder with hardened steel burrs for consistent, repeatable grind size.",
    },
    tr: {
      name: "KEF H1",
      origin: "KEF Kahve Değirmeni",
      tastingNotes: "Daha iyi bir tat deneyimi için sertleştirilmiş özel çelik 64 mm çapında dişliler, Uygun öğütme boyutu ayarı ve tekrarlama doğruluğu için görselleştirilmiş öğütme boyutuna sahip LC ekran, Portafilterlerle serbest çalışma için Start-Stop otomasyonu, Tüm öğütme türleri için, Kompakt tasarım yerden tasarruf sağlar, Dayanıklı alüminyum gövde, yüksek kaliteli bir yüzey ve kolay temizlik sağlar, Sessiz bir çalışma ortamı için düşük gürültü seviyesi, Hazne kapasitesi: 380 g, Öğütme hızı: 2.5-3.0 g/s",
      description: "KEF H1 kahve değirmeni, tutarlı ve tekrarlanabilir öğütme boyutu için sertleştirilmiş çelik dişlilere sahiptir.",
    }
  },
  'kef-grinder-hc-880-lab': {
    en: {
      name: "KEF HC-880 LAB",
      origin: "KEF Coffee Grinder",
      tastingNotes: "Large and long lasting hardened 84 mm diameter special steel burrs for reliable grinding, High-performance motor for the fast grinding of higher volumes, Fan cooling, Practical powder shaker for easy cleaning and complete grinding, Heavy-duty thick metal sheet body construction provides a maximum of robustness, Hopper capacity: 1.3 kg, Grind speed: > 450 g/min",
      description: "KEF HC-880 LAB coffee grinder with hardened steel burrs for consistent, repeatable grind size.",
    },
    tr: {
      name: "KEF HC-880 LAB",
      origin: "KEF Kahve Değirmeni",
      tastingNotes: "Güvenilir öğütme için büyük ve uzun ömürlü sertleştirilmiş 84 mm çapında özel çelik dişliler, Yüksek hacimlerin hızlı öğütülmesi için yüksek performanslı motor, Fan soğutmalı, Kolay temizlik ve tam taşlama için pratik toz çalkalayıcı, Yoğun kullanımlara dayanıklı kalın sac gövde tasarımı, maksimum güvenilirlik sağlar, Hazne kapasitesi: 1.3 kg, Öğütme hızı: > 450 g/min",
      description: "KEF HC-880 LAB kahve değirmeni, tutarlı ve tekrarlanabilir öğütme boyutu için sertleştirilmiş çelik dişlilere sahiptir.",
    }
  },
  'anfim-pratica': {
    en: {
      name: "Anfim Pratica",
      origin: "Anfim Milano Coffee Grinder",
      tastingNotes: "Proven 65 mm grinding concept with premium burrs made in Germany, Innovative 2.5 inch touchscreen-display with open interface for third-party content, Stepless adjustment with a locking mechanism to prevent unwanted grind changes, Adjustable and easily removable spout for clean and centered dosing, Modern design made in Italy, Low noise level for a quiet working environment, Hopper capacity: 1.2 kg, Grind speed: 2.5 g/s",
      description: "Anfim Milano Pratica coffee grinder with premium 65mm burrs made in Germany and a modern touchscreen interface.",
    },
    tr: {
      name: "Anfim Pratica",
      origin: "Anfim Milano Kahve Değirmeni",
      tastingNotes: "Almanya'da üretilen premium 65 mm dişliler ile kanıtlanmış öğütme konsepti, Açık arayüze sahip yenilikçi 2.5 inç dokunmatik ekran, İstenmeyen öğütme değişikliklerini önlemek için kilitleme mekanizmasına sahip kademesiz ayar, Temiz ve ortalanmış dozlama için ayarlanabilir ve kolayca çıkarılabilir ağızlık, İtalya üretimi modern tasarım, Sessiz bir çalışma ortamı için düşük gürültü seviyesi, Hazne kapasitesi: 1.2 kg, Öğütme hızı: 2.5 g/s",
      description: "Anfim Milano Pratica kahve değirmeni, Almanya'da üretilen premium 65mm dişliler ve modern dokunmatik ekran arayüzüne sahiptir.",
    }
  },
  'anfim-luna': {
    en: {
      name: "Anfim Luna",
      origin: "Anfim Milano Coffee Grinder",
      tastingNotes: "Proven 65 mm grinding concept with premium burrs made in Germany, Innovative 3.5 inch touchscreen-display with open interface for third-party content, 4 programmable recipes and \"basic mode\" to lock dosing settings via owner control password, Adjustable and easily removable spout for clean and centered dosing, Modern design made in Italy, Low noise level for a quiet working environment, Hopper capacity: 2 kg, Grind speed: 2.5 g/s",
      description: "Anfim Milano Luna coffee grinder with premium 65mm burrs made in Germany and a modern touchscreen interface.",
    },
    tr: {
      name: "Anfim Luna",
      origin: "Anfim Milano Kahve Değirmeni",
      tastingNotes: "Almanya'da üretilen premium 65 mm dişliler ile kanıtlanmış öğütme konsepti, Açık arayüze sahip yenilikçi 3.5 inç dokunmatik ekran, Dozlama ayarlarını sahip kontrol şifresi ile kilitlemek için 4 programlanabilir tarif ve \"temel mod\", Temiz ve ortalanmış dozlama için ayarlanabilir ve kolayca çıkarılabilir ağızlık, İtalya üretimi modern tasarım, Sessiz bir çalışma ortamı için düşük gürültü seviyesi, Hazne kapasitesi: 2 kg, Öğütme hızı: 2.5 g/s",
      description: "Anfim Milano Luna kahve değirmeni, Almanya'da üretilen premium 65mm dişliler ve modern dokunmatik ekran arayüzüne sahiptir.",
    }
  },
  'anfim-alba': {
    en: {
      name: "Anfim Alba",
      origin: "Anfim Milano Coffee Grinder",
      tastingNotes: "Handling up to 6 kg of coffee per day at 1,700 RPM, Easy to use screen with six programmable recipes and hands-free stop/start automation, Stepless adjustment with locking mechanism to prevent unwanted grind changes, Re-designed hardened steel 80 mm grinding discs for maximum flavour extraction, Modern design made in Italy, Low noise level for a quiet working environment, Hopper capacity: 1.2 kg, Grind speed: 4-5 g/s (50Hz), 5-6 g/s (60Hz)",
      description: "Anfim Milano Alba coffee grinder with premium 65mm burrs made in Germany and a modern touchscreen interface.",
    },
    tr: {
      name: "Anfim Alba",
      origin: "Anfim Milano Kahve Değirmeni",
      tastingNotes: "1.700 rpm'de günde 6 kg'a kadar kahve öğütmektedir, Altı programlanabilir tarif ve el serbest durdurma/başlatma otomasyonu ile kullanımı kolay ekran, İstenmeyen öğütme değişikliklerini önlemek için kilitleme mekanizmalı kademesiz ayar, Maksimum lezzet ekstraksiyonu için yeniden tasarlanmış sertleştirilmiş çelik 80 mm taşlama diskleri, İtalya'da yapılan modern tasarım, Sessiz bir çalışma ortamı için düşük gürültü seviyesi, Hazne kapasitesi: 1.2 kg, Öğütme hızı: 4-5 g/s (50 Hz), 5-6 g/s (60 Hz)",
      description: "Anfim Milano Alba kahve değirmeni, Almanya'da üretilen premium 65mm dişliler ve modern dokunmatik ekran arayüzüne sahiptir.",
    }
  },
  'kef-grinder-buddy': {
    en: {
      name: "KEF Buddy (On Demand Grinder)",
      origin: "KEF Coffee Grinder",
      tastingNotes: "3.5 inch touchscreen interface with two programmable recipes and grinder control for intuitive use, 64 mm hardened steel burrs made in Germany, Cast aluminum body for long durability and optimized heat transfer, Three recipes: single shot, double shot, manual grinding, Two running modes: flush mode, barista mode, Low noise level for a quiet working environment, Hopper capacity: 1.2 kg, Grind speed: 2.5-3.0 g/s",
      description: "KEF Buddy (On Demand Grinder) on-demand coffee grinder with a touchscreen interface and German-made hardened steel burrs.",
    },
    tr: {
      name: "KEF Buddy (On Demand Grinder)",
      origin: "KEF Kahve Değirmeni",
      tastingNotes: "Kolay kullanım için iki programlanabilir tarif ve öğütücü kontrolü ile 3,5 inç dokunmatik ekran arayüzü, Almanya'da üretilen 64 mm sertleştirilmiş çelik çapaklar, Uzun dayanıklılık ve optimize edilmiş ısı transferi için döküm alüminyum gövde, Üç tarif: tek atış, çift atış, manuel taşlama, İki çalışma modu: yıkama modu, barista modu, Sessiz bir çalışma ortamı için düşük gürültü seviyesi, Hazne kapasitesi: 1,2 kg, Öğütme hızı: 2.5-3.0 g/s",
      description: "KEF Buddy (On Demand Grinder), dokunmatik ekran arayüzü ve Almanya'da üretilen sertleştirilmiş çelik dişlilere sahip talep üzerine öğüten kahve değirmenidir.",
    }
  },
  'ditting-807-lab-sweet': {
    en: {
      name: "Ditting 807 LAB SWEET",
      origin: "Ditting Swiss Coffee Grinder",
      tastingNotes: "Premium cast steel burrs featuring a special burr geometry for highest precision, Grinding capacity (medium): 9 g/s, Burr diameter: 80 mm, High-end bag clamping lever and knocker unit guaranteeing minimal retention on the slide, Bean hopper capacity: approx. 500 g, Revolutions per minute: 1400 rpm (50Hz); 1700 rpm (60Hz), Stainless steel coffee grounds container for optimal handling, Durable high-performance motor with a high average performance of 9 grams per second",
      description: "Ditting 807 LAB SWEET Swiss-made coffee grinder with premium cast steel burrs for maximum precision.",
    },
    tr: {
      name: "Ditting 807 LAB SWEET",
      origin: "Ditting İsviçre Kahve Değirmeni",
      tastingNotes: "En yüksek hassasiyet için özel çapak geometrisine sahip birinci sınıf dökme çelik çapaklar, Taşlama kapasitesi (orta): 9 g/s, Çapak çapı: 80 mm, Temiz ve ortalanmış dozlama için ayarlanabilir ve kolayca çıkarılabilir ağızlık, Çekirdek haznesi kapasitesi: yaklaşık 500 g, Dakikada devir sayısı: 1400 rpm (50 Hz); 1700 rpm (60 Hz), Optimum kullanım için paslanmaz çelik kahve telvesi kabı, Saniyede 9 gramlık yüksek ortalama performansa sahip dayanıklı yüksek performanslı motor",
      description: "Ditting 807 LAB SWEET, maksimum hassasiyet için birinci sınıf dökme çelik çapaklara sahip İsviçre üretimi kahve değirmenidir.",
    }
  },
  'ditting-807': {
    en: {
      name: "Ditting 807",
      origin: "Ditting Swiss Coffee Grinder",
      tastingNotes: "Premium cast steel burrs featuring a special burr geometry for highest precision, Grinding capacity (medium): 7.5 g/s, Burr diameter: 80 mm, High-end bag clamping lever and knocker unit guaranteeing minimal retention on the slide, Bean hopper capacity: approx. 500 g, Revolutions per minute: 1400 rpm (50Hz); 1700 rpm (60Hz), Stainless steel coffee grounds container for optimal handling, Durable high-performance motor with a high average performance of 7.5 grams per second",
      description: "Ditting 807 Swiss-made coffee grinder with premium cast steel burrs for maximum precision.",
    },
    tr: {
      name: "Ditting 807",
      origin: "Ditting İsviçre Kahve Değirmeni",
      tastingNotes: "En yüksek hassasiyet için özel çapak geometrisine sahip birinci sınıf dökme çelik çapaklar, Taşlama kapasitesi (orta): 7,5 g/s, Çapak çapı: 80 mm, Temiz ve ortalanmış dozlama için ayarlanabilir ve kolayca çıkarılabilir ağızlık, Çekirdek haznesi kapasitesi: yaklaşık 500 g, Dakikada devir sayısı: 1400 rpm (50 Hz); 1700 rpm (60 Hz), Optimum kullanım için paslanmaz çelik kahve telvesi kabı, Saniyede 7,5 gramlık yüksek ortalama performansa sahip dayanıklı yüksek performanslı motor",
      description: "Ditting 807, maksimum hassasiyet için birinci sınıf dökme çelik çapaklara sahip İsviçre üretimi kahve değirmenidir.",
    }
  },
  'ditting-kr-1203': {
    en: {
      name: "Ditting KR 1203",
      origin: "Ditting Swiss Coffee Grinder",
      tastingNotes: "Specially developed burrs allow high grinding capacity for all grind adjustment steps, Wear-resistant steel burrs, Aroma saving consistent grinding, Stepless grind adjustment, Minimal retention of coffee residues left inside the slide thanks to the manual knocker, Bag shaking unit ensures an optimal filling of the bags, Revolutions per minute: 1400 rpm (50Hz), Grinding capacity (medium): 23 g/s, Bean hopper capacity: approx. 1100 g",
      description: "Ditting KR 1203 Swiss-made coffee grinder with premium cast steel burrs for maximum precision.",
    },
    tr: {
      name: "Ditting KR 1203",
      origin: "Ditting İsviçre Kahve Değirmeni",
      tastingNotes: "Özel olarak geliştirilmiş çapaklar, tüm öğütme ayar adımları için yüksek öğütme kapasitesine izin verir, Aşınmaya dayanıklı çelik çapaklar, Aroma tasarrufu tutarlı öğütme, Kademesiz öğütme ayarı, Manuel tokmak sayesinde sürgünün içinde kalan kahve kalıntılarının minimum düzeyde tutulması, Torbaların optimum şekilde doldurulmasını sağlar, Dakikada devir sayısı: 1400 rpm (50 Hz), Öğütme kapasitesi (orta): 23 g/s, Çekirdek hazne kapasitesi: yaklaşık 1100 g",
      description: "Ditting KR 1203, maksimum hassasiyet için birinci sınıf dökme çelik çapaklara sahip İsviçre üretimi kahve değirmenidir.",
    }
  },
  'ditting-kfa-1203': {
    en: {
      name: "Ditting KFA 1203",
      origin: "Ditting Swiss Coffee Grinder",
      tastingNotes: "Specially developed burrs allow high grinding capacity for all grind adjustment steps, Wear-resistant steel burrs, Aroma saving consistent grinding, Stepless grind adjustment, Minimal retention of coffee residues left inside the slide thanks to the manual knocker, Bag shaking unit ensures an optimal filling of the bags, Revolutions per minute: 1400 rpm (50Hz), Grinding capacity (medium): 23 g/s, Bean hopper capacity: approx. 1100 g",
      description: "Ditting KFA 1203 Swiss-made coffee grinder with premium cast steel burrs for maximum precision.",
    },
    tr: {
      name: "Ditting KFA 1203",
      origin: "Ditting İsviçre Kahve Değirmeni",
      tastingNotes: "Özel olarak geliştirilmiş çapaklar, tüm öğütme ayar adımları için yüksek öğütme kapasitesine izin verir, Aşınmaya dayanıklı çelik çapaklar, Aroma tasarrufu tutarlı öğütme, Kademesiz öğütme ayarı, Manuel tokmak sayesinde sürgünün içinde kalan kahve kalıntılarının minimum düzeyde tutulması, Torbaların optimum şekilde doldurulmasını sağlar, Dakikada devir sayısı: 1400 rpm (50 Hz), Öğütme kapasitesi (orta): 23 g/s, Çekirdek hazne kapasitesi: yaklaşık 1100 g",
      description: "Ditting KFA 1203, maksimum hassasiyet için birinci sınıf dökme çelik çapaklara sahip İsviçre üretimi kahve değirmenidir.",
    }
  },
  'ditting-kr-1403': {
    en: {
      name: "Ditting KR 1403",
      origin: "Ditting Swiss Coffee Grinder",
      tastingNotes: "Specially developed 140 mm burrs allow high grinding capacity for all grind adjustment steps, Wear-resistant steel burrs, Aroma saving consistent grinding, Stepless grind adjustment, Minimal retention of coffee residues left inside the slide thanks to the manual knocker, Bag shaking unit ensures an optimal filling of the bags, Revolutions per minute: 1400 rpm (50Hz), Average grinding capacity: 2200 g/min, Bean hopper capacity: approx. 1100 g",
      description: "Ditting KR 1403 Swiss-made coffee grinder with premium cast steel burrs for maximum precision.",
    },
    tr: {
      name: "Ditting KR 1403",
      origin: "Ditting İsviçre Kahve Değirmeni",
      tastingNotes: "Özel olarak geliştirilmiş 140mm çapaklar, tüm öğütme ayar adımları için yüksek öğütme kapasitesine izin verir, Aşınmaya dayanıklı çelik çapaklar, Aroma tasarrufu tutarlı öğütme, Kademesiz öğütme ayarı, Manuel tokmak sayesinde sürgünün içinde kalan kahve kalıntılarının minimum düzeyde tutulması, Torbaların optimum şekilde doldurulmasını sağlar, Dakikada devir sayısı: 1400 rpm (50 Hz), Ortalama öğütme kapasitesi: 2200 g/dk, Çekirdek hazne kapasitesi: yaklaşık 1100 g",
      description: "Ditting KR 1403, maksimum hassasiyet için birinci sınıf dökme çelik çapaklara sahip İsviçre üretimi kahve değirmenidir.",
    }
  },
  'ditting-kfa-1403': {
    en: {
      name: "Ditting KFA 1403",
      origin: "Ditting Swiss Coffee Grinder",
      tastingNotes: "Specially developed 140 mm burrs allow high grinding capacity for all grind adjustment steps, Wear-resistant steel burrs, Aroma saving consistent grinding, Stepless grind adjustment, Minimal retention of coffee residues left inside the slide thanks to the manual knocker, Bag shaking unit ensures an optimal filling of the bags, Revolutions per minute: 1400 rpm (50Hz), Average grinding capacity: 2200 g/min, Bean hopper capacity: approx. 1100 g",
      description: "Ditting KFA 1403 Swiss-made coffee grinder with premium cast steel burrs for maximum precision.",
    },
    tr: {
      name: "Ditting KFA 1403",
      origin: "Ditting İsviçre Kahve Değirmeni",
      tastingNotes: "Özel olarak geliştirilmiş 140mm çapaklar, tüm öğütme ayar adımları için yüksek öğütme kapasitesine izin verir, Aşınmaya dayanıklı çelik çapaklar, Aroma tasarrufu tutarlı öğütme, Kademesiz öğütme ayarı, Manuel tokmak sayesinde sürgünün içinde kalan kahve kalıntılarının minimum düzeyde tutulması, Torbaların optimum şekilde doldurulmasını sağlar, Dakikada devir sayısı: 1400 rpm (50 Hz), Ortalama öğütme kapasitesi: 2200 g/dk, Çekirdek hazne kapasitesi: yaklaşık 1100 g",
      description: "Ditting KFA 1403, maksimum hassasiyet için birinci sınıf dökme çelik çapaklara sahip İsviçre üretimi kahve değirmenidir.",
    }
  },
  'ditting-1827-high-volume-s': {
    en: {
      name: "Ditting 1827 High Volume S",
      origin: "Ditting Swiss Industrial Coffee Grinder",
      tastingNotes: "Premium cast steel burrs featuring a special burr geometry for highest precision, Grinding capacity (medium): 300 kg/h, Burr diameter: 80 mm, Approx. burr life time: 25-45 tons, Bean hopper capacity: approx. 30 kg, Revolutions per minute: 1450 rpm (50Hz); 1750 rpm (60Hz), Stainless steel coffee grounds container (200 kg) for optimal handling, Burr diameter: 180 mm",
      description: "Ditting 1827 High Volume S high-volume industrial coffee grinder built for continuous, high-capacity roastery use.",
    },
    tr: {
      name: "Ditting 1827 High Volume S",
      origin: "Ditting İsviçre Endüstriyel Kahve Değirmeni",
      tastingNotes: "En yüksek hassasiyet için özel çapak geometrisine sahip birinci sınıf dökme çelik çapaklar, Öğütme kapasitesi (orta): 300 kg/saat, Çapak çapı: 80 mm, Yaklaşık dişli ömrü: 25-45 ton, Çekirdek haznesi kapasitesi: yaklaşık 30 kg, Dakikada devir sayısı: 1450 rpm (50 Hz); 1750 rpm (60 Hz), Optimum kullanım için paslanmaz çelik kahve telvesi kabı (200 kg), Dişli çapı: 180 mm",
      description: "Ditting 1827 High Volume S, sürekli ve yüksek kapasiteli kavurma tesisi kullanımı için üretilmiş yüksek hacimli endüstriyel kahve değirmenidir.",
    }
  },
  'ditting-1827-high-volume-st': {
    en: {
      name: "Ditting 1827 High Volume ST",
      origin: "Ditting Swiss Industrial Coffee Grinder",
      tastingNotes: "Premium cast steel burrs featuring a special burr geometry for highest precision, Grinding capacity (medium): 300 kg/h, Burr diameter: 80 mm, Approx. burr life time: 25-45 tons, Bean hopper capacity: approx. 30 kg, Revolutions per minute: 1450 rpm (50Hz); 1750 rpm (60Hz), Stainless steel coffee grounds container (200 kg) for optimal handling, Burr diameter: 180 mm",
      description: "Ditting 1827 High Volume ST high-volume industrial coffee grinder built for continuous, high-capacity roastery use.",
    },
    tr: {
      name: "Ditting 1827 High Volume ST",
      origin: "Ditting İsviçre Endüstriyel Kahve Değirmeni",
      tastingNotes: "En yüksek hassasiyet için özel çapak geometrisine sahip birinci sınıf dökme çelik çapaklar, Öğütme kapasitesi (orta): 300 kg/saat, Çapak çapı: 80 mm, Yaklaşık dişli ömrü: 25-45 ton, Çekirdek haznesi kapasitesi: yaklaşık 30 kg, Dakikada devir sayısı: 1450 rpm (50 Hz); 1750 rpm (60 Hz), Optimum kullanım için paslanmaz çelik kahve telvesi kabı (200 kg), Dişli çapı: 180 mm",
      description: "Ditting 1827 High Volume ST, sürekli ve yüksek kapasiteli kavurma tesisi kullanımı için üretilmiş yüksek hacimli endüstriyel kahve değirmenidir.",
    }
  },
  'ditting-kfa-1403-industrial': {
    en: {
      name: "Ditting KFA 1403 Industrial",
      origin: "Ditting Swiss Industrial Coffee Grinder",
      tastingNotes: "Specially developed 140 mm burrs allow high grinding capacity for all grind adjustment steps, Wear-resistant steel burrs, Aroma saving consistent grinding, Stepless grind adjustment, Minimal retention of coffee residues left inside the slide thanks to the manual knocker, Bag shaking unit ensures an optimal filling of the bags, Revolutions per minute: 1400 rpm (50Hz), Average grinding capacity: 2200 g/min, Bean hopper capacity: approx. 10 kg",
      description: "Ditting KFA 1403 Industrial high-volume industrial coffee grinder built for continuous, high-capacity roastery use.",
    },
    tr: {
      name: "Ditting KFA 1403 Industrial",
      origin: "Ditting İsviçre Endüstriyel Kahve Değirmeni",
      tastingNotes: "Özel olarak geliştirilmiş 140mm çapaklar, tüm öğütme ayar adımları için yüksek öğütme kapasitesine izin verir, Aşınmaya dayanıklı çelik çapaklar, Aroma tasarrufu tutarlı öğütme, Kademesiz öğütme ayarı, Manuel tokmak sayesinde sürgünün içinde kalan kahve kalıntılarının minimum düzeyde tutulması, Torbaların optimum şekilde doldurulmasını sağlar, Dakikada devir sayısı: 1400 rpm (50 Hz), Ortalama öğütme kapasitesi: 2200 g/dk, Çekirdek hazne kapasitesi: yaklaşık 10 kg",
      description: "Ditting KFA 1403 Industrial, sürekli ve yüksek kapasiteli kavurma tesisi kullanımı için üretilmiş yüksek hacimli endüstriyel kahve değirmenidir.",
    }
  },
  'eureka-firenze-65': {
    en: {
      name: "Eureka Firenze 65",
      origin: "Eureka Espresso Coffee Grinder",
      tastingNotes: "Stepless Micrometric Regulation System (patented by Eureka), Touch screen (3 doses + continuous), \"High Speed\" Grind Dispersion, Espresso grinder, All-Purpose Fork for \"Hands-Free\" Operations, Die-cast aluminium body, Flat type and 65 mm hardened steel material burrs, Hopper capacity: 1.2/2 kg, Revolution: 1350 rpm, Productivity: 1.5-2.0/3.2-3.6 g/s",
      description: "Eureka Firenze 65 espresso grinder with the patented Eureka stepless micrometric regulation system.",
    },
    tr: {
      name: "Eureka Firenze 65",
      origin: "Eureka Espresso Kahve Değirmeni",
      tastingNotes: "Kademesiz Mikrometrik Düzenleme Sistemi (Eureka Patentli), Dokunmatik ekran (3 doz + sürekli), Yüksek Hız öğütme, Espresso değirmeni, Özel Kaşık tutucu çatal, Alüminyum döküm gövde, Düz 65 mm sertleştirilmiş çelik malzemeden dişliler, Hazne kapasitesi: 1,2/2 kg, Devir Hızı: 1350 rpm, Verimlilik 1,5-2,0/3,2-3,6 g/s",
      description: "Eureka Firenze 65 espresso değirmeni, Eureka'nın patentli kademesiz mikrometrik düzenleme sistemine sahiptir.",
    }
  },
  'eureka-firenze-75': {
    en: {
      name: "Eureka Firenze 75",
      origin: "Eureka Espresso Coffee Grinder",
      tastingNotes: "Stepless Micrometric Regulation System (patented by Eureka), Touch screen (3 doses + continuous), \"High Speed\" Grind Dispersion, Espresso grinder, All-Purpose Fork for \"Hands-Free\" Operations, Die-cast aluminium body, Flat type and 75 mm hardened steel material burrs, Hopper capacity: 1.2/2 kg, Revolution: 1350 rpm, Productivity: 1.5-2.0/3.2-3.6 g/s",
      description: "Eureka Firenze 75 espresso grinder with the patented Eureka stepless micrometric regulation system.",
    },
    tr: {
      name: "Eureka Firenze 75",
      origin: "Eureka Espresso Kahve Değirmeni",
      tastingNotes: "Kademesiz Mikrometrik Düzenleme Sistemi (Eureka Patentli), Dokunmatik ekran (3 doz + sürekli), Yüksek Hız öğütme, Espresso değirmeni, Özel Kaşık tutucu çatal, Alüminyum döküm gövde, Düz 75 mm sertleştirilmiş çelik malzemeden dişliler, Hazne kapasitesi: 1,2/2 kg, Devir Hızı: 1350 rpm, Verimlilik 1,5-2,0/3,2-3,6 g/s",
      description: "Eureka Firenze 75 espresso değirmeni, Eureka'nın patentli kademesiz mikrometrik düzenleme sistemine sahiptir.",
    }
  },
  'eureka-helios-75': {
    en: {
      name: "Eureka Helios 75",
      origin: "Eureka Espresso Coffee Grinder",
      tastingNotes: "Stepless Micrometric Regulation System (patented by Eureka), Touch screen (3 doses + continuous), \"High Speed\" Grind Dispersion, Espresso grinder, All-Purpose Fork for \"Hands-Free\" Operations, Die-cast aluminium body, Flat type and 80 mm hardened steel material burrs, Hopper capacity: 1.2 kg, Revolution: 1420 rpm, Productivity: 6.5-8 g/s",
      description: "Eureka Helios 75 espresso grinder with the patented Eureka stepless micrometric regulation system.",
    },
    tr: {
      name: "Eureka Helios 75",
      origin: "Eureka Espresso Kahve Değirmeni",
      tastingNotes: "Kademesiz Mikrometrik Düzenleme Sistemi (Eureka Patentli), Dokunmatik ekran (3 doz + sürekli), Yüksek Hız öğütme, Espresso değirmeni, Özel Kaşık tutucu çatal, Alüminyum döküm gövde, Düz 80 mm sertleştirilmiş çelik malzemeden dişliler, Hazne kapasitesi: 1,2 kg, Devir Hızı: 1420 rpm, Verimlilik 6,5-8 g/s",
      description: "Eureka Helios 75 espresso değirmeni, Eureka'nın patentli kademesiz mikrometrik düzenleme sistemine sahiptir.",
    }
  },
  'eureka-helios-65': {
    en: {
      name: "Eureka Helios 65",
      origin: "Eureka Espresso Coffee Grinder",
      tastingNotes: "Stepless Micrometric Regulation System (patented by Eureka), Touch screen (3 doses + continuous), \"High Speed\" Grind Dispersion, Espresso grinder, All-Purpose Fork for \"Hands-Free\" Operations, Die-cast aluminium body, Flat type and 65 mm hardened steel material burrs, Hopper capacity: 1.2 kg, Revolution: 1380 rpm, Productivity: 2.8-3.8 g/s",
      description: "Eureka Helios 65 espresso grinder with the patented Eureka stepless micrometric regulation system.",
    },
    tr: {
      name: "Eureka Helios 65",
      origin: "Eureka Espresso Kahve Değirmeni",
      tastingNotes: "Kademesiz Mikrometrik Düzenleme Sistemi (Eureka Patentli), Dokunmatik ekran (3 doz + sürekli), Yüksek Hız öğütme, Espresso değirmeni, Özel Kaşık tutucu çatal, Alüminyum döküm gövde, Düz 65 mm sertleştirilmiş çelik malzemeden dişliler, Hazne kapasitesi: 1,2 kg, Devir Hızı: 1380 rpm, Verimlilik 2,8-3,8 g/s",
      description: "Eureka Helios 65 espresso değirmeni, Eureka'nın patentli kademesiz mikrometrik düzenleme sistemine sahiptir.",
    }
  },
  'eureka-atom-w-65': {
    en: {
      name: "Eureka Atom W 65",
      origin: "Eureka Espresso Coffee Grinder",
      tastingNotes: "Stepless Micrometric Regulation System (patented by Eureka), Blow Up System (optional), Touch display with IPS technology, \"High Speed\" Grind Dispersion, Instant Grind Weighing Technology, All-Purpose Fork for \"Hands-Free\" Operations, Die-cast aluminium body, Flat type and 65/75 mm hardened steel material burrs, Hopper capacity: 1.2 kg, Revolution: 1400 rpm, Productivity: 3.3-4.8 g/s",
      description: "Eureka Atom W 65 espresso grinder with the patented Eureka stepless micrometric regulation system.",
    },
    tr: {
      name: "Eureka Atom W 65",
      origin: "Eureka Espresso Kahve Değirmeni",
      tastingNotes: "Kademesiz Mikrometrik Düzenleme Sistemi (Eureka Patentli), Hava püskürtme sistemi (opsiyonel), Dokunmatik ekran IPS teknolojisi ile, Yüksek Hız öğütme, Anında Öğütme Terazi Teknolojisi, Özel Kaşık tutucu çatal, Alüminyum döküm gövde, Düz 65/75 mm sertleştirilmiş çelik malzemeden dişliler, Hazne kapasitesi: 1,2 kg, Devir hızı: 1400 rpm, Verimlilik 3,3-4,8 g/s",
      description: "Eureka Atom W 65 espresso değirmeni, Eureka'nın patentli kademesiz mikrometrik düzenleme sistemine sahiptir.",
    }
  },
  'eureka-atom-w-75': {
    en: {
      name: "Eureka Atom W 75",
      origin: "Eureka Espresso Coffee Grinder",
      tastingNotes: "Stepless Micrometric Regulation System (patented by Eureka), Blow Up System (optional), Touch display with IPS technology, \"High Speed\" Grind Dispersion, Instant Grind Weighing Technology, All-Purpose Fork for \"Hands-Free\" Operations, Die-cast aluminium body, Flat type and 65/75 mm hardened steel material burrs, Hopper capacity: 1.2 kg, Revolution: 1400 rpm, Productivity: 3.3-4.8 g/s",
      description: "Eureka Atom W 75 espresso grinder with the patented Eureka stepless micrometric regulation system.",
    },
    tr: {
      name: "Eureka Atom W 75",
      origin: "Eureka Espresso Kahve Değirmeni",
      tastingNotes: "Kademesiz Mikrometrik Düzenleme Sistemi (Eureka Patentli), Hava püskürtme sistemi (opsiyonel), Dokunmatik ekran IPS teknolojisi ile, Yüksek Hız öğütme, Anında Öğütme Terazi Teknolojisi, Özel Kaşık tutucu çatal, Alüminyum döküm gövde, Düz 65/75 mm sertleştirilmiş çelik malzemeden dişliler, Hazne kapasitesi: 1,2 kg, Devir hızı: 1400 rpm, Verimlilik 3,3-4,8 g/s",
      description: "Eureka Atom W 75 espresso değirmeni, Eureka'nın patentli kademesiz mikrometrik düzenleme sistemine sahiptir.",
    }
  },
  'eureka-atom-specialty-75': {
    en: {
      name: "Eureka Atom Specialty 75",
      origin: "Eureka Espresso Coffee Grinder",
      tastingNotes: "Stepless Micrometric Regulation System (patented by Eureka), Blow Up System (optional), Digital display, \"High Speed\" Grind Dispersion, Espresso grinder, All-Purpose Fork for \"Hands-Free\" Operations, Die-cast aluminium body, Flat type and 75 mm hardened steel material burrs, Hopper capacity: 1.4 kg, Revolution: 1400 rpm, Productivity: 4.5-5.5 g/s",
      description: "Eureka Atom Specialty 75 espresso grinder with the patented Eureka stepless micrometric regulation system.",
    },
    tr: {
      name: "Eureka Atom Specialty 75",
      origin: "Eureka Espresso Kahve Değirmeni",
      tastingNotes: "Kademesiz Mikrometrik Düzenleme Sistemi (Eureka Patentli), Hava püskürtme sistemi (opsiyonel), Dijital ekran, Yüksek Hız öğütme, Espresso değirmeni, Özel Kaşık tutucu çatal, Alüminyum döküm gövde, Düz 75 mm sertleştirilmiş çelik malzemeden dişliler, Hazne kapasitesi: 1,4 kg, Devir hızı: 1400 rpm, Verimlilik 4,5-5,5 g/s",
      description: "Eureka Atom Specialty 75 espresso değirmeni, Eureka'nın patentli kademesiz mikrometrik düzenleme sistemine sahiptir.",
    }
  },
  'eureka-zenith-65-neo': {
    en: {
      name: "Eureka Zenith 65 Neo",
      origin: "Eureka Espresso Coffee Grinder",
      tastingNotes: "Stepless Micrometric Regulation System (patented by Eureka), \"Barista Special\" electronics, \"High Speed\" Grind Dispersion, Espresso grinder, Die-cast aluminium body, Flat type and 65 mm hardened steel material burrs, Hopper capacity: 1.2 kg, Revolution: 1370 rpm, Productivity: 2.8-3.8 g/s",
      description: "Eureka Zenith 65 Neo espresso grinder with the patented Eureka stepless micrometric regulation system.",
    },
    tr: {
      name: "Eureka Zenith 65 Neo",
      origin: "Eureka Espresso Kahve Değirmeni",
      tastingNotes: "Kademesiz Mikrometrik Düzenleme Sistemi (Eureka Patentli), Barista özel elektronik kontrol, Yüksek Hız öğütme, Espresso değirmeni, Alüminyum döküm gövde, Düz 65 mm sertleştirilmiş çelik malzemeden dişliler, Hazne kapasitesi: 1,2 kg, Devir hızı: 1370 rpm, Verimlilik 2,8-3,8 g/s",
      description: "Eureka Zenith 65 Neo espresso değirmeni, Eureka'nın patentli kademesiz mikrometrik düzenleme sistemine sahiptir.",
    }
  },
  'eureka-drogheria-75': {
    en: {
      name: "Eureka Drogheria 75",
      origin: "Eureka Espresso Coffee Grinder",
      tastingNotes: "Stepless Micrometric Regulation System (patented by Eureka), Blow Up System, \"High Speed\" Grind Dispersion, All-Purpose grinder, New coffee channel with bag holder, Die-cast aluminium body, Flat type and 75/85 mm hardened steel material burrs, Hopper capacity: 1.4 kg, Revolution: 1350 rpm, Productivity: 30 kg/hour",
      description: "Eureka Drogheria 75 espresso grinder with the patented Eureka stepless micrometric regulation system.",
    },
    tr: {
      name: "Eureka Drogheria 75",
      origin: "Eureka Espresso Kahve Değirmeni",
      tastingNotes: "Kademesiz Mikrometrik Düzenleme Sistemi (Eureka Patentli), Hava püskürtme sistemi, Yüksek Hız öğütme, Tüm öğütme türleri için, Kahve paketi tutuculu yeni ağız, Alüminyum döküm gövde, Düz 75/85 mm sertleştirilmiş çelik malzemeden dişliler, Hazne kapasitesi: 1,4 kg, Devir Hızı: 1350 rpm, Verimlilik 30 kg/saat",
      description: "Eureka Drogheria 75 espresso değirmeni, Eureka'nın patentli kademesiz mikrometrik düzenleme sistemine sahiptir.",
    }
  },
  'eureka-drogheria-85': {
    en: {
      name: "Eureka Drogheria 85",
      origin: "Eureka Espresso Coffee Grinder",
      tastingNotes: "Stepless Micrometric Regulation System (patented by Eureka), Blow Up System, \"High Speed\" Grind Dispersion, All-Purpose grinder, New coffee channel with bag holder, Die-cast aluminium body, Flat type and 75/85 mm hardened steel material burrs, Hopper capacity: 1.4 kg, Revolution: 1350 rpm, Productivity: 30 kg/hour",
      description: "Eureka Drogheria 85 espresso grinder with the patented Eureka stepless micrometric regulation system.",
    },
    tr: {
      name: "Eureka Drogheria 85",
      origin: "Eureka Espresso Kahve Değirmeni",
      tastingNotes: "Kademesiz Mikrometrik Düzenleme Sistemi (Eureka Patentli), Hava püskürtme sistemi, Yüksek Hız öğütme, Tüm öğütme türleri için, Kahve paketi tutuculu yeni ağız, Alüminyum döküm gövde, Düz 75/85 mm sertleştirilmiş çelik malzemeden dişliler, Hazne kapasitesi: 1,4 kg, Devir Hızı: 1350 rpm, Verimlilik 30 kg/saat",
      description: "Eureka Drogheria 85 espresso değirmeni, Eureka'nın patentli kademesiz mikrometrik düzenleme sistemine sahiptir.",
    }
  },
  'eureka-atom-pro': {
    en: {
      name: "Eureka Atom Pro",
      origin: "Eureka Espresso Coffee Grinder",
      tastingNotes: "Stepless Micrometric Regulation System (patented by Eureka), Blow Up System, Easy Setting System, \"High Speed\" Grind Dispersion, All-Purpose grinder, All-Purpose Fork for \"Hands-Free\" Operations, Die-cast aluminium body, Flat type and 75 mm hardened steel material burrs, Hopper capacity: 300 gr, Revolution: 1400 rpm, Productivity: 7-8 g/s",
      description: "Eureka Atom Pro espresso grinder with the patented Eureka stepless micrometric regulation system.",
    },
    tr: {
      name: "Eureka Atom Pro",
      origin: "Eureka Espresso Kahve Değirmeni",
      tastingNotes: "Kademesiz Mikrometrik Düzenleme Sistemi (Eureka Patentli), Hava püskürtme sistemi, Kullanımı kolay sistem, Yüksek Hız öğütme, Tüm öğütme türleri için, Özel Kaşık tutucu çatal, Alüminyum döküm gövde, Düz 75 mm sertleştirilmiş çelik malzemeden dişliler, Hazne kapasitesi: 300 gr, Devir Hızı: 1400 rpm, Verimlilik 7-8 g/s",
      description: "Eureka Atom Pro espresso değirmeni, Eureka'nın patentli kademesiz mikrometrik düzenleme sistemine sahiptir.",
    }
  },
  'eureka-sg-85-barista': {
    en: {
      name: "Eureka SG 85 Barista",
      origin: "Eureka Espresso Coffee Grinder",
      tastingNotes: "Special 85 mm flat burrs, combined with high-performance engine to ensure an outstanding grind productivity, Stepless Micrometric Regulation System (patented by Eureka), All-Purpose grinder, Temperature monitoring of the grinding chamber, Vibrating plate to facilitate the collection of ground coffee, High performance bag lock (up to 1 kg pack), with a versatile and highly efficient design, Hopper capacity: 1.2 kg, Revolution: 1350 rpm, Productivity: 10 g/sec",
      description: "Eureka SG 85 Barista espresso grinder with the patented Eureka stepless micrometric regulation system.",
    },
    tr: {
      name: "Eureka SG 85 Barista",
      origin: "Eureka Espresso Kahve Değirmeni",
      tastingNotes: "Özel 85 mm düz çapaklar, yüksek performanslı motor ile birlikte üstün bir öğütme verimliliği sağlayan, Kademesiz Mikrometrik Düzenleme Sistemi (Eureka Patentli), Tüm öğütme türleri için, Öğütme haznesinin sıcaklık kontrolü, Öğütülmüş kahvenin toplanmasını kolaylaştırmak için titreşimli plaka, Çok yönlü ve son derece kullanışlı bir tasarıma sahip yüksek performanslı torba kilidi (1 kg'a kadar paket), Hazne kapasitesi: 1,2 kg, Devir Hızı: 1350 rpm, Verimlilik 10 g/sn",
      description: "Eureka SG 85 Barista espresso değirmeni, Eureka'nın patentli kademesiz mikrometrik düzenleme sistemine sahiptir.",
    }
  },
  'eureka-easy': {
    en: {
      name: "Eureka Easy",
      origin: "Eureka Espresso Coffee Grinder",
      tastingNotes: "Filter coffee grinder, Stepless Micrometric Regulation System (patented by Eureka), \"High Speed\" Maintenance, Flat type and 50 mm hardened steel material burrs, Hopper capacity: 310 gr, Revolution: 1350 rpm, Productivity: 1.5-2.1 g/s brew",
      description: "Eureka Easy coffee grinder with the patented Eureka stepless micrometric regulation system.",
    },
    tr: {
      name: "Eureka Easy",
      origin: "Eureka Espresso Kahve Değirmeni",
      tastingNotes: "Filtre kahve değirmeni, Kademesiz Mikrometrik Düzenleme Sistemi (Eureka Patentli), Yüksek Hızlı bakım, Düz 50 mm sertleştirilmiş çelik malzemeden dişliler, Hazne kapasitesi: 310 gr, Devir hızı: 1350 rpm, Verimlilik 1,5-2,1 g/s demleme",
      description: "Eureka Easy kahve değirmeni, Eureka'nın patentli kademesiz mikrometrik düzenleme sistemine sahiptir.",
    }
  },
  'eureka-mignon-specialita': {
    en: {
      name: "Eureka Mignon Specialita",
      origin: "Eureka Espresso Coffee Grinder",
      tastingNotes: "All-Purpose grinder, Stepless Micrometric Regulation System (patented by Eureka), Silent Technology, Touch screen (2 doses + continuous), \"High Speed\" Maintenance, Flat type and 55 mm hardened steel material burrs, Hopper capacity: 510 gr, Revolution: 1350 rpm, Productivity: 1.2-1.8 g/s espresso, 1.9-2.5 g/s brew",
      description: "Eureka Mignon Specialita coffee grinder with the patented Eureka stepless micrometric regulation system.",
    },
    tr: {
      name: "Eureka Mignon Specialita",
      origin: "Eureka Espresso Kahve Değirmeni",
      tastingNotes: "Tüm öğütme türleri için, Kademesiz Mikrometrik Düzenleme Sistemi (Eureka Patentli), Sessiz Teknoloji, Dokunmatik ekran (2 doz + sürekli), Yüksek Hızlı bakım, Düz 55 mm sertleştirilmiş çelik malzemeden dişliler, Hazne kapasitesi: 510 gr, Devir hızı: 1350 rpm, Verimlilik 1,2-1,8 g/s Espresso, 1,9-2,5 g/s Demleme",
      description: "Eureka Mignon Specialita kahve değirmeni, Eureka'nın patentli kademesiz mikrometrik düzenleme sistemine sahiptir.",
    }
  },
  'eureka-mignon-turbo': {
    en: {
      name: "Eureka Mignon Turbo",
      origin: "Eureka Espresso Coffee Grinder",
      tastingNotes: "All-Purpose grinder, Stepless Micrometric Regulation System (patented by Eureka), Silent Technology, Touch screen (2 doses + continuous), \"High Speed\" Maintenance, Flat type and 55 mm hardened steel material burrs, Hopper capacity: 510 gr, Revolution: 1350 rpm, Productivity: 1.2-1.8 g/s espresso, 1.9-2.5 g/s brew",
      description: "Eureka Mignon Turbo coffee grinder with the patented Eureka stepless micrometric regulation system.",
    },
    tr: {
      name: "Eureka Mignon Turbo",
      origin: "Eureka Espresso Kahve Değirmeni",
      tastingNotes: "Tüm öğütme türleri için, Kademesiz Mikrometrik Düzenleme Sistemi (Eureka Patentli), Sessiz Teknoloji, Dokunmatik ekran (2 doz + sürekli), Yüksek Hızlı bakım, Düz 55 mm sertleştirilmiş çelik malzemeden dişliler, Hazne kapasitesi: 510 gr, Devir hızı: 1350 rpm, Verimlilik 1,2-1,8 g/s Espresso, 1,9-2,5 g/s Demleme",
      description: "Eureka Mignon Turbo kahve değirmeni, Eureka'nın patentli kademesiz mikrometrik düzenleme sistemine sahiptir.",
    }
  },
  'eureka-mignon-perfetto': {
    en: {
      name: "Eureka Mignon Perfetto",
      origin: "Eureka Espresso Coffee Grinder",
      tastingNotes: "All-Purpose grinder, Stepless Micrometric Regulation System (patented by Eureka), Silent Technology, Touch screen (2 doses + continuous), \"High Speed\" Maintenance, Flat type and 50 mm hardened steel material burrs, Hopper capacity: 310 gr, Revolution: 1350 rpm, Productivity: 1-1.6 g/s espresso, 1.7-2.3 g/s brew",
      description: "Eureka Mignon Perfetto coffee grinder with the patented Eureka stepless micrometric regulation system.",
    },
    tr: {
      name: "Eureka Mignon Perfetto",
      origin: "Eureka Espresso Kahve Değirmeni",
      tastingNotes: "Tüm öğütme türleri için, Kademesiz Mikrometrik Düzenleme Sistemi (Eureka Patentli), Sessiz Teknoloji, Dokunmatik ekran (2 doz + sürekli ), Yüksek Hızlı bakım, Düz 50 mm sertleştirilmiş çelik malzemeden dişliler, Hazne kapasitesi: 310 gr, Devir hızı: 1350 rpm, Verimlilik 1-1,6 g/s Espresso, 1,7-2,3 g/s Demleme",
      description: "Eureka Mignon Perfetto kahve değirmeni, Eureka'nın patentli kademesiz mikrometrik düzenleme sistemine sahiptir.",
    }
  },
  'puq-mini': {
    en: {
      name: "PUQ Press Mini",
      origin: "PUQ Automatic Tamper",
      tastingNotes: "Works with most types of portafilters (there are a few exceptions). Naked, single sprout and double sprouts, Naked portafilter compatibility, Non-stick tamper finish, Force adjustment: steps of 1kg in the range from 10-30 kg, Cycle duration: 1.3s, Tamper diameter: 53.0 – 58.3mm, Capacity: up to 2 kg of coffee per week",
      description: "PUQ Press Mini automatic espresso tamper with adjustable force settings and non-stick finish.",
    },
    tr: {
      name: "PUQ Press Mini",
      origin: "PUQ Otomatik Tamper",
      tastingNotes: "Çoğu portafiltre türüyle çalışır (birkaç istisna ile) Naked, tek filiz ve çift filiz, Naked portafiltre uyumluluğu, Yapışmaz kurcalama kaplama, Kuvveti ayarı: 10 – 30 kg aralığında 1 kg'lık adımlar, Döngü süresi: 1.3s, Kurcalama çapı: 53.0 - 58.3mm, Kapasite: Haftada 2 kg'a kadar kahve",
      description: "PUQ Press Mini, ayarlanabilir kuvvet ayarlarına ve yapışmaz kaplamaya sahip otomatik espresso tamperidir.",
    }
  },
  'puq-q': {
    en: {
      name: "PUQ Press Q",
      origin: "PUQ Automatic Tamper",
      tastingNotes: "Suited for every machine. Single- and double sprouted portafilters, Naked portafilter compatibility, Non-stick tamper finish, Force adjustment: steps of 1kg in the range from 10-30 kg, Cycle duration: 1.3s, Tamper diameter: 53.0 – 58.3mm, Capacity: up to 10 kg of coffee per week",
      description: "PUQ Press Q automatic espresso tamper with adjustable force settings and non-stick finish.",
    },
    tr: {
      name: "PUQ Press Q",
      origin: "PUQ Otomatik Tamper",
      tastingNotes: "Her makine için uygundur. Tek ve çift ağızlı portafiltreler, Naked portafiltre uyumluluğu, Yapışmaz kurcalama bitiş, Kuvveti ayarı: 10 – 30 kg aralığında 1 kg'lık adımlar, Döngü süresi: 1.3s, Kurcalama çapı: 53.0 - 58.3mm, Kapasite: Haftada 10 kg'a kadar kahve",
      description: "PUQ Press Q, ayarlanabilir kuvvet ayarlarına ve yapışmaz kaplamaya sahip otomatik espresso tamperidir.",
    }
  },
  'puq-pro': {
    en: {
      name: "PUQ Press PRO",
      origin: "PUQ Automatic Tamper",
      tastingNotes: "Suited for every machine. Single- and double sprouted portafilters, Naked portafilter compatibility, Non-stick tamper finish, Force adjustment: steps of 5kg in the range from 30 kg, Cycle duration: 1.3s, Tamper diameter: 53.0 – 58.3mm, Capacity: more than 10 kg of coffee per week",
      description: "PUQ Press PRO automatic espresso tamper with adjustable force settings and non-stick finish.",
    },
    tr: {
      name: "PUQ Press PRO",
      origin: "PUQ Otomatik Tamper",
      tastingNotes: "Her makine için uygundur. Tek ve çift ağızlı portafiltreler, Naked portafiltre uyumluluğu, Yapışmaz kurcalama bitiş, Kuvvet ayarı: 30 kg aralığında 5 kg'lık adımlar, Döngü süresi: 1.3s, Kurcalama çapı: 53.0 - 58.3mm, Kapasite: Haftada 10 kg'dan fazla kahve",
      description: "PUQ Press PRO, ayarlanabilir kuvvet ayarlarına ve yapışmaz kaplamaya sahip otomatik espresso tamperidir.",
    }
  },
  'roest-p3000': {
    en: {
      name: "ROEST P3000",
      origin: "ROEST Coffee Roaster",
      tastingNotes: "Flexible roaster that's just as easy to operate with or without previous roasting skills, Replicate your best roasts consistently with unmatched control and uniform heat transfer, Throughput: 25 kg/h (4-6 tons per month), Roast cycles: <7 min - fast, efficient, repeatable production, Precise control with 18 sensors, Three access points for weekly and monthly cleaning, Connectivity: Wi-Fi and Ethernet for remote monitoring and control, Advanced convection system, Compact design: 410mm - ideal solution for small spaces",
      description: "ROEST P3000 coffee roaster with precise sensor control and Wi-Fi connectivity for consistent, repeatable roasts.",
    },
    tr: {
      name: "ROEST P3000",
      origin: "ROEST Kahve Kavurma Makinesi",
      tastingNotes: "Önceki kavurma deneyiminiz olsun ya da olmasın, kolayca kullanılabilen esnek bir kavurma makinesi, Eşsiz kontrol ve eşit ısı transferi ile en iyi kavurmalarınızı tutarlı bir şekilde tekrarlayın, Kapasite: 25 kg/saat (ayda 4-6 ton), Kavurma döngüsü: <7 dk - Hızlı, verimli ve tekrarlanabilir üretim, 18 sensör ile hassas kontrol, Haftalık ve aylık temizlik için üç erişim noktası, Uzaktan izleme ve kontrol için Wi-Fi ve internet bağlantısı, Gelişmiş konveksiyon sistemi, Kompakt tasarım: 410 mm - Küçük alanlar için ideal çözüm",
      description: "ROEST P3000 kahve kavurma makinesi, tutarlı ve tekrarlanabilir kavurmalar için hassas sensör kontrolü ve Wi-Fi bağlantısına sahiptir.",
    }
  },
  'roest-l200-plus': {
    en: {
      name: "ROEST L200 Plus",
      origin: "ROEST Coffee Roaster",
      tastingNotes: "Dual Heating Elements: utilizes both infrared and convective heating for optimal roasting performance, 7\" Touchscreen Display: provides intuitive control and easy recipe management, Software Compatibility: seamless integration with Cropster and other roasting software for smooth data transfer, Customizable Roasting Profiles: real-time data visualization and logging for fully adjustable profiles, Sample Size: supports roasting batches from 50g to 200g, Roasting Capacity: up to 1.6 kg per hour, suitable for sample labs and quality control operations",
      description: "ROEST L200 Plus coffee roaster with precise sensor control and Wi-Fi connectivity for consistent, repeatable roasts.",
    },
    tr: {
      name: "ROEST L200 Plus",
      origin: "ROEST Kahve Kavurma Makinesi",
      tastingNotes: "Çift Isıtıcı: kızılötesi ve konvektif ısıtmayı bir arada kullanarak üstün ve dengeli kavurma performansı, 7'' Dokunmatik Ekran: sezgisel kontrol ve kolay tarif yönetimi sunar, Yazılım Uyumluluğu: Cropster ve diğer kavurma yazılımları ile sorunsuz veri entegrasyonu sağlar, Özelleştirilebilir Kavurma Profilleri: gerçek zamanlı veri görselleştirme ve kayıt ile tamamen ayarlanabilir profiller oluşturur, Numune Boyutu: 50 g – 200 g arası kavurma yapmaya uygundur, Saatlik Kapasite: saatte 1.6 kg kavurma kapasitesi ile numune laboratuvarları ve kalite kontrol birimleri için idealdir",
      description: "ROEST L200 Plus kahve kavurma makinesi, tutarlı ve tekrarlanabilir kavurmalar için hassas sensör kontrolü ve Wi-Fi bağlantısına sahiptir.",
    }
  },
  'roest-l200-ultra': {
    en: {
      name: "ROEST L200 Ultra",
      origin: "ROEST Coffee Roaster",
      tastingNotes: "Dual Heating Elements: utilizes both infrared and convective heating for optimal roasting performance, 7\" Touchscreen Display: provides intuitive control and easy recipe management, Software Compatibility: seamless integration with Cropster and other roasting software for smooth data transfer, Customizable Roasting Profiles: real-time data visualization and logging for fully adjustable profiles, Sample Size: supports roasting batches from 50g to 200g, Roasting Capacity: up to 3 kg per hour, suitable for sample labs and quality control operations",
      description: "ROEST L200 Ultra coffee roaster with precise sensor control and Wi-Fi connectivity for consistent, repeatable roasts.",
    },
    tr: {
      name: "ROEST L200 Ultra",
      origin: "ROEST Kahve Kavurma Makinesi",
      tastingNotes: "Çift Isıtıcı: kızılötesi ve konvektif ısıtmayı bir arada kullanarak üstün ve dengeli kavurma performansı, 7'' Dokunmatik Ekran: sezgisel kontrol ve kolay tarif yönetimi sunar, Yazılım Uyumluluğu: Cropster ve diğer kavurma yazılımları ile sorunsuz veri entegrasyonu sağlar, Özelleştirilebilir Kavurma Profilleri: gerçek zamanlı veri görselleştirme ve kayıt ile tamamen ayarlanabilir profiller oluşturur, Numune Boyutu: 50 g – 200 g arası kavurma yapmaya uygundur, Saatlik Kapasite: saatte 3 kg kavurma kapasitesi ile numune laboratuvarları ve kalite kontrol birimleri için idealdir",
      description: "ROEST L200 Ultra kahve kavurma makinesi, tutarlı ve tekrarlanabilir kavurmalar için hassas sensör kontrolü ve Wi-Fi bağlantısına sahiptir.",
    }
  },
  'difluid-airwave': {
    en: {
      name: "DiFluid AirWave (Roast Smoke Eliminator)",
      origin: "DiFluid Coffee Measurement Device",
      tastingNotes: "Roast smoke eliminator, A catalytic air purification system designed to eliminate harmful pollutants generated during coffee roasting, Advanced Catalytic Purification – NovaCat catalyst technology efficiently eliminates harmful pollutants from roast smoke with low energy consumption, Low-Temperature Efficiency (≥200°C) – delivers powerful purification performance without the need for high operating temperatures, Self-Cleaning & Low Maintenance – engineered catalyst material cleans itself, eliminating frequent filter changes, Compact & Flexible Design – ideal for small roasting spaces, suitable for sample roasting and production environments, Airflow & Capacity: 130 m³/h airflow | 1 kg (220V), Easy Installation – eliminates the need for long and complex ventilation systems",
      description: "DiFluid AirWave (Roast Smoke Eliminator) precision coffee measurement device for quality control in roasting and brewing.",
    },
    tr: {
      name: "DiFluid AirWave (Roast Smoke Eliminator)",
      origin: "DiFluid Kahve Ölçüm Cihazı",
      tastingNotes: "Kavurma Dumanı Arıtma Cihazı, Kahve kavurma sırasında oluşan zararlı duman bileşenlerini ortadan kaldırmak için tasarlanmış katalitik hava arıtma çözümü, Gelişmiş Katalitik Arıtma – NovaCat katalizör teknolojisi ile kavurma dumanındaki zararlı bileşenleri düşük enerji tüketimiyle ortadan kaldırır, Düşük Sıcaklıkta Etkinlik (≥200°C) – Yüksek sıcaklığa ihtiyaç duymadan güçlü arıtma performansı sağlar, Kendini Temizleyen & Düşük Bakım – Özel tasarlanmış katalizör materyali kendini temizler, sık filtre değişimi gerektirmez, Kompakt ve Esnek Tasarım – Küçük kavurma alanları için ideal olup numune ve üretim kavurmaları için uygundur, Hava Akışı & Kapasite – 130 m³/h hava akışı | 1 kg (220V), Kolay Kurulum – Uzun ve karmaşık havalandırma sistemlerine ihtiyaç duymaz",
      description: "DiFluid AirWave (Roast Smoke Eliminator), kavurma ve demleme sürecinde kalite kontrolü için hassas kahve ölçüm cihazıdır.",
    }
  },
  'difluid-omix-plus': {
    en: {
      name: "DiFluid Omix Plus",
      origin: "DiFluid Coffee Measurement Device",
      tastingNotes: "Coffee Moisture, Water Activity, Density, Structure, and Color Meter, Quickly measure water activity, moisture, density, screen size, expansion rate, roast level, temperature, humidity and altitude, Auto-detection of dried fruits, parchment coffee, green beans, roasted beans, ground coffee and other samples, True density calculation using optical algorithm technology, Quick and easy self-calibration, Data visualization and export in DiFluid Café, OTA firmware upgrades",
      description: "DiFluid Omix Plus precision coffee measurement device for quality control in roasting and brewing.",
    },
    tr: {
      name: "DiFluid Omix Plus",
      origin: "DiFluid Kahve Ölçüm Cihazı",
      tastingNotes: "Kahve Nem, Su Aktivitesi, Yoğunluk, Yapı ve Renk Ölçüm Cihazı, Hızlı bir şekilde su aktivitesi, nem, yoğunluk, elek boyutu, genişleme oranı, kavurma seviyesi, sıcaklık, nem ve rakımı ölçün, Kurutulmuş meyveler, parşömen kahvesi, yeşil çekirdekler, kavrulmuş çekirdekler, öğütülmüş kahve ve diğer örneklerin otomatik algılanması, Optik algoritma teknolojisi kullanarak gerçek yoğunluk hesaplaması, Hızlı ve kolay kendi kendine kalibrasyon, DiFluid Café'de veri görselleştirme ve dışa aktarma, OTA Yazılım Güncellemeleri",
      description: "DiFluid Omix Plus, kavurma ve demleme sürecinde kalite kontrolü için hassas kahve ölçüm cihazıdır.",
    }
  },
  'difluid-r2': {
    en: {
      name: "DiFluid R2",
      origin: "DiFluid Coffee Measurement Device",
      tastingNotes: "Incredible Precision - our most precise refractometer yet, at ±0.02%, Color Display - capable of displaying more data for more testing options, Aluminum Sample Dish - 675% better temperature conductivity for an incredibly stable measurement, IP67 Water Resistant - test, rinse, repeat, just that easy, Microcalibration - advanced temperature compensation via special Microcalibration layer",
      description: "DiFluid R2 precision coffee measurement device for quality control in roasting and brewing.",
    },
    tr: {
      name: "DiFluid R2",
      origin: "DiFluid Kahve Ölçüm Cihazı",
      tastingNotes: "İnanılmaz Hassasiyet - ±%0,02 bugüne kadarki en hassas refraktometre, Renkli Ekranda Daha fazla test seçeneği için daha fazla veri görüntüleyebiliyor, Alüminyum Numune Kabı - inanılmaz derecede kararlı bir ölçüm için %675 daha iyi sıcaklık iletkenliği, IP67 Suya Dayanıklı - Test edin, durulayın, tekrarlayın, Mikro kalibrasyon - Özel Mikro kalibrasyon katmanı aracılığıyla gelişmiş sıcaklık telafisi",
      description: "DiFluid R2, kavurma ve demleme sürecinde kalite kontrolü için hassas kahve ölçüm cihazıdır.",
    }
  },
  'difluid-omni': {
    en: {
      name: "DiFluid Omni",
      origin: "DiFluid Coffee Measurement Device",
      tastingNotes: "Professional Roast / Particle Analyzer (2-in-1), 2D near-infrared imaging, Multi-band data fusion, Instant use without preheating, Multiple data display modes, 2.8-inch high-definition touchscreen, Support data with APP, Supports SDK and OTA",
      description: "DiFluid Omni precision coffee measurement device for quality control in roasting and brewing.",
    },
    tr: {
      name: "DiFluid Omni",
      origin: "DiFluid Kahve Ölçüm Cihazı",
      tastingNotes: "Profesyonel kavurma / Parçacık Analizörü (2'si 1 arada), 2D yakın kızılötesi görüntüleme, Çok bantlı veri füzyonu, Ön ısıtma olmadan anında kullanım, Çoklu veri görüntüleme modları, 2,8 inç yüksek çözünürlüklü dokunmatik ekran, Uygulama destekli, SDK ve OTA'yı destekler",
      description: "DiFluid Omni, kavurma ve demleme sürecinde kalite kontrolü için hassas kahve ölçüm cihazıdır.",
    }
  },
  'difluid-microbalance-ti': {
    en: {
      name: "DiFluid Microbalance Ti",
      origin: "DiFluid Coffee Measurement Device",
      tastingNotes: "Stable Precision - 0.1 gram resolution with super stable precision because every last bean counts, Auto-Detect Timing - you start pouring, it starts timing, no more forgetting to start the timer, Flow Rate Display - stable flow rate display to help maintain even extraction with every brew, DiFluid Café Connect - graph your data in real time with the companion app, OTA Updates - microbalance's advanced algorithms are constantly upgraded and can be installed via DiFluid Café",
      description: "DiFluid Microbalance Ti precision coffee measurement device for quality control in roasting and brewing.",
    },
    tr: {
      name: "DiFluid Microbalance Ti",
      origin: "DiFluid Kahve Ölçüm Cihazı",
      tastingNotes: "İstikrarlı Hassasiyet - Her son çekirdek sayıldığı için süper hassasiyetle 0,1 gram çözünürlük, Zamanlamayı Otomatik Algıla - Dökmeye başlarsınız, zamanlamaya başlar, artık zamanlayıcıyı başlatmayı unutmazsınız, Akış Hızı Göstergesi - Her demlemede eşit ekstraksiyonu korumasına yardımcı olmak için kararlı akış hızı göstergesi, DiFluid Café Connect - Eşlik eden uygulama ile verilerinizi gerçek zamanlı olarak grafiklendirin, OTA Güncellemeleri - Microbalance'ın gelişmiş algoritmaları sürekli olarak yükseltiliyor ve DiFluid Café üzerinden kurulabiliyor",
      description: "DiFluid Microbalance Ti, kavurma ve demleme sürecinde kalite kontrolü için hassas kahve ölçüm cihazıdır.",
    }
  },
  'felicita-venus': {
    en: {
      name: "Felicita Venus (Coffee Scale)",
      origin: "Felicita Barista Scale",
      tastingNotes: "2000 gr capacity in 0.1 gr increments, Auto-tare, auto-timer modes, Bluetooth connectivity with Felicita Coffee App, Lithium-ion USB rechargeable, Customizable smart auto-off",
      description: "Felicita Venus (Coffee Scale) precision barista tool with Bluetooth connectivity to the Felicita Coffee app.",
    },
    tr: {
      name: "Felicita Venus (Coffee Scale)",
      origin: "Felicita Barista Tartısı",
      tastingNotes: "0,1 gr artışlarla 2000 gr kapasite, Otomatik dara, otomatik timer modları, Felicita coffee aplikasyonu ile Bluetooth bağlantısı, Lityum-iyon USB şarj edilebilir, Özelleştirilebilir akıllı otomatik kapanma",
      description: "Felicita Venus (Coffee Scale), Felicita Coffee uygulamasına Bluetooth bağlantılı hassas barista aracıdır.",
    }
  },
  'felicita-parallel-plus': {
    en: {
      name: "Felicita Parallel Plus (Drip Scale)",
      origin: "Felicita Barista Scale",
      tastingNotes: "2000 gr capacity in 0.1 gr increments, Auto-tare, auto-timer modes, Bluetooth connectivity with Felicita Coffee App, Lithium-ion USB rechargeable, Customizable smart auto-off",
      description: "Felicita Parallel Plus (Drip Scale) precision barista tool with Bluetooth connectivity to the Felicita Coffee app.",
    },
    tr: {
      name: "Felicita Parallel Plus (Drip Scale)",
      origin: "Felicita Barista Tartısı",
      tastingNotes: "0,1 gr artışlarla 2000 gr kapasite, Otomatik dara, otomatik timer modları, Felicita coffee aplikasyonu ile Bluetooth bağlantısı, Lityum-iyon USB şarj edilebilir, Özelleştirilebilir akıllı otomatik kapanma",
      description: "Felicita Parallel Plus (Drip Scale), Felicita Coffee uygulamasına Bluetooth bağlantılı hassas barista aracıdır.",
    }
  },
  'felicita-arc': {
    en: {
      name: "Felicita Arc (Espresso Scale)",
      origin: "Felicita Barista Scale",
      tastingNotes: "2000 gr capacity in 0.1 gr increments, Auto-tare, auto-timer modes, Bluetooth connectivity with Felicita Coffee App, Lithium-ion USB rechargeable, Customizable smart auto-off",
      description: "Felicita Arc (Espresso Scale) precision barista tool with Bluetooth connectivity to the Felicita Coffee app.",
    },
    tr: {
      name: "Felicita Arc (Espresso Scale)",
      origin: "Felicita Barista Tartısı",
      tastingNotes: "0,1 gr artışlarla 2000 gr kapasite, Otomatik dara, otomatik timer modları, Felicita coffee aplikasyonu ile Bluetooth bağlantısı, Lityum-iyon USB şarj edilebilir, Özelleştirilebilir akıllı otomatik kapanma",
      description: "Felicita Arc (Espresso Scale), Felicita Coffee uygulamasına Bluetooth bağlantılı hassas barista aracıdır.",
    }
  },
  'felicita-square': {
    en: {
      name: "Felicita Square (Electronic Kettle)",
      origin: "Felicita Barista Scale",
      tastingNotes: "High grade stainless steel builds, Multi-function control button, Temperature holding in either °F or °C, Capacity: 600 ml",
      description: "Felicita Square (Electronic Kettle) precision barista tool with Bluetooth connectivity to the Felicita Coffee app.",
    },
    tr: {
      name: "Felicita Square (Electronic Kettle)",
      origin: "Felicita Barista Tartısı",
      tastingNotes: "Yüksek kalite paslanmaz çelik, Çok işlevli kontrol düğmesi, °F veya °C cinsinden derece ayarı, Kapasite: 600 ml",
      description: "Felicita Square (Electronic Kettle), Felicita Coffee uygulamasına Bluetooth bağlantılı hassas barista aracıdır.",
    }
  },
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
    process: trans?.process || '',
    body: trans?.body || '',
    acidity: trans?.acidity || '',
  };
}
