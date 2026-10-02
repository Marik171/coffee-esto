'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import styles from './admin.module.css';
import {
  BrandLogoIcon,
  OverviewIcon,
  CoffeeBeanIcon,
  GearIcon,
  OrdersIcon,
  UsersIcon,
  CouponIcon,
  StarIcon,
  JournalIcon,
  ShippingIcon,
  TagIcon,
  SearchIcon,
  PlusIcon,
  RefreshIcon,
  GridViewIcon,
  TableViewIcon,
  EditPencilIcon,
  TrashIcon,
  ExternalLinkIcon,
  LogoutIcon,
  UploadCloudIcon,
  ImageIcon,
  SparklesIcon,
  SlidersIcon,
  EyeIcon,
  LayersIcon,
  PrinterIcon,
  FlameRoastIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  CloseIcon,
  PinLocationIcon,
  WalletMoneyIcon,
  MailIcon,
  SendIcon,
  PaletteIcon,
  RoasterFireIcon,
  ScaleWeightIcon,
  BarcodeIcon,
  ChecklistIcon,
  DesktopIcon,
  SmartphoneIcon,
  CopyIcon,
} from '@/components/admin/AdminIcons';

/* ── Default Email Templates ─────────────────────────────────── */
const DEFAULT_EMAIL_TEMPLATES: Record<string, any> = {
  order_confirmation: {
    id: 'order_confirmation',
    nameTr: 'Sipariş Onayı & Kavrum Kuyruğu',
    nameEn: 'Order Confirmation & Roast Queued',
    name: 'Order Confirmation & Roast Queued',
    badgeTr: 'KAVURMAHANE SİPARİŞ ONAYI',
    badgeEn: 'ROASTERY ORDER CONFIRMATION',
    badge: 'ROASTERY ORDER CONFIRMATION',
    subjectTr: 'Partiniz Kavrum İçin Sıraya Alındı ☕ [Sipariş #{{order_id}}]',
    subjectEn: 'Batch Scheduled for Roast ☕ [Order #{{order_id}}]',
    subject: 'Batch Scheduled for Roast ☕ [Order #{{order_id}}]',
    preheaderTr: 'Nitelikli kahveniz İstanbul atölyemizde taze kavrum için sıraya alındı.',
    preheaderEn: 'Your specialty coffee has been queued for small-batch roasting in İstanbul.',
    preheader: 'Your specialty coffee has been queued for small-batch roasting in İstanbul.',
    heroImage: '/images/hero_roast_order.png',
    headlineTr: 'Çekirdekleriniz Kavurma İçin Sıraya Alındı',
    headlineEn: 'Your Beans Are Scheduled For Roasting',
    headline: 'Your Beans Are Scheduled For Roasting',
    subtitleTr: 'Mikro Parti Nitelikli Kavrum #{{order_id}}',
    subtitleEn: 'Micro-Batch Specialty Roast Lot #{{order_id}}',
    subtitle: 'Micro-Batch Specialty Roast Lot #{{order_id}}',
    bodyTr: 'Coffee Esto’yu tercih ettiğiniz için teşekkür ederiz, {{customer_name}}. Baş kavurucumuz, siparişinizdeki single-origin çekirdekleri tamburlu kavurma için sıraya aldı. Çiçeksi ve meyvemsi aromaları korumak adına her paket, tek yönlü gaz tahliye valfli kilitli ambalajında mühürlenir.',
    bodyEn: 'Thank you for choosing Coffee Esto, {{customer_name}}. Our roastmaster has queued your single-origin lots for precision drum roasting. Every pouch is heat-sealed immediately with a one-way degassing valve to protect volatile floral aromatics and fruit sweetness.',
    body: 'Thank you for choosing Coffee Esto, {{customer_name}}. Our roastmaster has queued your single-origin lots for precision drum roasting. Every pouch is heat-sealed immediately with a one-way degassing valve to protect volatile floral aromatics and fruit sweetness.',
    roastmasterNoteTr: 'Kavurucu Notu: V60 veya Chemex filtre demlemelerinde en berrak tat profili için çekirdeklerinizi kavrum tarihinden itibaren 7 gün dinlendirmenizi öneririz.',
    roastmasterNoteEn: 'Roaster’s Tip: For pour-over brewing (V60/Chemex), allow beans to rest 7 days post-roast for optimal extraction and clarity.',
    roastmasterNote: 'Roaster’s Tip: For pour-over brewing (V60/Chemex), allow beans to rest 7 days post-roast for optimal extraction and clarity.',
    buttonTextTr: 'Kavrum ve Sipariş Durumunu Takip Et',
    buttonTextEn: 'Track Roast & Order Status',
    buttonText: 'Track Roast & Order Status',
    buttonUrl: '{{tracking_url}}',
    secondaryButtonTextTr: 'Demleme Rehberlerini İncele',
    secondaryButtonTextEn: 'Browse Brew Guides',
    secondaryButtonText: 'Browse Brew Guides',
    secondaryButtonUrl: 'https://coffeeesto.com/blog',
    footerNoteTr: 'Coffee Esto Roastery • Karaköy, İstanbul • Doğrudan Ticaret Nitelikli Çekirdekler',
    footerNoteEn: 'Coffee Esto Roastery • Karaköy, İstanbul • Direct Trade Single Origins',
    footerNote: 'Coffee Esto Roastery • Karaköy, İstanbul • Direct Trade Single Origins',
    enabled: true,
  },
  order_shipped: {
    id: 'order_shipped',
    nameTr: 'Sipariş Kargoya Verildi & Takip',
    nameEn: 'Order Dispatched & Courier Tracking',
    name: 'Order Dispatched & Courier Tracking',
    badgeTr: 'SEVKİYAT VE KARGO BİLDİRİMİ',
    badgeEn: 'DISPATCH & COURIER NOTICE',
    badge: 'DISPATCH & COURIER NOTICE',
    subjectTr: 'Taze Kavruldu ve Yola Çıktı! 📦 [Sipariş #{{order_id}}]',
    subjectEn: 'Freshly Roasted & On Its Way! 📦 [Order #{{order_id}}]',
    subject: 'Freshly Roasted & On Its Way! 📦 [Order #{{order_id}}]',
    preheaderTr: 'Kahveniz {{carrier_name}} ile yola çıktı. Takip No: {{tracking_number}}',
    preheaderEn: 'Your coffee is on the road with {{carrier_name}}. Tracking: {{tracking_number}}',
    preheader: 'Your coffee is on the road with {{carrier_name}}. Tracking: {{tracking_number}}',
    heroImage: '/images/brand-carrier.webp',
    headlineTr: 'Taze Kavrum Kahveniz Atölyeden Çıktı',
    headlineEn: 'Your Fresh Roast Has Departed The Atelier',
    headline: 'Your Fresh Roast Has Departed The Atelier',
    subtitleTr: 'Kargo Takip No: {{tracking_number}} ({{carrier_name}})',
    subtitleEn: 'Courier Reference: {{tracking_number}} ({{carrier_name}})',
    subtitle: 'Courier Reference: {{tracking_number}} ({{carrier_name}})',
    bodyTr: 'Harika haber {{customer_name}}! Yeni mühürlenmiş taze kahve paketleriniz İstanbul kavurmahanemizden yola çıktı. {{carrier_name}} güvencesiyle kapınıza doğru ulaşıyor.',
    bodyEn: 'Great news, {{customer_name}}! Your freshly sealed coffee pouches have departed our Istanbul roastery. They are currently in transit with {{carrier_name}} and heading directly to your doorstep.',
    body: 'Great news, {{customer_name}}! Your freshly sealed coffee pouches have departed our Istanbul roastery. They are currently in transit with {{carrier_name}} and heading directly to your doorstep.',
    roastmasterNoteTr: 'Gaz Salınım Bildirimi: Çekirdekleriniz {{roast_date}} tarihinde kavruldu. Paketiniz ulaştığında en lezzetli içim penceresine giriş yapacaktır.',
    roastmasterNoteEn: 'Degassing Alert: Your beans were roasted on {{roast_date}}. They will enter their peak flavor window right as your package arrives.',
    roastmasterNote: 'Degassing Alert: Your beans were roasted on {{roast_date}}. They will enter their peak flavor window right as your package arrives.',
    buttonTextTr: 'Kargo Teslimatını Takip Et',
    buttonTextEn: 'Track Courier Delivery',
    buttonText: 'Track Courier Delivery',
    buttonUrl: '{{tracking_url}}',
    secondaryButtonTextTr: 'Barista Demleme Reçeteleri',
    secondaryButtonTextEn: 'View Barista Brew Recipes',
    secondaryButtonText: 'View Barista Brew Recipes',
    secondaryButtonUrl: 'https://coffeeesto.com/blog',
    footerNoteTr: 'Öğütüm boyutu veya demleme hakkında sorularınız mı var? Bu e-postayı yanıtlayabilirsiniz.',
    footerNoteEn: 'Questions about your grind size or extraction? Reply directly to this email.',
    footerNote: 'Questions about your grind size or extraction? Reply directly to this email.',
    enabled: true,
  },
  review_request: {
    id: 'review_request',
    nameTr: '7. Gün Tadım Deneyimi & Yorum',
    nameEn: '7-Day Post-Delivery Review Request',
    name: '7-Day Post-Delivery Review Request',
    badgeTr: 'TADIM VE DEGÜSTASYON DEĞERLENDİRMESİ',
    badgeEn: 'CUPPING & TASTING REVIEW',
    badge: 'CUPPING & TASTING REVIEW',
    subjectTr: 'Kahvenizin tadı nasıl gidiyor, {{customer_name}}? ☕ Notlarınızı paylaşın',
    subjectEn: 'How is your cup tasting, {{customer_name}}? ☕ Share your notes',
    subject: 'How is your cup tasting, {{customer_name}}? ☕ Share your notes',
    preheaderTr: 'Geri bildiriminiz kavurucularımızın her hasat partisini kalibre etmesini sağlar. 1 tıkla puanlayın.',
    preheaderEn: 'Your feedback helps our roasters calibrate each harvest lot. Review in 1 click.',
    preheader: 'Your feedback helps our roasters calibrate each harvest lot. Review in 1 click.',
    heroImage: '/images/barista-chemex.webp',
    headlineTr: 'Kahvenizin Demleme Performansı Nasıl Oldu?',
    headlineEn: 'How Did Your Roast Brew?',
    headline: 'How Did Your Roast Brew?',
    subtitleTr: 'Kavurmahane Ekibimiz İçin Doğrudan Geri Bildirim',
    subtitleEn: 'Direct Feedback For Our Roastery Team',
    subtitle: 'Direct Feedback For Our Roastery Team',
    bodyTr: 'Merhaba {{customer_name}}, {{last_product_name}} kahveniz artık ideal gaz salınım süresini tamamladı. Fincanınızdaki yasemin, narenciye veya çikolata notaları nasıl çıktı? Tadım deneyiminizi topluluğumuzla paylaşarak diğer kahveseverlere rehberlik edin.',
    bodyEn: 'Hi {{customer_name}}, your {{last_product_name}} has now rested to its optimal degassing window. Did the jasmine, bergamot, or cocoa notes shine through in your cup? Share your tasting review with our roastery atelier to help other coffee lovers discover exceptional brews.',
    body: 'Hi {{customer_name}}, your {{last_product_name}} has now rested to its optimal degassing window. Did the jasmine, bergamot, or cocoa notes shine through in your cup? Share your tasting review with our roastery atelier to help other coffee lovers discover exceptional brews.',
    roastmasterNoteTr: 'Tadım İpucu: Ekstraksiyon hafif keskin veya acı hissedilirse, öğütümünüzü 1 kademe kalınlaştırın veya su sıcaklığını 92°C’ye düşürün.',
    roastmasterNoteEn: 'Cupping Tip: If extraction tastes slightly sharp, coarsen your grind 1 notch or drop brew water temperature to 92°C.',
    roastmasterNote: 'Cupping Tip: If extraction tastes slightly sharp, coarsen your grind 1 notch or drop brew water temperature to 92°C.',
    buttonTextTr: '1 Tıkla Değerlendir & Yorum Yaz',
    buttonTextEn: 'Leave a 1-Click Review',
    buttonText: 'Leave a 1-Click Review',
    buttonUrl: 'https://coffeeesto.com/coffee',
    secondaryButtonTextTr: 'Demleme Rehberlerini Keşfet',
    secondaryButtonTextEn: 'Explore Brew Guides',
    secondaryButtonText: 'Explore Brew Guides',
    secondaryButtonUrl: 'https://coffeeesto.com/blog',
    footerNoteTr: 'İstanbul’da siparişe özel küçük partilerle kavruldu • Coffee Esto Roastery',
    footerNoteEn: 'Roasted to order in small batches in İstanbul • Coffee Esto Roastery',
    footerNote: 'Roasted to order in small batches in İstanbul • Coffee Esto Roastery',
    enabled: true,
  },
  refill_reminder: {
    id: 'refill_reminder',
    nameTr: '21. Gün Tazelik & Yenileme Uyarısı',
    nameEn: '21-Day Peak Flavor Refill Alert',
    name: '21-Day Peak Flavor Refill Alert',
    badgeTr: '21 GÜNLÜK TAZELİK PENCERESİ',
    badgeEn: '21-DAY FRESHNESS ALERT',
    badge: '21-DAY FRESHNESS ALERT',
    subjectTr: 'Taze bir kavrum zamanı mı? ☕ Sonraki paketinizde %10 indirim',
    subjectEn: 'Time for a fresh roast? ☕ Enjoy 10% off your next batch',
    subject: 'Time for a fresh roast? ☕ Enjoy 10% off your next batch',
    preheaderTr: 'Son siparişinizden bu yana 3 hafta geçti. Sabah fincanınızı zirve aromalarda tutun.',
    preheaderEn: 'It has been 3 weeks since your last order. Keep your morning cup at peak aromatics.',
    preheader: 'It has been 3 weeks since your last order. Keep your morning cup at peak aromatics.',
    heroImage: '/images/brand-beans.webp',
    headlineTr: 'Sabah Fincanınızı Zirve Aromalarda Tutun',
    headlineEn: 'Keep Your Morning Cup At Peak Aromatics',
    headline: 'Keep Your Morning Cup At Peak Aromatics',
    subtitleTr: 'Nitelikli Kavrumlar 7–28. Günler Arasında En Canlıdır',
    subtitleEn: 'Specialty Roasts Are Most Vibrant In Days 7–28',
    subtitle: 'Specialty Roasts Are Most Vibrant In Days 7–28',
    bodyTr: 'Merhaba {{customer_name}}, {{last_product_name}} kahvenizi sipariş etmenizin üzerinden yaklaşık 21 gün geçti. Çekirdekler 4 haftayı aştıkça narin yasemin, şeftali ve narenciye yağları kademeli olarak azalır. Taze hasat kahvelerimizi yeniden sipariş edin, VIP indiriminin tadını çıkarın.',
    bodyEn: 'Hi {{customer_name}}, it has been roughly 21 days since your last batch of {{last_product_name}}. As whole bean coffee ages beyond 4 weeks, delicate jasmine, peach, and citrus notes gradually dissipate. Reorder fresh lots today and enjoy a VIP replenishment discount.',
    body: 'Hi {{customer_name}}, it has been roughly 21 days since your last batch of {{last_product_name}}. As whole bean coffee ages beyond 4 weeks, delicate jasmine, peach, and citrus notes gradually dissipate. Reorder fresh lots today and enjoy a VIP replenishment discount.',
    roastmasterNoteTr: 'VIP Avantajı: Tüm single origin ve espresso harmanlarında %10 özel indirim için ödeme adımında REFILL10 kodunu kullanın.',
    roastmasterNoteEn: 'VIP Perk: Use secret code REFILL10 at checkout for an exclusive 10% discount on all single origins and espresso blends.',
    roastmasterNote: 'VIP Perk: Use secret code REFILL10 at checkout for an exclusive 10% discount on all single origins and espresso blends.',
    buttonTextTr: 'Taze Kavrum Siparişi Ver (%10 İndirim)',
    buttonTextEn: 'Order Fresh Roasts (10% Off)',
    buttonText: 'Order Fresh Roasts (10% Off)',
    buttonUrl: 'https://coffeeesto.com/coffee?coupon=REFILL10',
    secondaryButtonTextTr: 'Yeni Hasatları Keşfet',
    secondaryButtonTextEn: 'Explore New Harvests',
    secondaryButtonText: 'Explore New Harvests',
    secondaryButtonUrl: 'https://coffeeesto.com/coffee',
    footerNoteTr: 'İstanbul’da siparişe özel kavrulan doğrudan ticaret mikro lotlar.',
    footerNoteEn: 'Ethically sourced microlots roasted to order in Istanbul.',
    footerNote: 'Ethically sourced microlots roasted to order in Istanbul.',
    enabled: true,
  },
  abandoned_cart: {
    id: 'abandoned_cart',
    nameTr: 'Sepet Hatırlatma & 24 Saatlik Rezerv',
    nameEn: 'Abandoned Cart & Reserve Hold',
    name: 'Abandoned Cart & Reserve Hold',
    badgeTr: 'REZERVE KAHVE PARTİSİ • 24 SAAT',
    badgeEn: 'RESERVED COFFEE BATCH • 24H HOLD',
    badge: 'RESERVED COFFEE BATCH • 24H HOLD',
    subjectTr: 'Çekirdeklerinizi haznede mi unuttunuz, {{customer_name}}? ☕',
    subjectEn: 'Did you leave your beans in the hopper, {{customer_name}}?',
    subject: 'Did you leave your beans in the hopper, {{customer_name}}?',
    preheaderTr: 'Seçtiğiniz nitelikli kahveler rezervde tutuluyor. Siparişinizi tamamlayın.',
    preheaderEn: 'Your specialty coffee selection is held in reserve. Complete your order today.',
    preheader: 'Your specialty coffee selection is held in reserve. Complete your order today.',
    heroImage: '/images/coffee_grouped.png',
    headlineTr: 'Özel Çekirdekleriniz Haznede Sizi Bekliyor',
    headlineEn: 'Your Artisan Coffee Is Waiting In The Hopper',
    headline: 'Your Artisan Coffee Is Waiting In The Hopper',
    subtitleTr: 'Sınırlı Mevsimsel Mikro Lotlar Hızla Tükeniyor',
    subtitleEn: 'Limited Seasonal Micro-Lots Sell Out Rapidly',
    subtitle: 'Limited Seasonal Micro-Lots Sell Out Rapidly',
    bodyTr: 'Sepetinizde seçkin kahveler bıraktığınızı fark ettik, {{customer_name}}. Seçtiğiniz paketler için 24 saatlik geçici bir rezerv oluşturduk. Bu hasat partisi tükenmeden sepetinizi tamamlayın.',
    bodyEn: 'We noticed you left some extraordinary coffees in your cart, {{customer_name}}. We have placed a temporary 24-hour reserve on your bag selection. Complete your checkout today to secure your batch before this harvest lot is fully allocated.',
    body: 'We noticed you left some extraordinary coffees in your cart, {{customer_name}}. We have placed a temporary 24-hour reserve on your bag selection. Complete your checkout today to secure your batch before this harvest lot is fully allocated.',
    roastmasterNoteTr: 'Çiğ çekirdeklerimiz Etiyopya, Kolombiya ve Guatemala’daki küçük ölçekli aile çiftlikleriyle doğrudan ticaret yoluyla tedarik edilmektedir.',
    roastmasterNoteEn: 'Our green coffees are sourced through direct-trade relationships with smallholder family farms in Ethiopia, Colombia, and Guatemala.',
    roastmasterNote: 'Our green coffees are sourced through direct-trade relationships with smallholder family farms in Ethiopia, Colombia, and Guatemala.',
    buttonTextTr: 'Rezerve Çekirdeklerini Güvenceye Al',
    buttonTextEn: 'Secure Your Reserved Beans',
    buttonText: 'Secure Your Reserved Beans',
    buttonUrl: 'https://coffeeesto.com/checkout',
    secondaryButtonTextTr: 'Tadım Profillerini İncele',
    secondaryButtonTextEn: 'View Tasting Profiles',
    secondaryButtonText: 'View Tasting Profiles',
    secondaryButtonUrl: 'https://coffeeesto.com/coffee',
    footerNoteTr: 'İstanbul’da siparişe özel kavrulan nitelikli doğrudan ticaret kahveleri.',
    footerNoteEn: 'Direct-trade specialty coffees roasted to order in İstanbul.',
    footerNote: 'Direct-trade specialty coffees roasted to order in İstanbul.',
    enabled: true,
  },
  welcome_series: {
    id: 'welcome_series',
    nameTr: 'Kavurmahaneye Hoş Geldiniz & Karşılama',
    nameEn: 'Welcome to the Atelier & Onboarding',
    name: 'Welcome to the Atelier & Onboarding',
    badgeTr: 'KAVURMAHANE ATÖLYESİNE HOŞ GELDİNİZ',
    badgeEn: 'WELCOME TO THE ROASTERY ATELIER',
    badge: 'WELCOME TO THE ROASTERY ATELIER',
    subjectTr: 'Coffee Esto’ya Hoş Geldiniz ☕ %10 Üye İndiriminiz Hazır',
    subjectEn: 'Welcome to Coffee Esto ☕ Your 10% Member Perk Awaits',
    subject: 'Welcome to Coffee Esto ☕ Your 10% Member Perk Awaits',
    preheaderTr: 'İstanbul’da siparişe özel kavrulan doğrudan ticaret kahveler. WELCOME10 kodunu kullanın.',
    preheaderEn: 'Direct-trade single-origins roasted to order in Istanbul. Enjoy code WELCOME10.',
    preheader: 'Direct-trade single-origins roasted to order in Istanbul. Enjoy code WELCOME10.',
    heroImage: '/images/barista-class.webp',
    headlineTr: 'Siparişe Özel Kavrulan Nitelikli Kahveler',
    headlineEn: 'Exceptional Coffee, Roasted To Order',
    headline: 'Exceptional Coffee, Roasted To Order',
    subtitleTr: 'Doğrudan Ticaret Tek Köken Çekirdekler & İmza Harmanlar',
    subtitleEn: 'Direct Trade Single Origins & Signature Blends',
    subtitle: 'Direct Trade Single Origins & Signature Blends',
    bodyTr: 'Coffee Esto topluluğuna hoş geldiniz, {{customer_name}}. Etiyopya, Kolombiya ve Guatemala’daki partner çiftliklerimizden doğrudan ticaretle çekirdek tedarik ediyoruz. Her kahve İstanbul atölyemizde siparişe özel kavrulur ve tek yönlü valfli ambalajlarda tazece mühürlenir.',
    bodyEn: 'Welcome to the Coffee Esto community, {{customer_name}}. We source transparent single-origin coffees directly from partner farms across Ethiopia, Colombia, and Guatemala. Every bean is small-batch drum roasted in our Istanbul atelier and sealed fresh with one-way degassing valves.',
    body: 'Welcome to the Coffee Esto community, {{customer_name}}. We source transparent single-origin coffees directly from partner farms across Ethiopia, Colombia, and Guatemala. Every bean is small-batch drum roasted in our Istanbul atelier and sealed fresh with one-way degassing valves.',
    roastmasterNoteTr: 'İlk Sipariş Avantajı: İlk kahve siparişinizde %10 indirim kazanmak için ödeme adımında WELCOME10 kodunu kullanın.',
    roastmasterNoteEn: 'First Order Perk: Enjoy 10% off your first coffee order with code WELCOME10 at checkout.',
    roastmasterNote: 'First Order Perk: Enjoy 10% off your first coffee order with code WELCOME10 at checkout.',
    buttonTextTr: 'Taze Hasatları Keşfet (%10 İndirim)',
    buttonTextEn: 'Explore Fresh Harvests (10% Off)',
    buttonText: 'Explore Fresh Harvests (10% Off)',
    buttonUrl: 'https://coffeeesto.com/coffee?coupon=WELCOME10',
    secondaryButtonTextTr: 'Kavurmahane Hikayemizi Oku',
    secondaryButtonTextEn: 'Read Our Roastery Story',
    secondaryButtonText: 'Read Our Roastery Story',
    secondaryButtonUrl: 'https://coffeeesto.com/about',
    footerNoteTr: 'İstanbul’da siparişe özel kavrulan doğrudan ticaret kahveleri.',
    footerNoteEn: 'Direct-trade specialty coffees roasted to order in İstanbul.',
    footerNote: 'Direct-trade specialty coffees roasted to order in İstanbul.',
    enabled: true,
  },
};

/* ── Category Slugs for Separation ───────────────────────────── */
const COFFEE_CATEGORY_SLUGS = ['single-origin', 'espresso', 'filter', 'turkish', 'signature-blend'];

/* ── Asset Library Presets ───────────────────────────────────── */
const COFFEE_PACK_PRESETS = [
  { name: 'Ethiopia Yirgacheffe G1', url: '/images/coffee_packs/ETHIOPIA_YIRGACHEFF.png' },
  { name: 'Colombia Supremo', url: '/images/coffee_packs/COLOMBIA.png' },
  { name: 'Brazil Cerrado', url: '/images/coffee_packs/BRAZIL_CERRADO.png' },
  { name: 'Guatemala Huehuetenango', url: '/images/coffee_packs/GUATEMALA_HUEHUETENANGO.png' },
  { name: 'Kenya Nyeri AA', url: '/images/coffee_packs/KENYA.png' },
  { name: 'Espresso Gold Blend', url: '/images/coffee_packs/ESPRESSO_GOLD.webp' },
  { name: 'Velora Signature Roast', url: '/images/coffee_packs/VELORA_SIGNATURE.png' },
  { name: 'House Roast Blend', url: '/images/coffee_packs/HOUSE_BLEND.webp' },
  { name: 'Italian Dark Roast', url: '/images/coffee_packs/ITALIAN_BLEND.webp' },
  { name: 'Traditional Turkish Roast', url: '/images/coffee_packs/TURK_KAHVESI.webp' },
  { name: 'Ethiopia Sidamo Washed', url: '/images/coffee_packs/ETHIOPIA_SIDAMO.png' },
  { name: 'Brazil Mogiana', url: '/images/coffee_packs/BRAZIL_MOGIANA.png' },
];

const EQUIPMENT_PRESETS = [
  { name: 'Wega Urban Commercial Machine', url: '/images/equipment/wega-urban-evd2.png' },
  { name: 'Sanremo Cafe Racer Naked', url: '/images/equipment/sanremo-cafe-racer-2gr-naked.png' },
  { name: 'Eureka Atom Pro Grinder', url: '/images/equipment/eureka-atom-pro.png' },
  { name: 'Ditting 807 Lab Sweet', url: '/images/equipment/ditting-807-lab-sweet.png' },
  { name: 'Anfim Luna Espresso Grinder', url: '/images/equipment/anfim-luna.png' },
  { name: 'Dalla Corte Studio', url: '/images/equipment/dc-studio-aqua.png' },
  { name: 'Felicita Precision Scale', url: '/images/equipment/felicita-parallel-plus.webp' },
  { name: 'Puqpress Q-Series Tamper', url: '/images/equipment/puq-q.webp' },
  { name: 'Puly Caff Detergent Powder', url: '/images/equipment/puly-0825000.png' },
  { name: 'BWT Premium Filter Cartridge', url: '/images/equipment/bwt-premium-fs28p00a00.webp' },
  { name: 'Wega Polaris Pro Machine', url: '/images/equipment/wega-polaris-pro-evd2.png' },
  { name: 'Roest L200 Sample Roaster', url: '/images/equipment/roest-l200-plus.png' },
];

const POPULAR_TASTING_NOTES = [
  'Jasmine',
  'Bergamot',
  'White Peach',
  'Honey',
  'Dark Chocolate',
  'Caramel',
  'Citrus',
  'Vanilla',
  'Red Berries',
  'Almond',
  'Cacao Nibs',
  'Floral',
];

const ROAST_PRESETS = [
  { nameEn: 'Light', nameTr: 'Açık', value: 20, desc: 'Cinnamon & Bright' },
  { nameEn: 'Med-Light', nameTr: 'Orta-Açık', value: 40, desc: 'Sweet & Fruity' },
  { nameEn: 'Medium', nameTr: 'Orta', value: 60, desc: 'Balanced Caramel' },
  { nameEn: 'Med-Dark', nameTr: 'Orta-Koyu', value: 80, desc: 'Rich Chocolate' },
  { nameEn: 'Dark', nameTr: 'Koyu', value: 95, desc: 'Smoky & Intense' },
];

/* ── Types ────────────────────────────────────────────────────── */
interface OrderItem {
  id: string;
  coffeeId?: string;
  productId?: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  identityNumber: string;
  isWholesale: boolean;
  subtotal: number;
  shippingFee: number;
  couponCode: string;
  discountAmount: number;
  totalAmount: number;
  status: string;
  payment_status: string;
  fulfillment_status: string;
  trackingNumber: string;
  shippingProvider: string;
  items: OrderItem[];
  createdAt: string;
}

interface CoffeeProduct {
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
}

interface Category {
  id: string;
  slug: string;
  label: string;
}

interface CargoProvider {
  id: string;
  name: string;
  fee: number;
  isActive: boolean;
  sortOrder: number;
}

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrderAmount: number;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
}

interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  body: string;
  isHidden: boolean;
  createdAt: string;
}

interface BlogPost {
  id: string;
  slug: string;
  titleEn: string;
  titleTr: string;
  contentEn: string;
  contentTr: string;
  category: string;
  imageUrl: string;
  createdAt: string;
}

/* ── Helpers ───────────────────────────────────────────────────── */
const emptyProduct = (isCoffee = true): Partial<CoffeeProduct> => ({
  id: '',
  name: '',
  category: isCoffee ? 'single-origin' : 'espresso-machines',
  origin: '',
  altitude: '',
  varietal: '',
  roastLevel: 50,
  tastingNotes: '',
  description: '',
  price: 0,
  price1kg: 0,
  stock: 25,
  imageUrl: '',
  videoUrl: '',
  isActive: true,
});

type Lang = 'tr' | 'en';

function fmtStatus(type: 'order' | 'payment' | 'fulfillment', value: string, lang: Lang = 'en'): string {
  const map: Record<Lang, Record<string, Record<string, string>>> = {
    en: {
      order: { pending: 'Pending', completed: 'Completed', canceled: 'Canceled' },
      payment: { awaiting: 'Awaiting Payment', captured: 'Paid', refunded: 'Refunded', canceled: 'Canceled' },
      fulfillment: { not_fulfilled: 'Awaiting Roasting', roasting: 'Roasting in Drum', fulfilled: 'Packed & Ready', shipped: 'Dispatched', canceled: 'Canceled' },
    },
    tr: {
      order: { pending: 'Beklemede', completed: 'Tamamlandı', canceled: 'İptal Edildi' },
      payment: { awaiting: 'Ödeme Bekleniyor', captured: 'Ödendi', refunded: 'İade Edildi', canceled: 'İptal Edildi' },
      fulfillment: { not_fulfilled: 'Kavrulmayı Bekliyor', roasting: 'Kavruluyor', fulfilled: 'Paketlendi', shipped: 'Kargoya Verildi', canceled: 'İptal Edildi' },
    },
  };
  return map[lang]?.[type]?.[value] ?? value.replace(/_/g, ' ');
}

function fmtCurrency(amount: number): string {
  return `₺${Number(amount || 0).toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function fmtDate(dateStr: string): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

// DD.MM.YYYY — the unambiguous date format Turkish accounting/bookkeeping
// expects, as opposed to MM/DD/YYYY which Excel can misparse by locale.
function fmtDateAccounting(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

// Column/sheet labels for the orders Excel export — follows the admin
// dashboard's own language toggle so Turkish-speaking staff/accountants
// get a Turkish workbook without needing a separate settings.
const EXPORT_COLUMNS: Record<Lang, Record<string, string>> = {
  en: {
    orderId: 'Order ID',
    date: 'Date',
    customerName: 'Customer Name',
    email: 'Email',
    phone: 'Phone',
    identityNumber: 'Tax ID / TC Kimlik No',
    orderType: 'Order Type',
    wholesale: 'Wholesale',
    retail: 'Retail',
    address: 'Address',
    subtotal: 'Subtotal',
    couponCode: 'Coupon Code',
    discount: 'Discount',
    shippingFee: 'Shipping Fee',
    totalAmount: 'Total Amount',
    currency: 'Currency',
    paymentStatus: 'Payment Status',
    paymentReference: 'Payment Reference',
    fulfillmentStatus: 'Fulfillment Status',
    shippingProvider: 'Shipping Provider',
    trackingNumber: 'Tracking Number',
    orderStatus: 'Order Status',
    productName: 'Product Name',
    quantity: 'Quantity',
    unitPrice: 'Unit Price',
    lineTotal: 'Line Total',
    sheetOrders: 'Orders',
    sheetOrderItems: 'Order Items',
    fileNamePrefix: 'orders-export',
  },
  tr: {
    orderId: 'Sipariş No',
    date: 'Tarih',
    customerName: 'Müşteri Adı',
    email: 'E-posta',
    phone: 'Telefon',
    identityNumber: 'Vergi No / TC Kimlik No',
    orderType: 'Sipariş Türü',
    wholesale: 'Toptan',
    retail: 'Perakende',
    address: 'Adres',
    subtotal: 'Ara Toplam',
    couponCode: 'Kupon Kodu',
    discount: 'İndirim',
    shippingFee: 'Kargo Ücreti',
    totalAmount: 'Toplam Tutar',
    currency: 'Para Birimi',
    paymentStatus: 'Ödeme Durumu',
    paymentReference: 'Ödeme Referansı',
    fulfillmentStatus: 'Hazırlık Durumu',
    shippingProvider: 'Kargo Firması',
    trackingNumber: 'Takip Numarası',
    orderStatus: 'Sipariş Durumu',
    productName: 'Ürün Adı',
    quantity: 'Adet',
    unitPrice: 'Birim Fiyat',
    lineTotal: 'Satır Toplamı',
    sheetOrders: 'Siparişler',
    sheetOrderItems: 'Sipariş Kalemleri',
    fileNamePrefix: 'siparis-raporu',
  },
};

/* ── Translations ─────────────────────────────────────────────── */
const ADMIN_STRINGS: Record<Lang, Record<string, string>> = {
  en: {
    uploadFailed: 'Upload failed',
    unknownError: 'Unknown error',
    brandName: 'ESTO ROASTERY',
    brandTag: 'Specialty Roastery Admin',
    navSectionMain: 'Store Catalog',
    navSectionSales: 'Orders & CRM',
    navSectionMarketing: 'Growth & Content',
    navSectionSettings: 'Logistics & Settings',
    navOverview: 'Overview',
    navCoffee: 'Coffee Beans & Roasts',
    navEquipment: 'Machinery & Gear',
    navOrders: 'Orders Queue',
    navCustomers: 'Customers & CRM',
    navEmail: 'Email & Automations',
    navStorefrontSettings: 'Storefront & Banners',
    navBlog: 'Journal & Stories',
    navShipping: 'Logistics & Cargo',
    navCoupons: 'Discount Coupons',
    navReviews: 'Ratings & Reviews',
    navStorefront: 'View Live Storefront',
    manageCategories: 'Manage Categories',
    signOut: 'Sign Out',
    refresh: 'Refresh',
    storeLive: 'Roastery Online',

    // Email Studio
    emailStudioTitle: 'Email Studio & Deliverability Automations',
    emailStudioSubtitle: 'Design responsive transactional templates, configure SMTP delivery credentials, and test inbox formatting.',
    smtpSettings: 'SMTP & Delivery Config',
    smtpHost: 'SMTP Host',
    smtpPort: 'SMTP Port',
    smtpUser: 'SMTP Username',
    smtpPass: 'SMTP Password',
    fromEmail: 'Sender Address',
    fromName: 'Sender Display Name',
    resendApiKey: 'Resend API Key (Optional)',
    testEmailRecipient: 'Test Recipient Email',
    sendTestEmail: 'Send Test Email',
    saveEmailSettings: 'Save Configuration',
    subjectLine: 'Email Subject Line',
    headlineText: 'Hero Headline',
    bodyMessage: 'Email Body Text',
    buttonLabel: 'CTA Button Text',
    buttonDestination: 'CTA Destination URL',
    footerMessage: 'Footer Fine Print',
    insertTag: 'Insert Dynamic Variable',

    // Storefront & Banners
    storefrontTitle: 'Storefront Announcement & Spotlight Banners',
    storefrontSubtitle: 'Customize top ticker banners, highlight seasonal micro-lots in the hero showcase, and set roastery holiday alerts.',
    announcementBar: 'Top Announcement Banner',
    enableAnnouncement: 'Enable Announcement Bar on Storefront',
    announcementTextTr: 'Banner Text (Turkish)',
    announcementTextEn: 'Banner Text (English)',
    announcementBgColor: 'Banner Background Theme',
    announcementLinkUrl: 'Destination Link URL',
    heroSpotlight: 'Roaster’s Spotlight (Hero Showcase)',
    selectSpotlightProduct: 'Select Featured Coffee for Homepage Hero',
    holidayMode: 'Roastery Vacation / Holiday Notice',
    enableHolidayMode: 'Enable Holiday Notice Mode',
    holidayNoticeTr: 'Holiday Notice Text (Turkish)',
    holidayNoticeEn: 'Holiday Notice Text (English)',
    saveStorefrontSettings: 'Save Storefront Settings',

    // Thermal Label
    printThermalLabel: 'Print Bag Label',
    thermalLabelTitle: 'Specialty Coffee Bag Sticker',
    thermalRoastDate: 'Roast Date Stamp',
    printSticker: 'Print 4x6" Thermal Sticker',

    // Overview
    overviewTitle: 'Roastery Performance',
    overviewSubtitle: 'Live roasting batches, order velocity, and inventory health.',
    kpiRevenue: 'Total Net Revenue',
    kpiOrders: 'Total Orders',
    kpiRoasts: 'Active Coffee Roasts',
    kpiEquipment: 'Machinery & Gear SKUs',
    kpiLowStock: 'Low Stock Items',
    last7DaysRevenue: '7-Day Revenue Trends',
    bestSellers: 'Top-Selling Single Origins',
    recentOrders: 'Live Order Stream',
    noSalesYet: 'No order activity recorded yet.',
    noLowStock: 'All roasts and machinery are well-stocked.',
    unitsSold: 'units sold',
    vsLastWeek: 'vs previous period',

    // Orders
    ordersTitle: 'Orders Administration',
    ordersSubtitle: 'Track green-to-cup roasting, courier dispatch, and customer payments.',
    searchOrdersPlaceholder: 'Search by order ID, email, or customer name…',
    allOrders: 'All Orders',
    awaitingPayment: 'Awaiting Payment',
    roasting: 'Roasting',
    packed: 'Packed',
    shipped: 'Shipped',
    completed: 'Completed',
    canceled: 'Canceled',
    colReference: 'Order Ref',
    colDate: 'Date',
    colCustomer: 'Customer',
    colItems: 'Items',
    colTotal: 'Amount',
    colPayment: 'Payment',
    colFulfillment: 'Fulfillment',
    colActions: 'Actions',
    loadingOrders: 'Loading active orders...',
    noOrders: 'No orders match this filter.',
    manageOrder: 'Manage',
    exportToExcel: 'Export to Excel',
    paginationPageOf: 'Page {page} of {total}',
    paginationPrev: 'Previous',
    paginationNext: 'Next',
    identityNumberLabel: 'TC Identity No',
    orderTypeWholesale: 'Wholesale Order',
    orderTypeRetail: 'Retail Order',

    // Order Modal
    orderSpecs: 'Order Details & Workflow',
    customerInfo: 'Customer & Delivery Information',
    email: 'Email',
    phone: 'Phone',
    address: 'Shipping Address',
    lineItems: 'Ordered Items',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    free: 'FREE',
    grandTotal: 'Grand Total',
    workflowTitle: 'Fulfillment Stage',
    startRoasting: 'Start Roasting Batch',
    packOrder: 'Pack & Assign Cargo',
    dispatchOrder: 'Dispatch & Enter Tracking',
    cancelOrder: 'Cancel Order',
    carrierLabel: 'Carrier Provider',
    trackingLabel: 'Tracking Code',
    trackingPlaceholder: 'e.g. YK-8921827',
    printSlip: 'Print Packing Slip',

    // Coffee Beans Tab
    coffeeTitle: 'Coffee Beans & Roast Catalog',
    coffeeSubtitle: 'Manage single origins, espresso blends, roast levels, and 250g/1kg prices.',
    addCoffeeRoast: 'Add New Coffee Roast',
    allRoasts: 'All Coffee Types',
    filterRoastLevel: 'Roast Profile',
    filterStock: 'Stock Health',
    allStock: 'All Stock',
    inStock: 'In Stock (>5)',
    lowStock: 'Low Stock (1-5)',
    outStock: 'Out of Stock (0)',
    viewGrid: 'Grid View',
    viewTable: 'Table View',
    searchCoffeePlaceholder: 'Search coffee by origin, varietal, tasting notes…',
    colImage: 'Bean / Bag',
    colName: 'Coffee Name',
    colCategory: 'Type',
    colPrice: '250g / 1kg Price',
    colStock: 'Stock',
    colRoastMeter: 'Roast Level',
    colStatus: 'Status',
    active: 'Active',
    hidden: 'Hidden',
    edit: 'Edit',
    delete: 'Deactivate',
    loadingInventory: 'Loading inventory...',
    noCoffeeFound: 'No coffee roasts match your filters.',

    // Equipment Tab
    equipmentTitle: 'Machinery, Equipment & Accessories',
    equipmentSubtitle: 'Manage espresso machines, commercial grinders, barista tools, and cleaners.',
    addEquipment: 'Add Equipment / Gear',
    searchEquipmentPlaceholder: 'Search machines, grinders, accessories by name…',
    allEquipment: 'All Gear Categories',
    colEquipmentPrice: 'Retail Price (₺)',
    colEquipmentSpecs: 'Key Specifications',
    noEquipmentFound: 'No machinery or gear found.',

    // Modals
    modalAddRoast: 'Add New Specialty Coffee Roast',
    modalEditRoast: 'Edit Coffee Roast Details',
    modalAddEquipment: 'Add New Machinery / Equipment',
    modalEditEquipment: 'Edit Equipment Details',
    roastSlug: 'Unique Slug / URL Handle',
    roastSlugPlaceholder: 'e.g. ethiopia-yirgacheffe-g1',
    equipmentSlugPlaceholder: 'e.g. linea-mini-espresso-machine',
    roastName: 'Coffee Name',
    roastNamePlaceholder: 'e.g. Ethiopia Yirgacheffe G1 Washed',
    equipmentName: 'Product / Machine Name',
    equipmentNamePlaceholder: 'e.g. La Marzocco Linea Mini, Mahlkönig EK43',
    selectCategory: 'Select Category…',
    price250: '250g Retail Price (₺)',
    price1kg: '1kg Retail Price (₺)',
    unitPrice: 'Unit Retail Price (₺)',
    stockUnits: 'Available Stock Units',
    origin: 'Origin / Farm / Province',
    originPlaceholder: 'e.g. Yirgacheffe, Gedeb District',
    altitude: 'Elevation / Altitude',
    altitudePlaceholder: 'e.g. 1,900m - 2,200m ASL',
    varietal: 'Bean Varietal / Cultivar',
    varietalPlaceholder: 'e.g. Heirloom Typica, Kurume',
    roastMeterLabel: 'Roast Intensity Level',
    tastingNotes: 'Tasting Notes (comma-separated)',
    tastingNotesPlaceholder: 'e.g. Bergamot, Jasmine, White Peach, Honey',
    description: 'Flavor Notes & Story',
    equipmentDescription: 'Product Description & Specifications',
    descriptionPlaceholder: 'Sensory notes, terroir, processing method, farmer story…',
    equipmentDescriptionPlaceholder: 'Technical specifications, boiler size, burr diameter, power…',
    productImage: 'Product Image',
    dropImage: 'Click or drop image file here',
    imageHint: 'WebP, PNG, JPG (Max 20MB)',
    pasteUrl: 'Or paste image URL directly',
    showInCatalog: 'Visible in storefront customer catalog',
    saveProduct: 'Save Product',
    saving: 'Saving...',

    // Categories Modal
    categoriesModalTitle: 'Catalog Category Management',
    categoriesModalSubtitle: 'Create and organize categories for coffee roasts and equipment.',
    addCategory: 'Add Category',
    categoryDisplayLabel: 'Category Display Title',
    categoryLabelPlaceholder: 'e.g. Micro-Lot, Cold Brew, Espresso Machines',
    colSlugId: 'Slug ID',
    colProductsUsing: 'Active Products',
    rename: 'Rename',
    createCategory: 'Create Category',

    // Customers
    customersTitle: 'Customers & CRM',
    customersSubtitle: 'Analyze loyal customers, repeat purchase rates, and lifetime spend.',
    totalCustomers: 'Total Customers',
    repeatRate: 'Repeat Purchase Rate',
    avgLifetimeSpend: 'Avg Lifetime Spend',
    searchCustomersPlaceholder: 'Search customers by email, phone, or name…',
    colOrdersCount: 'Orders',
    colLifetimeSpend: 'Lifetime Spent',
    colLastOrder: 'Last Order',
    colCustomerType: 'Tier',
    vipRepeat: 'Repeat Customer',
    newCustomer: 'New Customer',

    // Shipping
    shippingTitle: 'Logistics & Cargo Setup',
    shippingSubtitle: 'Configure courier integrations, fixed delivery rates, or free shipping rules.',
    addProvider: 'Add Cargo Carrier',
    chargeShippingLabel: 'Charge shipping fee at customer checkout',
    shippingEnabledNote: 'Customers select their courier and pay the associated delivery fee.',
    shippingDisabledNote: 'Complimentary free shipping is currently active for all orders.',
    colProvider: 'Carrier Name',
    colFee: 'Standard Delivery Fee',
    saveProvider: 'Save Provider',

    // Coupons
    couponsTitle: 'Discount & Promotional Codes',
    couponsSubtitle: 'Create bespoke promo vouchers, seasonal campaigns, and wholesale perks.',
    addCoupon: 'Create Promo Code',
    colCode: 'Promo Code',
    colDiscount: 'Discount',
    colMinOrder: 'Min Basket',
    colUses: 'Redemptions',
    colExpires: 'Expiry Date',
    noExpiry: 'Never Expires',
    percentOff: 'Percentage (%)',
    fixedOff: 'Fixed Cash (₺)',
    saveCoupon: 'Save Promo Code',

    // Reviews
    reviewsTitle: 'Customer Ratings & Reviews',
    reviewsSubtitle: 'Moderate authentic feedback, brew tasting impressions, and cup scores.',
    colProduct: 'Item',
    colRating: 'Rating',
    colReview: 'Customer Review',
    colVisibility: 'Visibility',
    visible: 'Visible',
    hide: 'Hide',
    show: 'Show',

    // Blog
    blogTitle: 'Roastery Journal & Articles',
    blogSubtitle: 'Publish brew guides, farmer stories, origin spotlights, and news.',
    addBlogPost: 'Write New Article',
    colTitleTr: 'Turkish Title',
    colTitleEn: 'English Title',
    publishPost: 'Publish Article',

    confirmDelete: 'Are you sure you want to delete this item? This action cannot be undone.',
    confirmDeactivate: 'Deactivate this product? It will be hidden from the storefront catalog.',

    // Shared UI
    reset: 'Reset',
    cancel: 'Cancel',
    close: 'Close',
    done: 'Done',
    save: 'Save',
    liveLabel: 'Live',
    coffeeTypesFilterTitle: 'Coffee Types',
    gearCategoriesFilterTitle: 'Gear Categories',
    lightRoastPct: 'Light (10%)',
    mediumRoastPct: 'Medium (50%)',
    darkRoastPct: 'Dark (100%)',
    noReviewsRecorded: 'No customer reviews recorded.',
    outOfStockBadge: 'Out of Stock',
    soldOutBadge: 'Sold Out',
    unitsSuffix: 'units',
    inStockSuffix: 'in stock',
    showingLabel: 'Showing',
    coffeeRoastsWord: 'coffee roasts',
    gearSkusWord: 'machinery & gear SKUs',
    roastPctSuffix: 'Roast',
    noPhoneFallback: 'No phone',
    itemsSuffix: 'items',
    ordersSuffix: 'orders',
    viewOrdersBtn: 'View Orders →',
    configuredCourierProviders: 'Configured Courier Providers',
    activePromoCodesLabel: 'Active Promotional Codes',
    offSuffix: 'OFF',
    minOrderShortLabel: 'Min Order:',
    usesShortLabel: 'Uses:',
    expiresPrefix: 'Expires',
    coffeeRoastFallback: 'Coffee Roast',
    reviewerFallback: 'Customer',
    publishedJournalStories: 'Published Journal Stories',
    urlIdentifierHint: '(URL identifier)',
    newCategoryBtn: '+ New Category',
    terroirSensoryProfile: 'Terroir & Sensory Profile',
    technicalSpecifications: 'Technical Specifications',
    originRoastFlavorHint: 'Origin, roast meter & flavor notes',
    specsAndDetailsHint: 'Specs and details',
    typeNoteAndPressEnter: 'Type note and press Enter (e.g. Jasmine)...',
    addAnotherNote: 'Add another note...',
    removeChangeImage: 'Remove & Change Image',
    uploadingImageText: 'Uploading image...',
    dropImageHere: 'Drop image file here or click to browse',
    orPasteCustomLink: '(Or paste custom web link)',
    pickFromLibrary: 'Pick from Roastery Image Library',
    packsWord: 'Packs',
    equipmentWord: 'Equipment',
    showInCatalogSubtitle: 'When enabled, customers can discover and purchase this item in storefront.',
    categoryFallback: 'Category',
    specialtyCoffeeRoastNamePlaceholder: 'Specialty Coffee Roast Name',
    machineryGearSkuPlaceholder: 'Machinery & Gear SKU',
    terroirRegionFallback: 'Terroir Region',
    highAltitudeFallback: 'High Altitude',
    livePreviewUpdatesText: 'Updates in real-time as you type, select roast profiles, and attach artwork.',
    activeInStorefront: 'Active in Storefront',
    hiddenFromStorefront: 'Hidden from Storefront',
    productsSuffix: 'products',
    noPhoneProvided: 'No phone provided',
    standardDeliveryAddress: 'Standard Delivery Address',
    qtyLabel: 'Qty:',
    editCargoCarrier: 'Edit Cargo Carrier',
    addCargoCarrier: 'Add Cargo Carrier',
    editDiscountCoupon: 'Edit Discount Coupon',
    newDiscountCoupon: 'New Discount Coupon',
    editJournalStory: 'Edit Journal Story',
    writeJournalStory: 'Write Journal Story',
    thermalLabelSubtitle: 'Print high-resolution 4x6" thermal adhesive stickers for coffee pouches.',
    pouch250gOption: '250 Grams (Retail Pouch)',
    pouch1kgOption: '1,000 Grams / 1kg (Barista Bag)',
    roastsInCatalogSuffix: 'roasts in catalog',
    machinesAndGearSuffix: 'machines & gear',
    activeVelocity: 'Active Velocity',
    viewAllOrdersBtn: 'View All Orders →',
    viewDetailsArrow: 'View Details →',

    // Product Modal
    tabOverviewAll: 'Overview & All',
    tabBasicsPricing: 'Basics & Pricing',
    tabRoastSensory: 'Roast & Sensory',
    tabSpecs: 'Specs',
    tabPhotosMedia: 'Photos & Media',
    productDetailsPricing: 'Product Details & Pricing',
    coreCatalogParams: 'Core catalog parameters',
    tastingNotesChips: 'Tasting Notes (Chips)',
    pressEnterOrComma: 'Press Enter or comma to add',
    quickAdd: 'Quick add:',
    productMediaArtwork: 'Product Media & Artwork',
    highResPhotography: 'High-res photography',
    supportsFormats: 'Supports WebP, PNG, JPG (High Resolution)',
    imageUrlLabel: 'Image URL',
    coffeeStoryFarmerNotes: 'Coffee Story & Farmer Notes',
    livePreviewColon: 'Live Preview:',

    // Storefront
    liveStorefrontPreview: 'Live Storefront Preview',
    liveAnnouncementPreview: 'Live Storefront Announcement Bar Preview:',

    // Coupons Modal
    discountTypeLabel: 'Discount Type',
    valueLabel: 'Value',
    minOrderAmountLabel: 'Min Order Amount (₺)',
    maxUsesOptional: 'Max Uses (Optional)',
    leaveEmptyUnlimited: 'Leave empty for unlimited',
    expiryDateOptional: 'Expiry Date (Optional)',

    // Blog Modal
    articleContentTr: 'Article Content (Turkish)',
    articleContentEn: 'Article Content (English)',
    blogCategoryLabel: 'Category',
    blogCatCulture: 'Coffee Culture',
    blogCatBrewing: 'Brewing Guides',
    blogCatOrigin: 'Origin Stories',
    blogCatNews: 'Roastery News',
    coverImageUrl: 'Cover Image URL',
    pasteImageUrlPlaceholder: 'Paste image URL...',

    // Thermal Label Modal
    pouchNetWeightLabel: 'Pouch Net Weight',
  },
  tr: {
    uploadFailed: 'Yükleme başarısız oldu',
    unknownError: 'Bilinmeyen hata',
    brandName: 'ESTO ROASTERY',
    brandTag: 'Özel Kahve Kavurma Yönetimi',
    navSectionMain: 'Mağaza Kataloğu',
    navSectionSales: 'Siparişler & CRM',
    navSectionMarketing: 'Büyüme ve İçerik',
    navSectionSettings: 'Lojistik & Ayarlar',
    navOverview: 'Genel Bakış',
    navCoffee: 'Kahve Çekirdekleri',
    navEquipment: 'Ekipman & Aksesuar',
    navOrders: 'Sipariş Kuyruğu',
    navCustomers: 'Müşteriler & CRM',
    navEmail: 'E-posta & Bildirimler',
    navStorefrontSettings: 'Mağaza & Duyuru Bandı',
    navBlog: 'Blog & Rehberler',
    navShipping: 'Kargo & Lojistik',
    navCoupons: 'İndirim Kuponları',
    navReviews: 'Değerlendirmeler',
    navStorefront: 'Canlı Mağazayı Aç',
    manageCategories: 'Kategorileri Yönet',
    signOut: 'Çıkış Yap',
    refresh: 'Yenile',
    storeLive: 'Kavurmahane Çevrimiçi',

    // Email Studio
    emailStudioTitle: 'E-posta Stüdyosu & Gönderim Ayarları',
    emailStudioSubtitle: 'Sipariş ve hatırlatma şablonlarını tasarlayın, SMTP sunucu bilgilerini yapılandırın ve canlı test edin.',
    smtpSettings: 'SMTP & Gönderici Bilgileri',
    smtpHost: 'SMTP Sunucusu',
    smtpPort: 'SMTP Port',
    smtpUser: 'SMTP Kullanıcı Adı',
    smtpPass: 'SMTP Şifresi',
    fromEmail: 'Gönderici E-postası',
    fromName: 'Gönderici Adı',
    resendApiKey: 'Resend API Anahtarı (İsteğe Bağlı)',
    testEmailRecipient: 'Test Alıcı E-postası',
    sendTestEmail: 'Test E-postası Gönder',
    saveEmailSettings: 'Ayarları Kaydet',
    subjectLine: 'E-posta Konu Başlığı',
    headlineText: 'Ana Başlık',
    bodyMessage: 'E-posta Gövde Metni',
    buttonLabel: 'Eylem Butonu Metni',
    buttonDestination: 'Buton Hedef Linki',
    footerMessage: 'Alt Bilgi (Footer)',
    insertTag: 'Dinamik Değişken Ekle',

    // Storefront & Banners
    storefrontTitle: 'Mağaza Duyuru Bandı & Öne Çıkanlar',
    storefrontSubtitle: 'Üst duyuru bandını düzenleyin, anasayfa vitrin kahvesini belirleyin ve tatil duyurusu ekleyin.',
    announcementBar: 'Üst Duyuru Bandı',
    enableAnnouncement: 'Duyuru Bandını Mağazada Göster',
    announcementTextTr: 'Duyuru Metni (Türkçe)',
    announcementTextEn: 'Duyuru Metni (İngilizce)',
    announcementBgColor: 'Bant Arka Plan Teması',
    announcementLinkUrl: 'Tıklama Hedef URL',
    heroSpotlight: 'Kavurmacının Seçimi (Anasayfa Vitrini)',
    selectSpotlightProduct: 'Anasayfada Öne Çıkacak Kahveyi Seçin',
    holidayMode: 'Kavurmahane Tatil / Bakım Bildirimi',
    enableHolidayMode: 'Tatil Bildirimini Aktif Et',
    holidayNoticeTr: 'Tatil Bildirim Metni (Türkçe)',
    holidayNoticeEn: 'Tatil Bildirim Metni (İngilizce)',
    saveStorefrontSettings: 'Mağaza Ayarlarını Kaydet',

    // Thermal Label
    printThermalLabel: 'Paket Etiketi Yazdır',
    thermalLabelTitle: 'Nitelikli Kahve Paket Etiketi',
    thermalRoastDate: 'Kavrum Tarihi',
    printSticker: '4x6" Termal Etiket Yazdır',

    // Overview
    overviewTitle: 'Kavurmahane Performansı',
    overviewSubtitle: 'Gerçek zamanlı kavurma partileri, satış temposu ve stok sağlığı.',
    kpiRevenue: 'Net Toplam Gelir',
    kpiOrders: 'Toplam Sipariş',
    kpiRoasts: 'Aktif Kahve Çekirdeği',
    kpiEquipment: 'Ekipman & Aksesuar',
    kpiLowStock: 'Kritik Stoklu Ürün',
    last7DaysRevenue: 'Son 7 Gün Gelir Grafiği',
    bestSellers: 'En Çok Satan Single Originler',
    recentOrders: 'Canlı Sipariş Akışı',
    noSalesYet: 'Henüz sipariş kaydı bulunmuyor.',
    noLowStock: 'Tüm çekirdek ve ekipman stoğu yeterli.',
    unitsSold: 'adet satıldı',
    vsLastWeek: 'önceki döneme göre',

    // Orders
    ordersTitle: 'Sipariş Yönetimi',
    ordersSubtitle: 'Kavurma aşamalarını, kargo teslimatlarını ve müşteri ödemelerini yönetin.',
    searchOrdersPlaceholder: 'Sipariş no, e-posta veya müşteri adıyla ara…',
    allOrders: 'Tüm Siparişler',
    awaitingPayment: 'Ödeme Bekleniyor',
    roasting: 'Kavruluyor',
    packed: 'Paketlendi',
    shipped: 'Kargoya Verildi',
    completed: 'Tamamlandı',
    canceled: 'İptal Edildi',
    colReference: 'Sipariş No',
    colDate: 'Tarih',
    colCustomer: 'Müşteri',
    colItems: 'Ürünler',
    colTotal: 'Tutar',
    colPayment: 'Ödeme',
    colFulfillment: 'Hazırlık',
    colActions: 'İşlemler',
    loadingOrders: 'Siparişler yükleniyor...',
    noOrders: 'Bu filtreye uygun sipariş bulunamadı.',
    manageOrder: 'Yönet',
    exportToExcel: 'Excel\'e Aktar',
    paginationPageOf: 'Sayfa {page} / {total}',
    paginationPrev: 'Önceki',
    paginationNext: 'Sonraki',
    identityNumberLabel: 'TC Kimlik No',
    orderTypeWholesale: 'Toptan Sipariş',
    orderTypeRetail: 'Perakende Sipariş',

    // Order Modal
    orderSpecs: 'Sipariş Detayları ve Süreç',
    customerInfo: 'Müşteri ve Teslimat Bilgileri',
    email: 'E-posta',
    phone: 'Telefon',
    address: 'Teslimat Adresi',
    lineItems: 'Sipariş Edilen Ürünler',
    subtotal: 'Ara Toplam',
    shipping: 'Kargo Bedeli',
    free: 'ÜCRETSİZ',
    grandTotal: 'Genel Toplam',
    workflowTitle: 'Hazırlık Aşaması',
    startRoasting: 'Kavurma Partisini Başlat',
    packOrder: 'Paketle ve Kargo Ata',
    dispatchOrder: 'Kargoya Ver & Takip No Gir',
    cancelOrder: 'Siparişi İptal Et',
    carrierLabel: 'Kargo Firması',
    trackingLabel: 'Takip Numarası',
    trackingPlaceholder: 'örn. YK-8921827',
    printSlip: 'Sipariş Fişi Yazdır',

    // Coffee Beans Tab
    coffeeTitle: 'Kahve Çekirdekleri & Kavrum Kataloğu',
    coffeeSubtitle: 'Single origin çekirdekleri, harmanları, kavurma derecelerini ve fiyatları yönetin.',
    addCoffeeRoast: 'Yeni Kahve Çekirdeği Ekle',
    allRoasts: 'Tüm Kahve Çeşitleri',
    filterRoastLevel: 'Kavurma Profili',
    filterStock: 'Stok Durumu',
    allStock: 'Tüm Stoklar',
    inStock: 'Stokta Var (>5)',
    lowStock: 'Kritik Stok (1-5)',
    outStock: 'Tükendi (0)',
    viewGrid: 'Kart Görünümü',
    viewTable: 'Tablo Görünümü',
    searchCoffeePlaceholder: 'Köken, varyete veya tadım notuna göre ara…',
    colImage: 'Görsel',
    colName: 'Kahve İsmi',
    colCategory: 'Kategori',
    colPrice: '250g / 1kg Fiyatı',
    colStock: 'Stok',
    colRoastMeter: 'Kavurma',
    colStatus: 'Durum',
    active: 'Aktif',
    hidden: 'Gizli',
    edit: 'Düzenle',
    delete: 'Devre Dışı Bırak',
    loadingInventory: 'Katalog yükleniyor...',
    noCoffeeFound: 'Filtrelere uygun kahve çekirdeği bulunamadı.',

    // Equipment Tab
    equipmentTitle: 'Kahve Makineleri, Ekipman ve Aksesuarlar',
    equipmentSubtitle: 'Espresso makinelerini, öğütücüleri, barista aletlerini ve temizlik ürünlerini yönetin.',
    addEquipment: 'Yeni Ekipman / Makine Ekle',
    searchEquipmentPlaceholder: 'Makine, değirmen veya aksesuar adına göre ara…',
    allEquipment: 'Tüm Ekipman Kategorileri',
    colEquipmentPrice: 'Satış Fiyatı (₺)',
    colEquipmentSpecs: 'Temel Özellikler',
    noEquipmentFound: 'Ekipman veya aksesuar bulunamadı.',

    // Modals
    modalAddRoast: 'Yeni Nitelikli Kahve Ekle',
    modalEditRoast: 'Kahve Bilgilerini Düzenle',
    modalAddEquipment: 'Yeni Ekipman / Makine Ekle',
    modalEditEquipment: 'Ekipman Bilgilerini Düzenle',
    roastSlug: 'Benzersiz Slug / URL',
    roastSlugPlaceholder: 'örn. ethiopia-yirgacheffe-g1',
    equipmentSlugPlaceholder: 'örn. linea-mini-espresso-makinesi',
    roastName: 'Kahve İsmi',
    roastNamePlaceholder: 'örn. Ethiopia Yirgacheffe G1 Washed',
    equipmentName: 'Ekipman / Makine İsmi',
    equipmentNamePlaceholder: 'örn. La Marzocco Linea Mini, Mahlkönig EK43',
    selectCategory: 'Kategori Seçin…',
    price250: '250g Satış Fiyatı (₺)',
    price1kg: '1kg Satış Fiyatı (₺)',
    unitPrice: 'Birim Satış Fiyatı (₺)',
    stockUnits: 'Mevcut Stok Adedi',
    origin: 'Köken / Bölge / Çiftlik',
    originPlaceholder: 'örn. Yirgacheffe, Gedeb Bölgesi',
    altitude: 'Rakım / Yükseklik',
    altitudePlaceholder: 'örn. 1.900m - 2.200m',
    varietal: 'Çekirdek Varyetesi',
    varietalPlaceholder: 'örn. Heirloom, Kurume',
    roastMeterLabel: 'Kavurma Seviyesi',
    tastingNotes: 'Tadım Notları (virgülle ayırın)',
    tastingNotesPlaceholder: 'örn. Bergamot, Yasemin, Beyaz Şeftali, Bal',
    description: 'Tadım Notları & Hikaye',
    equipmentDescription: 'Ürün Açıklaması & Teknik Özellikler',
    descriptionPlaceholder: 'İşlenme yöntemi, çiftlik hikayesi, fincan notları…',
    equipmentDescriptionPlaceholder: 'Teknik özellikler, kazan kapasitesi, güç, garanti…',
    productImage: 'Ürün Görseli',
    dropImage: 'Görsel yüklemek için tıklayın veya sürükleyin',
    imageHint: 'WebP, PNG, JPG (Maks. 20MB)',
    pasteUrl: 'Veya doğrudan görsel URL bağlantısı yapıştırın',
    showInCatalog: 'Mağaza kataloğunda müşterilere göster',
    saveProduct: 'Ürünü Kaydet',
    saving: 'Kaydediliyor...',

    // Categories Modal
    categoriesModalTitle: 'Katalog Kategori Yönetimi',
    categoriesModalSubtitle: 'Kahve çekirdekleri ve makineler için kategoriler oluşturun ve düzenleyin.',
    addCategory: 'Yeni Kategori Ekle',
    categoryDisplayLabel: 'Kategori Başlığı',
    categoryLabelPlaceholder: 'örn. Single Origin, Micro-Lot, Espresso Makineleri',
    colSlugId: 'Slug ID',
    colProductsUsing: 'Bağlı Ürünler',
    rename: 'Yeniden Adlandır',
    createCategory: 'Kategori Oluştur',

    // Customers
    customersTitle: 'Müşteri CRM & Sadakat',
    customersSubtitle: 'Sadık kahveseverleri, tekrar sipariş oranlarını ve toplam müşteri değerini inceleyin.',
    totalCustomers: 'Toplam Müşteri',
    repeatRate: 'Tekrar Sipariş Oranı',
    avgLifetimeSpend: 'Ort. Müşteri Harcaması',
    searchCustomersPlaceholder: 'E-posta, telefon veya isimle ara…',
    colOrdersCount: 'Sipariş',
    colLifetimeSpend: 'Toplam Harcama',
    colLastOrder: 'Son Sipariş Tarihi',
    colCustomerType: 'Seviye',
    vipRepeat: 'Sadık Kahvesever',
    newCustomer: 'Yeni Müşteri',

    // Shipping
    shippingTitle: 'Kargo & Lojistik Ayarları',
    shippingSubtitle: 'Kargo firması entegrasyonlarını ve gönderim ücretlerini yönetin.',
    addProvider: 'Kargo Firması Ekle',
    chargeShippingLabel: 'Ödeme adımında kargo bedeli tahsil et',
    shippingEnabledNote: 'Müşteriler kargo firmasını seçer ve kargo ücreti sipariş tutarına eklenir.',
    shippingDisabledNote: 'Şu anda tüm siparişlerde ücretsiz kargo kampanyası aktiftir.',
    colProvider: 'Kargo Firması',
    colFee: 'Gönderim Ücreti',
    saveProvider: 'Firmayı Kaydet',

    // Coupons
    couponsTitle: 'İndirim Kuponları & Kampanyalar',
    couponsSubtitle: 'Kupon kodları, sepette geçerli indirimler ve kampanyalar oluşturun.',
    addCoupon: 'Yeni Kupon Oluştur',
    colCode: 'Kupon Kodu',
    colDiscount: 'İndirim Tutarı',
    colMinOrder: 'Min. Sepet',
    colUses: 'Kullanım',
    colExpires: 'Son Geçerlilik',
    noExpiry: 'Süresiz',
    percentOff: 'Yüzdelik (%)',
    fixedOff: 'Sabit Tutar (₺)',
    saveCoupon: 'Kuponu Kaydet',

    // Reviews
    reviewsTitle: 'Müşteri Yorumları & Değerlendirmeler',
    reviewsSubtitle: 'Gerçek fincan deneyimlerini ve yıldız puanlarını yönetin.',
    colProduct: 'Ürün',
    colRating: 'Puan',
    colReview: 'Müşteri Yorumu',
    colVisibility: 'Görünürlük',
    visible: 'Yayında',
    hide: 'Gizle',
    show: 'Göster',

    // Blog
    blogTitle: 'Blog & Kahve Kültürü CMS',
    blogSubtitle: 'Demleme rehberleri, çiftlik hikayeleri ve haberler yayınlayın.',
    addBlogPost: 'Yeni Yazı Ekle',
    colTitleTr: 'Türkçe Başlık',
    colTitleEn: 'İngilizce Başlık',
    publishPost: 'Yazıyı Yayınla',

    confirmDelete: 'Bu öğeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
    confirmDeactivate: 'Bu ürünü devre dışı bırakmak istediğinizden emin misiniz?',

    // Shared UI
    reset: 'Sıfırla',
    cancel: 'İptal',
    close: 'Kapat',
    done: 'Tamam',
    save: 'Kaydet',
    liveLabel: 'Canlı',
    coffeeTypesFilterTitle: 'Kahve Türleri',
    gearCategoriesFilterTitle: 'Ekipman Kategorileri',
    lightRoastPct: 'Açık (10%)',
    mediumRoastPct: 'Orta (50%)',
    darkRoastPct: 'Koyu (100%)',
    noReviewsRecorded: 'Kayıtlı müşteri yorumu bulunmuyor.',
    outOfStockBadge: 'Tükendi',
    soldOutBadge: 'Tükendi',
    unitsSuffix: 'adet',
    inStockSuffix: 'stokta',
    showingLabel: 'Gösterilen',
    coffeeRoastsWord: 'kahve çekirdeği',
    gearSkusWord: 'ekipman SKU',
    roastPctSuffix: 'Kavurma',
    noPhoneFallback: 'Telefon yok',
    itemsSuffix: 'ürün',
    ordersSuffix: 'sipariş',
    viewOrdersBtn: 'Siparişleri Gör →',
    configuredCourierProviders: 'Tanımlı Kargo Firmaları',
    activePromoCodesLabel: 'Aktif Kupon Kodları',
    offSuffix: 'İNDİRİM',
    minOrderShortLabel: 'Min. Sipariş:',
    usesShortLabel: 'Kullanım:',
    expiresPrefix: 'Son Geçerlilik',
    coffeeRoastFallback: 'Kahve Çekirdeği',
    reviewerFallback: 'Kahvesever Müşteri',
    publishedJournalStories: 'Yayınlanan Blog Yazıları',
    urlIdentifierHint: '(URL tanımlayıcı)',
    newCategoryBtn: '+ Yeni Kategori',
    terroirSensoryProfile: 'Bölge & Duyusal Profil',
    technicalSpecifications: 'Teknik Özellikler',
    originRoastFlavorHint: 'Köken, kavurma seviyesi & tadım notları',
    specsAndDetailsHint: 'Özellikler ve detaylar',
    typeNoteAndPressEnter: 'Not yazın ve Enter tuşuna basın (örn. Yasemin)...',
    addAnotherNote: 'Başka bir not ekleyin...',
    removeChangeImage: 'Kaldır & Görseli Değiştir',
    uploadingImageText: 'Görsel yükleniyor...',
    dropImageHere: 'Görseli buraya sürükleyin veya tıklayın',
    orPasteCustomLink: '(Veya özel web bağlantısı yapıştırın)',
    pickFromLibrary: 'Kavurmahane Görsel Kütüphanesinden Seçin',
    packsWord: 'Paketler',
    equipmentWord: 'Ekipman',
    showInCatalogSubtitle: 'Etkinleştirildiğinde müşteriler bu ürünü mağazada görebilir ve satın alabilir.',
    categoryFallback: 'Kategori',
    specialtyCoffeeRoastNamePlaceholder: 'Nitelikli Kahve İsmi',
    machineryGearSkuPlaceholder: 'Ekipman / Makine SKU',
    terroirRegionFallback: 'Bölge',
    highAltitudeFallback: 'Yüksek Rakım',
    livePreviewUpdatesText: 'Yazdıkça, kavurma profili seçtikçe ve görsel ekledikçe anlık güncellenir.',
    activeInStorefront: 'Mağazada Aktif',
    hiddenFromStorefront: 'Mağazadan Gizli',
    productsSuffix: 'ürün',
    noPhoneProvided: 'Telefon numarası girilmedi',
    standardDeliveryAddress: 'Standart Teslimat Adresi',
    qtyLabel: 'Adet:',
    editCargoCarrier: 'Kargo Firmasını Düzenle',
    addCargoCarrier: 'Kargo Firması Ekle',
    editDiscountCoupon: 'İndirim Kuponunu Düzenle',
    newDiscountCoupon: 'Yeni İndirim Kuponu',
    editJournalStory: 'Blog Yazısını Düzenle',
    writeJournalStory: 'Yeni Blog Yazısı',
    thermalLabelSubtitle: 'Kahve paketleri için yüksek çözünürlüklü 4x6" termal etiket yazdırın.',
    pouch250gOption: '250 Gram (Perakende Paket)',
    pouch1kgOption: '1.000 Gram / 1kg (Barista Paketi)',
    roastsInCatalogSuffix: 'kataloğa kayıtlı çekirdek',
    machinesAndGearSuffix: 'makine & ekipman',
    activeVelocity: 'Aktif Hız',
    viewAllOrdersBtn: 'Tüm Siparişleri Gör →',
    viewDetailsArrow: 'Detayları Gör →',

    // Product Modal
    tabOverviewAll: 'Genel Bakış & Tümü',
    tabBasicsPricing: 'Temel Bilgiler & Fiyat',
    tabRoastSensory: 'Kavurma & Duyusal',
    tabSpecs: 'Özellikler',
    tabPhotosMedia: 'Fotoğraflar & Medya',
    productDetailsPricing: 'Ürün Bilgileri & Fiyat',
    coreCatalogParams: 'Temel katalog bilgileri',
    tastingNotesChips: 'Tadım Notları (Etiketler)',
    pressEnterOrComma: 'Eklemek için Enter veya virgül tuşuna basın',
    quickAdd: 'Hızlı ekle:',
    productMediaArtwork: 'Ürün Görselleri',
    highResPhotography: 'Yüksek çözünürlüklü fotoğraf',
    supportsFormats: 'WebP, PNG, JPG destekler (Yüksek Çözünürlük)',
    imageUrlLabel: 'Görsel URL',
    coffeeStoryFarmerNotes: 'Kahve Hikayesi & Çiftçi Notları',
    livePreviewColon: 'Canlı Önizleme:',

    // Storefront
    liveStorefrontPreview: 'Canlı Mağaza Önizlemesi',
    liveAnnouncementPreview: 'Canlı Duyuru Bandı Önizlemesi:',

    // Coupons Modal
    discountTypeLabel: 'İndirim Türü',
    valueLabel: 'Değer',
    minOrderAmountLabel: 'Min. Sipariş Tutarı (₺)',
    maxUsesOptional: 'Maks. Kullanım (İsteğe Bağlı)',
    leaveEmptyUnlimited: 'Sınırsız için boş bırakın',
    expiryDateOptional: 'Son Kullanma Tarihi (İsteğe Bağlı)',

    // Blog Modal
    articleContentTr: 'Makale İçeriği (Türkçe)',
    articleContentEn: 'Makale İçeriği (İngilizce)',
    blogCategoryLabel: 'Kategori',
    blogCatCulture: 'Kahve Kültürü',
    blogCatBrewing: 'Demleme Rehberleri',
    blogCatOrigin: 'Köken Hikayeleri',
    blogCatNews: 'Kavurmahane Haberleri',
    coverImageUrl: 'Kapak Görseli URL',
    pasteImageUrlPlaceholder: 'Görsel URL yapıştırın...',

    // Thermal Label Modal
    pouchNetWeightLabel: 'Paket Net Ağırlığı',
  },
};

const BLOG_CATEGORY_LABELS: Record<string, Record<Lang, string>> = {
  culture: { en: 'Coffee Culture', tr: 'Kahve Kültürü' },
  brew: { en: 'Brewing Guides', tr: 'Demleme Rehberleri' },
  origins: { en: 'Origin Stories', tr: 'Köken Hikayeleri' },
  news: { en: 'Roastery News', tr: 'Kavurmahane Haberleri' },
};

export default function AdminDashboardPage() {
  const router = useRouter();

  // Tab navigation
  const [activeTab, setActiveTab] = useState<
    'overview' | 'coffee' | 'equipment' | 'orders' | 'customers' | 'coupons' | 'reviews' | 'blog' | 'email' | 'storefront' | 'shipping'
  >('overview');

  // Language state
  const [lang, setLang] = useState<Lang>('tr');
  useEffect(() => {
    const saved = window.localStorage.getItem('admin_lang');
    if (saved === 'en' || saved === 'tr') setLang(saved);
  }, []);

  const changeLang = (l: Lang) => {
    setLang(l);
    window.localStorage.setItem('admin_lang', l);
  };
  const t = ADMIN_STRINGS[lang];

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<CoffeeProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cargoProviders, setCargoProviders] = useState<CargoProvider[]>([]);
  const [shippingEnabled, setShippingEnabled] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  // Email Studio States
  const [emailSettings, setEmailSettings] = useState<any>(null);
  const [emailTemplates, setEmailTemplates] = useState<Record<string, any>>(DEFAULT_EMAIL_TEMPLATES);
  const [selectedEmailKey, setSelectedEmailKey] = useState<
    'order_confirmation' | 'order_shipped' | 'review_request' | 'refill_reminder' | 'abandoned_cart' | 'welcome_series'
  >('order_confirmation');
  const [emailPreviewDevice, setEmailPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showSmtpSettings, setShowSmtpSettings] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('customer@example.com');
  const [testEmailStatus, setTestEmailStatus] = useState<string | null>(null);
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [uploadingEmailImage, setUploadingEmailImage] = useState(false);

  // Storefront & Banner States
  const [storefrontSettings, setStorefrontSettings] = useState<any>({
    announcementEnabled: true,
    announcementTextTr: '☕ 2.000 TL ve üzeri tüm siparişlerde Kargo ÜCRETSİZ!',
    announcementTextEn: '☕ Free Shipping on all orders over ₺2,000!',
    announcementBg: 'linear-gradient(90deg, #2a170c 0%, #4a2817 100%)',
    announcementLink: '/coffee',
    spotlightProductId: 'ethiopia',
    holidayModeEnabled: false,
    holidayNoticeTr: '',
    holidayNoticeEn: '',
  });

  // Thermal Bag Label Modal State
  const [bagLabelProduct, setBagLabelProduct] = useState<CoffeeProduct | null>(null);
  const [bagLabelRoastDate, setBagLabelRoastDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [bagLabelSize, setBagLabelSize] = useState<'250g' | '1kg'>('250g');

  // UI & Filter states
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Searches
  const [coffeeSearch, setCoffeeSearch] = useState('');
  const [equipmentSearch, setEquipmentSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [globalSearch, setGlobalSearch] = useState('');

  // Coffee filters & view mode
  const [coffeeViewMode, setCoffeeViewMode] = useState<'grid' | 'table'>('grid');
  const [coffeeCategoryFilter, setCoffeeCategoryFilter] = useState<string>('all');
  const [coffeeStockFilter, setCoffeeStockFilter] = useState<'all' | 'in' | 'low' | 'out'>('all');
  const [roastLevelRange, setRoastLevelRange] = useState<number>(100);

  // Equipment filters & view mode
  const [equipmentViewMode, setEquipmentViewMode] = useState<'grid' | 'table'>('grid');
  const [equipmentCategoryFilter, setEquipmentCategoryFilter] = useState<string>('all');
  const [equipmentStockFilter, setEquipmentStockFilter] = useState<'all' | 'in' | 'low' | 'out'>('all');

  // Orders filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderCarrier, setOrderCarrier] = useState('Yurtiçi Kargo');
  const [orderTracking, setOrderTracking] = useState('');
  const [orderPage, setOrderPage] = useState(1);
  const ORDERS_PER_PAGE = 20;

  // Product Modals & Sub-tabs
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [modalType, setModalType] = useState<'coffee' | 'equipment'>('coffee');
  const [productModalTab, setProductModalTab] = useState<'all' | 'basics' | 'profile' | 'media' | 'story'>('all');
  const [selectedProduct, setSelectedProduct] = useState<CoffeeProduct | null>(null);
  const [prodForm, setProdForm] = useState<Partial<CoffeeProduct>>(emptyProduct(true));
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragOverDropzone, setDragOverDropzone] = useState(false);
  const [chipInput, setChipInput] = useState('');

  // Inline Category Management Modal
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState('');
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editCatLabel, setEditCatLabel] = useState('');

  // Shipping Modal
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState<CargoProvider | null>(null);
  const [providerForm, setProviderForm] = useState({ name: '', fee: 0 });

  // Coupon Modal
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponForm, setCouponForm] = useState({
    code: '',
    type: 'percent',
    value: 10,
    minOrderAmount: 0,
    maxUses: '',
    expiresAt: '',
    isActive: true,
  });

  // Blog Editor
  const [isAddingBlogPost, setIsAddingBlogPost] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({
    titleEn: '',
    titleTr: '',
    contentEn: '',
    contentTr: '',
    category: 'culture',
    imageUrl: '',
  });
  const [blogLangTab, setBlogLangTab] = useState<'tr' | 'en'>('tr');
  const contentTrRef = useRef<HTMLDivElement>(null);
  const contentEnRef = useRef<HTMLDivElement>(null);

  /* ── Data Fetchers ─────────────────────────────────────────── */
  const fetchOrders = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/orders');
      const d = await res.json();
      if (d.success) setOrders(d.data);
      else setErrorMsg(d.error);
    } catch {
      setErrorMsg('Network error loading orders.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/products');
      const d = await res.json();
      if (d.success) setProducts(d.data);
      else setErrorMsg(d.error);
    } catch {
      setErrorMsg('Network error loading products.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const d = await res.json();
      if (d.success) setCategories(d.data);
    } catch {
      // Ignored
    }
  };

  const fetchShippingSettings = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const [settingsRes, providersRes] = await Promise.all([
        fetch('/api/admin/shipping-settings'),
        fetch('/api/admin/cargo-providers'),
      ]);
      const settingsData = await settingsRes.json();
      const providersData = await providersRes.json();
      if (settingsData.success) setShippingEnabled(settingsData.data.enabled);
      if (providersData.success) setCargoProviders(providersData.data);
    } catch {
      setErrorMsg('Network error loading shipping settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCoupons = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/coupons');
      const d = await res.json();
      if (d.success) setCoupons(d.data);
    } catch {
      setErrorMsg('Network error loading coupons.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/reviews');
      const d = await res.json();
      if (d.success) setReviews(d.data);
    } catch {
      setErrorMsg('Network error loading reviews.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/blog');
      const d = await res.json();
      if (d.success) setBlogPosts(d.data);
    } catch {
      setErrorMsg('Network error loading blog articles.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmailSettings = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/email-settings');
      const d = await res.json();
      if (d.success) {
        setEmailSettings(d.data);
        if (d.data.templates) setEmailTemplates(d.data.templates);
      }
    } catch {
      setErrorMsg('Network error loading email settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEmailSettings = async (customTemplates?: any) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/email-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...emailSettings,
          templates: customTemplates || emailTemplates,
        }),
      });
      const d = await res.json();
      if (d.success) {
        setEmailSettings(d.data);
        alert(lang === 'tr' ? 'E-posta ayarları ve şablonlar kaydedildi!' : 'Email templates & SMTP configuration saved successfully!');
      }
    } catch {
      alert('Failed to save email settings.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmailAddress || !testEmailAddress.includes('@')) {
      alert('Please enter a valid recipient email address.');
      return;
    }
    setTestEmailLoading(true);
    setTestEmailStatus(null);
    try {
      const curTemplate = emailTemplates[selectedEmailKey] || DEFAULT_EMAIL_TEMPLATES[selectedEmailKey];
      const res = await fetch('/api/admin/email-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: testEmailAddress,
          templateId: selectedEmailKey,
          customSubject: curTemplate?.subject,
          customHeadline: curTemplate?.headline,
          customSubtitle: curTemplate?.subtitle,
          customBody: curTemplate?.body,
          customBadge: curTemplate?.badge,
          customHeroImage: curTemplate?.heroImage,
          customRoastmasterNote: curTemplate?.roastmasterNote,
          customButtonText: curTemplate?.buttonText,
          customButtonUrl: curTemplate?.buttonUrl,
          customFooterNote: curTemplate?.footerNote,
        }),
      });
      const d = await res.json();
      if (d.success) {
        if (d.data.deliveryStatus === 'dispatched_live_via_resend') {
          setTestEmailStatus(`✓ Dispatched live via Resend to ${d.data.dispatchedTo} (ID: ${d.data.messageId})`);
        } else {
          setTestEmailStatus(`✓ Test template successfully processed for ${d.data.dispatchedTo}`);
        }
      } else {
        setTestEmailStatus(`Error: ${d.error || 'Failed to dispatch email'}`);
      }
    } catch {
      setTestEmailStatus('Failed to connect to email test dispatcher.');
    } finally {
      setTestEmailLoading(false);
    }
  };

  const handleUploadEmailHero = async (file: File) => {
    setUploadingEmailImage(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      const uploadedUrl = d.data.url;
      setEmailTemplates((prev) => ({
        ...prev,
        [selectedEmailKey]: {
          ...(prev[selectedEmailKey] || DEFAULT_EMAIL_TEMPLATES[selectedEmailKey]),
          heroImage: uploadedUrl,
        },
      }));
    } catch (err: unknown) {
      alert(`Image upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUploadingEmailImage(false);
    }
  };

  const handleToggleEmailActive = (key: string) => {
    const cur = emailTemplates[key] || DEFAULT_EMAIL_TEMPLATES[key];
    const newEnabled = cur?.enabled === false ? true : false;
    const updated = {
      ...emailTemplates,
      [key]: {
        ...cur,
        enabled: newEnabled,
      },
    };
    setEmailTemplates(updated);
  };

  const fetchStorefrontSettings = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/storefront-settings');
      const d = await res.json();
      if (d.success) setStorefrontSettings(d.data);
    } catch {
      setErrorMsg('Network error loading storefront settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveStorefrontSettings = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/storefront-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storefrontSettings),
      });
      const d = await res.json();
      if (d.success) {
        setStorefrontSettings(d.data);
        alert(lang === 'tr' ? 'Mağaza duyuru ve vitrin ayarları güncellendi!' : 'Storefront announcement & theme settings updated!');
      }
    } catch {
      alert('Failed to save storefront settings.');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (activeTab === 'overview') {
      fetchOrders();
      fetchProducts();
    } else if (activeTab === 'coffee' || activeTab === 'equipment') {
      fetchProducts();
    } else if (activeTab === 'orders' || activeTab === 'customers') {
      fetchOrders();
    } else if (activeTab === 'email') {
      fetchEmailSettings();
    } else if (activeTab === 'storefront') {
      fetchStorefrontSettings();
      fetchProducts();
    } else if (activeTab === 'blog') {
      fetchBlogPosts();
    } else if (activeTab === 'shipping') {
      fetchShippingSettings();
    } else if (activeTab === 'coupons') {
      fetchCoupons();
    } else if (activeTab === 'reviews') {
      fetchReviews();
    }
  }, [activeTab]);

  const switchTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setSelectedOrder(null);
    setSelectedProduct(null);
    setIsAddingProduct(false);
    setShowCategoryManager(false);
    setShowProviderModal(false);
    setShowCouponModal(false);
    setIsAddingBlogPost(false);
    setErrorMsg('');
  };

  const handleLogout = async () => {
    const res = await fetch('/api/admin/logout', { method: 'POST' });
    if (res.ok) router.push('/admin/login');
  };

  /* ── Partition Products: Coffee Roasts vs Equipment ────────── */
  const coffeeProducts = products.filter((p) => COFFEE_CATEGORY_SLUGS.includes(p.category) || p.roastLevel > 0);
  const equipmentProducts = products.filter((p) => !COFFEE_CATEGORY_SLUGS.includes(p.category) && p.roastLevel === 0);

  const coffeeCategories = categories.filter((c) => COFFEE_CATEGORY_SLUGS.includes(c.slug));
  const equipmentCategories = categories.filter((c) => !COFFEE_CATEGORY_SLUGS.includes(c.slug));

  // Filtered Coffee Products
  const filteredCoffee = coffeeProducts.filter((p) => {
    if (coffeeCategoryFilter !== 'all' && p.category !== coffeeCategoryFilter) return false;
    if (coffeeStockFilter === 'in' && p.stock <= 5) return false;
    if (coffeeStockFilter === 'low' && (p.stock < 1 || p.stock > 5)) return false;
    if (coffeeStockFilter === 'out' && p.stock > 0) return false;
    if (p.roastLevel > roastLevelRange) return false;
    if (coffeeSearch.trim()) {
      const q = coffeeSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.origin?.toLowerCase().includes(q) ||
        p.varietal?.toLowerCase().includes(q) ||
        p.tastingNotes?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered Equipment Products
  const filteredEquipment = equipmentProducts.filter((p) => {
    if (equipmentCategoryFilter !== 'all' && p.category !== equipmentCategoryFilter) return false;
    if (equipmentStockFilter === 'in' && p.stock <= 5) return false;
    if (equipmentStockFilter === 'low' && (p.stock < 1 || p.stock > 5)) return false;
    if (equipmentStockFilter === 'out' && p.stock > 0) return false;
    if (equipmentSearch.trim()) {
      const q = equipmentSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all') {
      if (orderStatusFilter === 'roasting' && o.fulfillment_status !== 'roasting') return false;
      if (orderStatusFilter === 'packed' && o.fulfillment_status !== 'fulfilled') return false;
      if (orderStatusFilter === 'shipped' && o.fulfillment_status !== 'shipped') return false;
      if (orderStatusFilter === 'completed' && o.status !== 'completed') return false;
      if (orderStatusFilter === 'canceled' && o.status !== 'canceled') return false;
      if (orderStatusFilter === 'awaiting_payment' && o.payment_status !== 'awaiting') return false;
    }
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.email?.toLowerCase().includes(q) ||
        o.phone?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  useEffect(() => {
    setOrderPage(1);
  }, [orderStatusFilter, orderSearch]);

  const orderTotalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
  const orderPageClamped = Math.min(orderPage, orderTotalPages);
  const paginatedOrders = filteredOrders.slice(
    (orderPageClamped - 1) * ORDERS_PER_PAGE,
    orderPageClamped * ORDERS_PER_PAGE
  );

  const handleExportOrdersExcel = () => {
    const xlsxCols = EXPORT_COLUMNS[lang];

    const ordersSheet = filteredOrders.map((o) => ({
      [xlsxCols.orderId]: o.id,
      [xlsxCols.date]: fmtDateAccounting(o.createdAt),
      [xlsxCols.customerName]: o.fullName || '',
      [xlsxCols.email]: o.email,
      [xlsxCols.phone]: o.phone || '',
      [xlsxCols.identityNumber]: o.identityNumber || '',
      [xlsxCols.orderType]: o.isWholesale ? xlsxCols.wholesale : xlsxCols.retail,
      [xlsxCols.address]: o.address || '',
      [xlsxCols.subtotal]: o.subtotal,
      [xlsxCols.couponCode]: o.couponCode || '',
      [xlsxCols.discount]: o.discountAmount || 0,
      [xlsxCols.shippingFee]: o.shippingFee,
      [xlsxCols.totalAmount]: o.totalAmount,
      [xlsxCols.currency]: 'TRY',
      [xlsxCols.paymentStatus]: fmtStatus('payment', o.payment_status, lang),
      [xlsxCols.paymentReference]: o.id,
      [xlsxCols.fulfillmentStatus]: fmtStatus('fulfillment', o.fulfillment_status, lang),
      [xlsxCols.shippingProvider]: o.shippingProvider || '',
      [xlsxCols.trackingNumber]: o.trackingNumber || '',
      [xlsxCols.orderStatus]: fmtStatus('order', o.status, lang),
    }));

    const itemsSheet = filteredOrders.flatMap((o) =>
      (o.items || []).map((item) => ({
        [xlsxCols.orderId]: o.id,
        [xlsxCols.date]: fmtDateAccounting(o.createdAt),
        [xlsxCols.productName]: item.name,
        [xlsxCols.quantity]: item.quantity,
        [xlsxCols.unitPrice]: item.price,
        [xlsxCols.lineTotal]: item.quantity * item.price,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ordersSheet), xlsxCols.sheetOrders);
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(itemsSheet), xlsxCols.sheetOrderItems);
    XLSX.writeFile(wb, `${xlsxCols.fileNamePrefix}-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  /* ── Calculations & Metrics ─────────────────────────────────── */
  const totalRevenue = orders
    .filter((o) => o.payment_status === 'captured' && o.status !== 'canceled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const pendingOrdersCount = orders.filter((o) => o.fulfillment_status === 'not_fulfilled' || o.fulfillment_status === 'roasting').length;

  // Revenue chart calculation for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateKey = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'short' });
    const dayRevenue = orders
      .filter((o) => o.createdAt && o.createdAt.startsWith(dateKey) && o.payment_status === 'captured')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    return { dateKey, dayName, revenue: dayRevenue };
  });
  const maxDayRevenue = Math.max(...last7Days.map((d) => d.revenue), 100);

  // Top products sales mapping
  const productSalesMap: Record<string, { name: string; count: number; revenue: number }> = {};
  orders.forEach((ord) => {
    if (ord.payment_status === 'captured' && ord.items) {
      ord.items.forEach((it) => {
        if (!productSalesMap[it.name]) {
          productSalesMap[it.name] = { name: it.name, count: 0, revenue: 0 };
        }
        productSalesMap[it.name].count += it.quantity || 1;
        productSalesMap[it.name].revenue += (it.price || 0) * (it.quantity || 1);
      });
    }
  });
  const topSellingProducts = Object.values(productSalesMap).sort((a, b) => b.count - a.count).slice(0, 5);

  // Customer aggregation
  const customerMap: Record<string, { email: string; phone: string; count: number; spend: number; lastOrder: string }> = {};
  orders.forEach((o) => {
    if (!o.email) return;
    if (!customerMap[o.email]) {
      customerMap[o.email] = { email: o.email, phone: o.phone || '—', count: 0, spend: 0, lastOrder: o.createdAt };
    }
    customerMap[o.email].count += 1;
    customerMap[o.email].spend += o.totalAmount || 0;
    if (o.createdAt > customerMap[o.email].lastOrder) {
      customerMap[o.email].lastOrder = o.createdAt;
    }
  });
  const customerList = Object.values(customerMap);
  const repeatCustomerRate = customerList.length
    ? Math.round((customerList.filter((c) => c.count > 1).length / customerList.length) * 100)
    : 0;
  const avgCustomerSpend = customerList.length
    ? Math.round(customerList.reduce((acc, c) => acc + c.spend, 0) / customerList.length)
    : 0;

  /* ── Tasting Notes Chip Management ──────────────────────────── */
  const tastingNotesList = prodForm.tastingNotes
    ? prodForm.tastingNotes.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const addTastingNote = (note: string) => {
    const trimmed = note.trim();
    if (!trimmed || tastingNotesList.includes(trimmed)) return;
    const updated = [...tastingNotesList, trimmed].join(', ');
    setProdForm((prev) => ({ ...prev, tastingNotes: updated }));
    setChipInput('');
  };

  const removeTastingNote = (noteToRemove: string) => {
    const updated = tastingNotesList.filter((n) => n !== noteToRemove).join(', ');
    setProdForm((prev) => ({ ...prev, tastingNotes: updated }));
  };

  /* ── Product Operations ─────────────────────────────────────── */
  const openAddCoffeeModal = () => {
    setModalType('coffee');
    setProductModalTab('all');
    setProdForm(emptyProduct(true));
    setSelectedProduct(null);
    setChipInput('');
    setIsAddingProduct(true);
  };

  const openAddEquipmentModal = () => {
    setModalType('equipment');
    setProductModalTab('all');
    setProdForm(emptyProduct(false));
    setSelectedProduct(null);
    setChipInput('');
    setIsAddingProduct(true);
  };

  const openEditProductModal = (p: CoffeeProduct) => {
    const isCoffee = COFFEE_CATEGORY_SLUGS.includes(p.category) || p.roastLevel > 0;
    setModalType(isCoffee ? 'coffee' : 'equipment');
    setProductModalTab('all');
    setProdForm({ ...p });
    setSelectedProduct(p);
    setChipInput('');
    setIsAddingProduct(true);
  };

  const uploadFile = async (file: File) => {
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      setProdForm((prev) => ({ ...prev, imageUrl: d.data.url }));
    } catch (err: unknown) {
      setErrorMsg(`${t.uploadFailed}: ${err instanceof Error ? err.message : t.unknownError}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg('');
    try {
      const method = selectedProduct ? 'PUT' : 'POST';
      const payload = {
        ...prodForm,
        roastLevel: modalType === 'coffee' ? Number(prodForm.roastLevel || 50) : 0,
        price1kg: modalType === 'coffee' ? Number(prodForm.price1kg || 0) : 0,
      };
      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      fetchProducts();
      setSelectedProduct(null);
      setIsAddingProduct(false);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save product.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm(t.confirmDeactivate)) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      fetchProducts();
      setSelectedProduct(null);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to deactivate product.');
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Order Operations ───────────────────────────────────────── */
  const handleOrderAction = async (action: string) => {
    if (!selectedOrder) return;
    setActionLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          action,
          shippingProvider: action === 'create_fulfillment' ? orderCarrier : undefined,
          trackingNumber: action === 'ship_fulfillment' ? orderTracking : undefined,
        }),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      setSelectedOrder(d.data);
      setOrders((prev) => prev.map((o) => (o.id === d.data.id ? d.data : o)));
      setOrderTracking('');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred updating the order.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm(t.confirmDelete)) return;
    setActionLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, { method: 'DELETE' });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      if (selectedOrder?.id === id) setSelectedOrder(null);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to delete order.');
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Category Operations ────────────────────────────────────── */
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatLabel.trim()) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: newCatLabel }),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      setNewCatLabel('');
      fetchCategories();
    } catch {
      setErrorMsg('Failed to add category.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRenameCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingCat.id, label: editCatLabel }),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      setEditingCat(null);
      fetchCategories();
    } catch {
      setErrorMsg('Failed to rename category.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm(t.confirmDelete)) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      fetchCategories();
    } catch {
      setErrorMsg('Failed to delete category.');
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Shipping & Cargo Operations ────────────────────────────── */
  const handleToggleShipping = async (enabled: boolean) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/shipping-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      const d = await res.json();
      if (d.success) setShippingEnabled(d.data.enabled);
    } catch {
      setErrorMsg('Failed to update shipping configuration.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const method = editingProvider ? 'PUT' : 'POST';
      const body = editingProvider ? { id: editingProvider.id, ...providerForm } : providerForm;
      const res = await fetch('/api/admin/cargo-providers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      setShowProviderModal(false);
      setEditingProvider(null);
      setProviderForm({ name: '', fee: 0 });
      fetchShippingSettings();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save cargo provider.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProvider = async (id: string) => {
    if (!confirm(t.confirmDelete)) return;
    setActionLoading(true);
    try {
      await fetch(`/api/admin/cargo-providers?id=${id}`, { method: 'DELETE' });
      fetchShippingSettings();
    } catch {
      setErrorMsg('Failed to delete carrier.');
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Coupons Operations ─────────────────────────────────────── */
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const method = editingCoupon ? 'PUT' : 'POST';
      const payload = {
        ...couponForm,
        value: Number(couponForm.value),
        minOrderAmount: Number(couponForm.minOrderAmount),
        maxUses: couponForm.maxUses ? Number(couponForm.maxUses) : null,
        expiresAt: couponForm.expiresAt || null,
      };
      const res = await fetch('/api/admin/coupons', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCoupon ? { id: editingCoupon.id, ...payload } : payload),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      setShowCouponModal(false);
      setEditingCoupon(null);
      fetchCoupons();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save coupon.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm(t.confirmDelete)) return;
    setActionLoading(true);
    try {
      await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
      fetchCoupons();
    } catch {
      setErrorMsg('Failed to delete coupon.');
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Reviews Operations ─────────────────────────────────────── */
  const handleToggleReviewVisibility = async (r: Review) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: r.id, isHidden: !r.isHidden }),
      });
      const d = await res.json();
      if (d.success) {
        setReviews((prev) => prev.map((item) => (item.id === r.id ? { ...item, isHidden: !item.isHidden } : item)));
      }
    } catch {
      setErrorMsg('Failed to update review visibility.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm(t.confirmDelete)) return;
    setActionLoading(true);
    try {
      await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' });
      fetchReviews();
    } catch {
      setErrorMsg('Failed to delete review.');
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Blog Operations ────────────────────────────────────────── */
  const handleSaveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const isEdit = !!selectedBlogPost;
      const res = await fetch('/api/admin/blog', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { id: selectedBlogPost.id, ...blogForm } : blogForm),
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.error);
      setIsAddingBlogPost(false);
      setSelectedBlogPost(null);
      fetchBlogPosts();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to publish article.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm(t.confirmDelete)) return;
    setActionLoading(true);
    try {
      await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' });
      fetchBlogPosts();
    } catch {
      setErrorMsg('Failed to delete article.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className={styles.adminLayout}>
      {/* ── 1. Minimalist Sidebar Navigation ───────────────────── */}
      <aside className={styles.sidebar}>
        <Link href="/admin" className={styles.brandContainer}>
          <div className={styles.brandLogo}>
            <BrandLogoIcon size={22} />
          </div>
          <div className={styles.brandInfo}>
            <span className={styles.brandTitle}>{t.brandName}</span>
            <span className={styles.brandTagline}>{t.brandTag}</span>
          </div>
        </Link>

        {/* Section 1: Catalog & Products */}
        <div className={styles.navSection}>
          <span className={styles.navSectionTitle}>{t.navSectionMain}</span>
          <div className={styles.navGroup}>
            <button
              onClick={() => switchTab('overview')}
              className={`${styles.navItem} ${activeTab === 'overview' ? styles.navItemActive : ''}`}
            >
              <span className={styles.navIcon}><OverviewIcon size={17} /></span>
              <span>{t.navOverview}</span>
            </button>

            {/* Separated 1: Coffee Beans */}
            <button
              onClick={() => switchTab('coffee')}
              className={`${styles.navItem} ${activeTab === 'coffee' ? styles.navItemActive : ''}`}
            >
              <span className={styles.navIcon}><CoffeeBeanIcon size={17} /></span>
              <span>{t.navCoffee}</span>
              <span className={styles.navBadge} style={{ background: 'var(--ad-bg-subtle)', color: 'var(--ad-text-body)' }}>
                {coffeeProducts.length}
              </span>
            </button>

            {/* Separated 2: Machinery & Gear */}
            <button
              onClick={() => switchTab('equipment')}
              className={`${styles.navItem} ${activeTab === 'equipment' ? styles.navItemActive : ''}`}
            >
              <span className={styles.navIcon}><GearIcon size={17} /></span>
              <span>{t.navEquipment}</span>
              <span className={styles.navBadge} style={{ background: 'var(--ad-bg-subtle)', color: 'var(--ad-text-body)' }}>
                {equipmentProducts.length}
              </span>
            </button>
          </div>
        </div>

        {/* Section 2: Sales & Operations */}
        <div className={styles.navSection}>
          <span className={styles.navSectionTitle}>{t.navSectionSales}</span>
          <div className={styles.navGroup}>
            <button
              onClick={() => switchTab('orders')}
              className={`${styles.navItem} ${activeTab === 'orders' ? styles.navItemActive : ''}`}
            >
              <span className={styles.navIcon}><OrdersIcon size={17} /></span>
              <span>{t.navOrders}</span>
              {pendingOrdersCount > 0 && <span className={styles.navBadge}>{pendingOrdersCount}</span>}
            </button>

            <button
              onClick={() => switchTab('customers')}
              className={`${styles.navItem} ${activeTab === 'customers' ? styles.navItemActive : ''}`}
            >
              <span className={styles.navIcon}><UsersIcon size={17} /></span>
              <span>{t.navCustomers}</span>
            </button>
          </div>
        </div>

        {/* Section 3: Marketing & Content */}
        <div className={styles.navSection}>
          <span className={styles.navSectionTitle}>{t.navSectionMarketing}</span>
          <div className={styles.navGroup}>
            <button
              onClick={() => switchTab('coupons')}
              className={`${styles.navItem} ${activeTab === 'coupons' ? styles.navItemActive : ''}`}
            >
              <span className={styles.navIcon}><CouponIcon size={17} /></span>
              <span>{t.navCoupons}</span>
            </button>

            <button
              onClick={() => switchTab('reviews')}
              className={`${styles.navItem} ${activeTab === 'reviews' ? styles.navItemActive : ''}`}
            >
              <span className={styles.navIcon}><StarIcon size={17} /></span>
              <span>{t.navReviews}</span>
            </button>

            <button
              onClick={() => switchTab('blog')}
              className={`${styles.navItem} ${activeTab === 'blog' ? styles.navItemActive : ''}`}
            >
              <span className={styles.navIcon}><JournalIcon size={17} /></span>
              <span>{t.navBlog}</span>
            </button>
          </div>
        </div>

        {/* Section 4: Logistics & Storefront */}
        <div className={styles.navSection}>
          <span className={styles.navSectionTitle}>{t.navSectionSettings}</span>
          <div className={styles.navGroup}>
            <button
              onClick={() => switchTab('storefront')}
              className={`${styles.navItem} ${activeTab === 'storefront' ? styles.navItemActive : ''}`}
            >
              <span className={styles.navIcon}><PaletteIcon size={17} /></span>
              <span>{t.navStorefrontSettings}</span>
            </button>

            <button
              onClick={() => switchTab('shipping')}
              className={`${styles.navItem} ${activeTab === 'shipping' ? styles.navItemActive : ''}`}
            >
              <span className={styles.navIcon}><ShippingIcon size={17} /></span>
              <span>{t.navShipping}</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className={styles.sidebarFooter}>
          <div className={styles.langTogglePill}>
            <button
              onClick={() => changeLang('tr')}
              className={`${styles.langBtn} ${lang === 'tr' ? styles.langBtnActive : ''}`}
            >
              🇹🇷 Türkçe
            </button>
            <button
              onClick={() => changeLang('en')}
              className={`${styles.langBtn} ${lang === 'en' ? styles.langBtnActive : ''}`}
            >
              🇬🇧 English
            </button>
          </div>

          <Link href="/coffee" target="_blank" className={styles.storefrontLink}>
            <ExternalLinkIcon size={13} />
            <span>{t.navStorefront}</span>
          </Link>

          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogoutIcon size={14} />
            <span>{t.signOut}</span>
          </button>
        </div>
      </aside>

      {/* ── 2. Main Content Canvas ───────────────────────────── */}
      <div className={styles.mainContainer}>
        {/* Top Header */}
        <header className={styles.topHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>
              {activeTab === 'overview' && t.overviewTitle}
              {activeTab === 'coffee' && t.coffeeTitle}
              {activeTab === 'equipment' && t.equipmentTitle}
              {activeTab === 'orders' && t.ordersTitle}
              {activeTab === 'customers' && t.customersTitle}
              {activeTab === 'email' && t.emailStudioTitle}
              {activeTab === 'storefront' && t.storefrontTitle}
              {activeTab === 'shipping' && t.shippingTitle}
              {activeTab === 'coupons' && t.couponsTitle}
              {activeTab === 'reviews' && t.reviewsTitle}
              {activeTab === 'blog' && t.blogTitle}
            </h1>
            <p className={styles.headerSubtitle}>
              {activeTab === 'overview' && t.overviewSubtitle}
              {activeTab === 'coffee' && t.coffeeSubtitle}
              {activeTab === 'equipment' && t.equipmentSubtitle}
              {activeTab === 'orders' && t.ordersSubtitle}
              {activeTab === 'customers' && t.customersSubtitle}
              {activeTab === 'email' && t.emailStudioSubtitle}
              {activeTab === 'storefront' && t.storefrontSubtitle}
              {activeTab === 'shipping' && t.shippingSubtitle}
              {activeTab === 'coupons' && t.couponsSubtitle}
              {activeTab === 'reviews' && t.reviewsSubtitle}
              {activeTab === 'blog' && t.blogSubtitle}
            </p>
          </div>

          <div className={styles.headerSearchBox}>
            <span className={styles.searchIcon}><SearchIcon size={15} /></span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={
                activeTab === 'coffee'
                  ? t.searchCoffeePlaceholder
                  : activeTab === 'equipment'
                  ? t.searchEquipmentPlaceholder
                  : activeTab === 'orders'
                  ? t.searchOrdersPlaceholder
                  : t.searchCustomersPlaceholder
              }
              value={
                activeTab === 'coffee'
                  ? coffeeSearch
                  : activeTab === 'equipment'
                  ? equipmentSearch
                  : activeTab === 'orders'
                  ? orderSearch
                  : globalSearch
              }
              onChange={(e) => {
                if (activeTab === 'coffee') setCoffeeSearch(e.target.value);
                else if (activeTab === 'equipment') setEquipmentSearch(e.target.value);
                else if (activeTab === 'orders') setOrderSearch(e.target.value);
                else setGlobalSearch(e.target.value);
              }}
            />
          </div>

          <div className={styles.headerRight}>
            <div className={styles.liveIndicator}>
              <span className={styles.liveDot} />
              <span>{t.storeLive}</span>
            </div>

            <div className={styles.adminProfilePill}>
              <div className={styles.adminAvatar}>CE</div>
              <span className={styles.adminName}>Esto Roastery Admin</span>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className={styles.contentArea}>
          {errorMsg && (
            <div className={styles.alertBanner}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangleIcon size={16} />
                {errorMsg}
              </span>
              <button onClick={() => setErrorMsg('')} className={styles.alertClose}>
                <CloseIcon size={14} />
              </button>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════
              TAB 1: OVERVIEW
          ═════════════════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <>
              {/* 4 KPI Cards */}
              <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <span className={styles.kpiLabel}>{t.kpiRevenue}</span>
                    <div className={styles.kpiIconBox}><WalletMoneyIcon size={18} /></div>
                  </div>
                  <div className={styles.kpiValue}>{fmtCurrency(totalRevenue)}</div>
                  <div className={styles.kpiFooter}>
                    <span className={styles.kpiTrendPositive}>
                      <TrendingUpIcon size={13} /> +14.2%
                    </span>
                    <span>{t.vsLastWeek}</span>
                  </div>
                </div>

                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <span className={styles.kpiLabel}>{t.kpiOrders}</span>
                    <div className={styles.kpiIconBox}><OrdersIcon size={18} /></div>
                  </div>
                  <div className={styles.kpiValue}>{orders.length}</div>
                  <div className={styles.kpiFooter}>
                    <span className={styles.kpiTrendPositive}>
                      <TrendingUpIcon size={13} /> +8.5%
                    </span>
                    <span>{t.vsLastWeek}</span>
                  </div>
                </div>

                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <span className={styles.kpiLabel}>{t.kpiRoasts}</span>
                    <div className={styles.kpiIconBox}><CoffeeBeanIcon size={18} /></div>
                  </div>
                  <div className={styles.kpiValue}>{coffeeProducts.filter((p) => p.isActive).length}</div>
                  <div className={styles.kpiFooter}>
                    <span>{coffeeProducts.length} {t.roastsInCatalogSuffix}</span>
                  </div>
                </div>

                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <span className={styles.kpiLabel}>{t.kpiEquipment}</span>
                    <div className={styles.kpiIconBox}><GearIcon size={18} /></div>
                  </div>
                  <div className={styles.kpiValue}>{equipmentProducts.filter((p) => p.isActive).length}</div>
                  <div className={styles.kpiFooter}>
                    <span>{equipmentProducts.length} {t.machinesAndGearSuffix}</span>
                  </div>
                </div>
              </div>

              {/* Split: Revenue Chart & Top Sellers */}
              <div className={styles.overviewSplit}>
                <div className={styles.chartCard}>
                  <div className={styles.cardTitleRow}>
                    <h3 className={styles.cardTitle}>{t.last7DaysRevenue}</h3>
                    <span className={styles.kpiTrendPositive} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <TrendingUpIcon size={14} /> {t.activeVelocity}
                    </span>
                  </div>

                  <div className={styles.revenueBarsContainer}>
                    {last7Days.map((day) => {
                      const heightPercent = Math.min(100, Math.max(8, (day.revenue / maxDayRevenue) * 100));
                      return (
                        <div key={day.dateKey} className={styles.barCol}>
                          <div className={styles.barTrack}>
                            <div className={styles.barFill} style={{ height: `${heightPercent}%` }} />
                          </div>
                          <span className={styles.barDayLabel}>{day.dayName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Selling Roasts */}
                <div className={styles.topProductsCard}>
                  <div className={styles.cardTitleRow}>
                    <h3 className={styles.cardTitle}>{t.bestSellers}</h3>
                  </div>

                  <div className={styles.topList}>
                    {topSellingProducts.length === 0 ? (
                      <p className={styles.emptyStateSub}>{t.noSalesYet}</p>
                    ) : (
                      topSellingProducts.map((p, idx) => (
                        <div key={p.name} className={styles.topItem}>
                          <div className={styles.topRankNum}>#{idx + 1}</div>
                          <div className={styles.topInfo}>
                            <div className={styles.topName}>{p.name}</div>
                            <div className={styles.topMeta}>
                              {p.count} {t.unitsSold}
                            </div>
                          </div>
                          <div className={styles.topRevenue}>{fmtCurrency(p.revenue)}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Orders Live Stream */}
              <div className={styles.tableCard}>
                <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--ad-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className={styles.cardTitle}>{t.recentOrders}</h3>
                  <button onClick={() => switchTab('orders')} className={styles.ghostBtn}>
                    {t.viewAllOrdersBtn}
                  </button>
                </div>

                <div className={styles.tableWrap}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>{t.colReference}</th>
                        <th>{t.colDate}</th>
                        <th>{t.colCustomer}</th>
                        <th>{t.colTotal}</th>
                        <th>{t.colPayment}</th>
                        <th>{t.colFulfillment}</th>
                        <th>{t.colActions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className={styles.tableRow}>
                          <td style={{ fontWeight: 700, color: 'var(--ad-primary)' }}>
                            #{ord.id.slice(0, 8)}
                          </td>
                          <td>{fmtDate(ord.createdAt)}</td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{ord.email}</div>
                            <div style={{ fontSize: '11px', color: 'var(--ad-text-muted)' }}>{ord.phone || '—'}</div>
                          </td>
                          <td style={{ fontWeight: 700 }}>{fmtCurrency(ord.totalAmount)}</td>
                          <td>
                            <span className={`${styles.statusBadge} ${ord.payment_status === 'captured' ? styles.statusPaid : styles.statusPending}`}>
                              {fmtStatus('payment', ord.payment_status, lang)}
                            </span>
                          </td>
                          <td>
                            <span className={`${styles.statusBadge} ${ord.fulfillment_status === 'shipped' ? styles.statusShipped : ord.fulfillment_status === 'roasting' ? styles.statusRoasting : styles.statusPending}`}>
                              {fmtStatus('fulfillment', ord.fulfillment_status, lang)}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => {
                                setSelectedOrder(ord);
                                switchTab('orders');
                              }}
                              className={styles.secondaryBtn}
                            >
                              {t.manageOrder}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ═════════════════════════════════════════════════════════
              TAB 2: COFFEE BEANS & ROASTS (SEPARATED)
          ═════════════════════════════════════════════════════════ */}
          {activeTab === 'coffee' && (
            <div className={styles.inventoryLayout}>
              {/* Filter Sidebar Column */}
              <aside className={styles.filterSidebar}>
                <div className={styles.filterHeader}>
                  <span className={styles.filterTitle}>{t.filterRoastLevel}</span>
                  <button
                    onClick={() => {
                      setCoffeeCategoryFilter('all');
                      setCoffeeStockFilter('all');
                      setRoastLevelRange(100);
                      setCoffeeSearch('');
                    }}
                    className={styles.filterResetBtn}
                  >
                    {t.reset}
                  </button>
                </div>

                {/* Filter 1: Coffee Categories */}
                <div className={styles.filterSection}>
                  <span className={styles.filterSectionTitle}>{t.coffeeTypesFilterTitle}</span>
                  <div className={styles.filterOptionList}>
                    <label className={styles.filterCheckboxRow}>
                      <input
                        type="radio"
                        name="coffeeCatFilter"
                        checked={coffeeCategoryFilter === 'all'}
                        onChange={() => setCoffeeCategoryFilter('all')}
                        className={styles.filterCheckbox}
                      />
                      <span>{t.allRoasts}</span>
                      <span className={styles.filterCountTag}>{coffeeProducts.length}</span>
                    </label>
                    {coffeeCategories.map((c) => {
                      const count = coffeeProducts.filter((p) => p.category === c.slug).length;
                      return (
                        <label key={c.id} className={styles.filterCheckboxRow}>
                          <input
                            type="radio"
                            name="coffeeCatFilter"
                            checked={coffeeCategoryFilter === c.slug}
                            onChange={() => setCoffeeCategoryFilter(c.slug)}
                            className={styles.filterCheckbox}
                          />
                          <span>{c.label}</span>
                          <span className={styles.filterCountTag}>{count}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Filter 2: Stock Health */}
                <div className={styles.filterSection}>
                  <span className={styles.filterSectionTitle}>{t.filterStock}</span>
                  <div className={styles.filterOptionList}>
                    <label className={styles.filterCheckboxRow}>
                      <input
                        type="radio"
                        name="coffeeStockFilter"
                        checked={coffeeStockFilter === 'all'}
                        onChange={() => setCoffeeStockFilter('all')}
                        className={styles.filterCheckbox}
                      />
                      <span>{t.allStock}</span>
                    </label>
                    <label className={styles.filterCheckboxRow}>
                      <input
                        type="radio"
                        name="coffeeStockFilter"
                        checked={coffeeStockFilter === 'in'}
                        onChange={() => setCoffeeStockFilter('in')}
                        className={styles.filterCheckbox}
                      />
                      <span>{t.inStock}</span>
                    </label>
                    <label className={styles.filterCheckboxRow}>
                      <input
                        type="radio"
                        name="coffeeStockFilter"
                        checked={coffeeStockFilter === 'low'}
                        onChange={() => setCoffeeStockFilter('low')}
                        className={styles.filterCheckbox}
                      />
                      <span>{t.lowStock}</span>
                    </label>
                  </div>
                </div>

                {/* Filter 3: Roast Level Slider */}
                <div className={styles.filterSection}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={styles.filterSectionTitle}>{t.filterRoastLevel}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ad-primary)' }}>
                      ≤ {roastLevelRange}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={roastLevelRange}
                    onChange={(e) => setRoastLevelRange(Number(e.target.value))}
                    className={styles.roastRangeSlider}
                  />
                  <div className={styles.sliderLabels}>
                    <span>{t.lightRoastPct}</span>
                    <span>{t.mediumRoastPct}</span>
                    <span>{t.darkRoastPct}</span>
                  </div>
                </div>
              </aside>

              {/* Coffee Main Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className={styles.toolbarRow}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className={styles.viewSwitchGroup}>
                      <button
                        onClick={() => setCoffeeViewMode('grid')}
                        className={`${styles.viewSwitchBtn} ${coffeeViewMode === 'grid' ? styles.viewSwitchBtnActive : ''}`}
                      >
                        <GridViewIcon size={14} />
                        <span>{t.viewGrid}</span>
                      </button>
                      <button
                        onClick={() => setCoffeeViewMode('table')}
                        className={`${styles.viewSwitchBtn} ${coffeeViewMode === 'table' ? styles.viewSwitchBtnActive : ''}`}
                      >
                        <TableViewIcon size={14} />
                        <span>{t.viewTable}</span>
                      </button>
                    </div>

                    <span style={{ fontSize: '13px', color: 'var(--ad-text-muted)' }}>
                      {t.showingLabel} <strong>{filteredCoffee.length}</strong> {t.coffeeRoastsWord}
                    </span>
                  </div>

                  <div className={styles.toolbarActions}>
                    <button onClick={() => setShowCategoryManager(true)} className={styles.secondaryBtn}>
                      <TagIcon size={14} />
                      <span>{t.manageCategories}</span>
                    </button>
                    <button onClick={openAddCoffeeModal} className={styles.primaryBtn}>
                      <PlusIcon size={15} />
                      <span>{t.addCoffeeRoast}</span>
                    </button>
                  </div>
                </div>

                {filteredCoffee.length === 0 && (
                  <div className={styles.emptyState}>
                    <span className={styles.emptyStateIcon}><CoffeeBeanIcon size={38} strokeWidth={1.2} /></span>
                    <span className={styles.emptyStateText}>{t.noCoffeeFound}</span>
                    <button onClick={openAddCoffeeModal} className={styles.primaryBtn} style={{ marginTop: '8px' }}>
                      <PlusIcon size={14} />
                      <span>{t.addCoffeeRoast}</span>
                    </button>
                  </div>
                )}

                {/* Grid Mode */}
                {coffeeViewMode === 'grid' && (
                  <div className={styles.productGrid}>
                    {filteredCoffee.map((p) => {
                      const dotsCount = Math.min(5, Math.max(1, Math.round((p.roastLevel || 50) / 20)));
                      const isLow = p.stock > 0 && p.stock <= 5;
                      const isOut = p.stock <= 0;

                      return (
                        <div key={p.id} className={`${styles.productCard} ${!p.isActive ? styles.productCardInactive : ''}`}>
                          <div className={styles.productImageWrap}>
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.name} className={styles.productImg} />
                            ) : (
                              <div style={{ color: 'var(--ad-text-light)' }}>
                                <CoffeeBeanIcon size={42} strokeWidth={1.2} />
                              </div>
                            )}
                            <span className={styles.productCardCategoryBadge}>{p.category}</span>
                            <span
                              className={`${styles.productCardStockBadge} ${
                                isOut ? styles.badgeOutOfStock : isLow ? styles.badgeLowStock : styles.badgeInStock
                              }`}
                            >
                              {isOut ? t.soldOutBadge : `${p.stock} ${t.inStockSuffix}`}
                            </span>
                          </div>

                          <div className={styles.productCardBody}>
                            <h4 className={styles.productCardTitle}>{p.name}</h4>
                            <div className={styles.productCardOrigin}>
                              <PinLocationIcon size={12} />
                              <span>{p.origin || 'Single Origin'} · {p.altitude || 'Highland'}</span>
                            </div>

                            <div className={styles.roastLevelMeter}>
                              {[1, 2, 3, 4, 5].map((dot) => (
                                <span key={dot} className={`${styles.roastDot} ${dot <= dotsCount ? styles.roastDotFilled : ''}`} />
                              ))}
                              <span className={styles.roastMeterText}>{p.roastLevel || 50}% {t.roastPctSuffix}</span>
                            </div>

                            <div className={styles.productCardPrices}>
                              <div>
                                <span className={styles.price250g}>{fmtCurrency(p.price)}</span>
                                <span style={{ fontSize: '11px', color: 'var(--ad-text-muted)' }}> / 250g</span>
                              </div>
                              {p.price1kg > 0 && <span className={styles.price1kg}>{fmtCurrency(p.price1kg)} (1kg)</span>}
                            </div>

                            <div className={styles.productCardActions}>
                              <button onClick={() => setBagLabelProduct(p)} className={styles.secondaryBtn} title={t.printThermalLabel}>
                                <BarcodeIcon size={14} />
                              </button>
                              <button onClick={() => openEditProductModal(p)} className={styles.cardEditBtn}>
                                <EditPencilIcon size={13} />
                                <span>{t.edit}</span>
                              </button>
                              <button onClick={() => handleDeleteProduct(p.id)} className={styles.cardDeleteBtn}>
                                <TrashIcon size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Table Mode */}
                {coffeeViewMode === 'table' && (
                  <div className={styles.tableCard}>
                    <div className={styles.tableWrap}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            <th>{t.colImage}</th>
                            <th>{t.colName}</th>
                            <th>{t.colCategory}</th>
                            <th>{t.colPrice}</th>
                            <th>{t.colStock}</th>
                            <th>{t.colRoastMeter}</th>
                            <th>{t.colStatus}</th>
                            <th>{t.colActions}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCoffee.map((p) => (
                            <tr key={p.id} className={styles.tableRow}>
                              <td>
                                {p.imageUrl ? (
                                  <img src={p.imageUrl} alt={p.name} className={styles.tableThumbnail} />
                                ) : (
                                  <div className={styles.tableThumbnail} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ad-text-light)' }}>
                                    <CoffeeBeanIcon size={20} />
                                  </div>
                                )}
                              </td>
                              <td>
                                <div style={{ fontWeight: 700 }}>{p.name}</div>
                                <div style={{ fontSize: '11.5px', color: 'var(--ad-text-muted)' }}>
                                  {p.origin} · {p.varietal}
                                </div>
                              </td>
                              <td>
                                <span style={{ padding: '3px 8px', background: 'var(--ad-bg-subtle)', borderRadius: '6px', fontSize: '11.5px', fontWeight: 600 }}>
                                  {p.category}
                                </span>
                              </td>
                              <td style={{ fontWeight: 700 }}>
                                {fmtCurrency(p.price)}
                                {p.price1kg > 0 && (
                                  <span style={{ fontSize: '11px', color: 'var(--ad-text-muted)', display: 'block', fontWeight: 400 }}>
                                    1kg: {fmtCurrency(p.price1kg)}
                                  </span>
                                )}
                              </td>
                              <td>
                                <span className={`${styles.statusBadge} ${p.stock <= 0 ? styles.statusCanceled : p.stock <= 5 ? styles.statusPending : styles.statusActive}`}>
                                  {p.stock <= 0 ? t.outOfStockBadge : `${p.stock} ${t.unitsSuffix}`}
                                </span>
                              </td>
                              <td>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#78350f' }}>{p.roastLevel}%</span>
                              </td>
                              <td>
                                <span className={`${styles.statusBadge} ${p.isActive ? styles.statusActive : styles.statusHidden}`}>
                                  {p.isActive ? t.active : t.hidden}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button onClick={() => setBagLabelProduct(p)} className={styles.secondaryBtn} title={t.printThermalLabel}>
                                    <BarcodeIcon size={14} />
                                  </button>
                                  <button onClick={() => openEditProductModal(p)} className={styles.secondaryBtn}>
                                    <EditPencilIcon size={13} />
                                    <span>{t.edit}</span>
                                  </button>
                                  <button onClick={() => handleDeleteProduct(p.id)} className={styles.cardDeleteBtn}>
                                    <TrashIcon size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════
              TAB 3: MACHINERY, EQUIPMENT & ACCESSORIES (SEPARATED)
          ═════════════════════════════════════════════════════════ */}
          {activeTab === 'equipment' && (
            <div className={styles.inventoryLayout}>
              {/* Equipment Filter Sidebar */}
              <aside className={styles.filterSidebar}>
                <div className={styles.filterHeader}>
                  <span className={styles.filterTitle}>{t.gearCategoriesFilterTitle}</span>
                  <button
                    onClick={() => {
                      setEquipmentCategoryFilter('all');
                      setEquipmentStockFilter('all');
                      setEquipmentSearch('');
                    }}
                    className={styles.filterResetBtn}
                  >
                    {t.reset}
                  </button>
                </div>

                <div className={styles.filterSection}>
                  <div className={styles.filterOptionList}>
                    <label className={styles.filterCheckboxRow}>
                      <input
                        type="radio"
                        name="equipCatFilter"
                        checked={equipmentCategoryFilter === 'all'}
                        onChange={() => setEquipmentCategoryFilter('all')}
                        className={styles.filterCheckbox}
                      />
                      <span>{t.allEquipment}</span>
                      <span className={styles.filterCountTag}>{equipmentProducts.length}</span>
                    </label>
                    {equipmentCategories.map((c) => {
                      const count = equipmentProducts.filter((p) => p.category === c.slug).length;
                      return (
                        <label key={c.id} className={styles.filterCheckboxRow}>
                          <input
                            type="radio"
                            name="equipCatFilter"
                            checked={equipmentCategoryFilter === c.slug}
                            onChange={() => setEquipmentCategoryFilter(c.slug)}
                            className={styles.filterCheckbox}
                          />
                          <span>{c.label}</span>
                          <span className={styles.filterCountTag}>{count}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.filterSection}>
                  <span className={styles.filterSectionTitle}>{t.filterStock}</span>
                  <div className={styles.filterOptionList}>
                    <label className={styles.filterCheckboxRow}>
                      <input
                        type="radio"
                        name="equipStockFilter"
                        checked={equipmentStockFilter === 'all'}
                        onChange={() => setEquipmentStockFilter('all')}
                        className={styles.filterCheckbox}
                      />
                      <span>{t.allStock}</span>
                    </label>
                    <label className={styles.filterCheckboxRow}>
                      <input
                        type="radio"
                        name="equipStockFilter"
                        checked={equipmentStockFilter === 'in'}
                        onChange={() => setEquipmentStockFilter('in')}
                        className={styles.filterCheckbox}
                      />
                      <span>{t.inStock}</span>
                    </label>
                    <label className={styles.filterCheckboxRow}>
                      <input
                        type="radio"
                        name="equipStockFilter"
                        checked={equipmentStockFilter === 'low'}
                        onChange={() => setEquipmentStockFilter('low')}
                        className={styles.filterCheckbox}
                      />
                      <span>{t.lowStock}</span>
                    </label>
                  </div>
                </div>
              </aside>

              {/* Equipment Main Area */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className={styles.toolbarRow}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className={styles.viewSwitchGroup}>
                      <button
                        onClick={() => setEquipmentViewMode('grid')}
                        className={`${styles.viewSwitchBtn} ${equipmentViewMode === 'grid' ? styles.viewSwitchBtnActive : ''}`}
                      >
                        <GridViewIcon size={14} />
                        <span>{t.viewGrid}</span>
                      </button>
                      <button
                        onClick={() => setEquipmentViewMode('table')}
                        className={`${styles.viewSwitchBtn} ${equipmentViewMode === 'table' ? styles.viewSwitchBtnActive : ''}`}
                      >
                        <TableViewIcon size={14} />
                        <span>{t.viewTable}</span>
                      </button>
                    </div>

                    <span style={{ fontSize: '13px', color: 'var(--ad-text-muted)' }}>
                      {t.showingLabel} <strong>{filteredEquipment.length}</strong> {t.gearSkusWord}
                    </span>
                  </div>

                  <div className={styles.toolbarActions}>
                    <button onClick={() => setShowCategoryManager(true)} className={styles.secondaryBtn}>
                      <TagIcon size={14} />
                      <span>{t.manageCategories}</span>
                    </button>
                    <button onClick={openAddEquipmentModal} className={styles.primaryBtn}>
                      <PlusIcon size={15} />
                      <span>{t.addEquipment}</span>
                    </button>
                  </div>
                </div>

                {filteredEquipment.length === 0 && (
                  <div className={styles.emptyState}>
                    <span className={styles.emptyStateIcon}><GearIcon size={38} strokeWidth={1.2} /></span>
                    <span className={styles.emptyStateText}>{t.noEquipmentFound}</span>
                    <button onClick={openAddEquipmentModal} className={styles.primaryBtn} style={{ marginTop: '8px' }}>
                      <PlusIcon size={14} />
                      <span>{t.addEquipment}</span>
                    </button>
                  </div>
                )}

                {/* Equipment Grid */}
                {equipmentViewMode === 'grid' && (
                  <div className={styles.productGrid}>
                    {filteredEquipment.map((p) => {
                      const isLow = p.stock > 0 && p.stock <= 5;
                      const isOut = p.stock <= 0;

                      return (
                        <div key={p.id} className={`${styles.productCard} ${!p.isActive ? styles.productCardInactive : ''}`}>
                          <div className={styles.productImageWrap}>
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.name} className={styles.productImg} />
                            ) : (
                              <div style={{ color: 'var(--ad-text-light)' }}>
                                <GearIcon size={42} strokeWidth={1.2} />
                              </div>
                            )}
                            <span className={styles.productCardCategoryBadge}>{p.category}</span>
                            <span
                              className={`${styles.productCardStockBadge} ${
                                isOut ? styles.badgeOutOfStock : isLow ? styles.badgeLowStock : styles.badgeInStock
                              }`}
                            >
                              {isOut ? t.soldOutBadge : `${p.stock} ${t.unitsSuffix}`}
                            </span>
                          </div>

                          <div className={styles.productCardBody}>
                            <h4 className={styles.productCardTitle}>{p.name}</h4>
                            <p style={{ fontSize: '11.5px', color: 'var(--ad-text-muted)', margin: '2px 0', lineHeight: 1.4, maxHeight: '32px', overflow: 'hidden' }}>
                              {p.description || 'Commercial grade equipment & accessories.'}
                            </p>

                            <div className={styles.productCardPrices}>
                              <span className={styles.price250g}>{fmtCurrency(p.price)}</span>
                              <span className={`${styles.statusBadge} ${p.isActive ? styles.statusActive : styles.statusHidden}`}>
                                {p.isActive ? t.active : t.hidden}
                              </span>
                            </div>

                            <div className={styles.productCardActions}>
                              <button onClick={() => openEditProductModal(p)} className={styles.cardEditBtn}>
                                <EditPencilIcon size={13} />
                                <span>{t.edit}</span>
                              </button>
                              <button onClick={() => handleDeleteProduct(p.id)} className={styles.cardDeleteBtn}>
                                <TrashIcon size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Equipment Table */}
                {equipmentViewMode === 'table' && (
                  <div className={styles.tableCard}>
                    <div className={styles.tableWrap}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            <th>{t.colImage}</th>
                            <th>{t.colName}</th>
                            <th>{t.colCategory}</th>
                            <th>{t.colEquipmentPrice}</th>
                            <th>{t.colStock}</th>
                            <th>{t.colStatus}</th>
                            <th>{t.colActions}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredEquipment.map((p) => (
                            <tr key={p.id} className={styles.tableRow}>
                              <td>
                                {p.imageUrl ? (
                                  <img src={p.imageUrl} alt={p.name} className={styles.tableThumbnail} />
                                ) : (
                                  <div className={styles.tableThumbnail} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ad-text-light)' }}>
                                    <GearIcon size={20} />
                                  </div>
                                )}
                              </td>
                              <td>
                                <div style={{ fontWeight: 700 }}>{p.name}</div>
                                <div style={{ fontSize: '11.5px', color: 'var(--ad-text-muted)' }}>
                                  SKU: <code>{p.id}</code>
                                </div>
                              </td>
                              <td>
                                <span style={{ padding: '3px 8px', background: 'var(--ad-bg-subtle)', borderRadius: '6px', fontSize: '11.5px', fontWeight: 600 }}>
                                  {p.category}
                                </span>
                              </td>
                              <td style={{ fontWeight: 700 }}>{fmtCurrency(p.price)}</td>
                              <td>
                                <span className={`${styles.statusBadge} ${p.stock <= 0 ? styles.statusCanceled : p.stock <= 5 ? styles.statusPending : styles.statusActive}`}>
                                  {p.stock <= 0 ? t.outOfStockBadge : `${p.stock} ${t.unitsSuffix}`}
                                </span>
                              </td>
                              <td>
                                <span className={`${styles.statusBadge} ${p.isActive ? styles.statusActive : styles.statusHidden}`}>
                                  {p.isActive ? t.active : t.hidden}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button onClick={() => openEditProductModal(p)} className={styles.secondaryBtn}>
                                    <EditPencilIcon size={13} />
                                    <span>{t.edit}</span>
                                  </button>
                                  <button onClick={() => handleDeleteProduct(p.id)} className={styles.cardDeleteBtn}>
                                    <TrashIcon size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════
              TAB 4: ORDERS QUEUE
          ═════════════════════════════════════════════════════════ */}
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div className={styles.pipelineTabs}>
                  {[
                    { key: 'all', label: t.allOrders, count: orders.length },
                    { key: 'awaiting_payment', label: t.awaitingPayment, count: orders.filter((o) => o.payment_status === 'awaiting').length },
                    { key: 'roasting', label: t.roasting, count: orders.filter((o) => o.fulfillment_status === 'roasting').length },
                    { key: 'packed', label: t.packed, count: orders.filter((o) => o.fulfillment_status === 'fulfilled').length },
                    { key: 'shipped', label: t.shipped, count: orders.filter((o) => o.fulfillment_status === 'shipped').length },
                    { key: 'completed', label: t.completed, count: orders.filter((o) => o.status === 'completed').length },
                    { key: 'canceled', label: t.canceled, count: orders.filter((o) => o.status === 'canceled').length },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setOrderStatusFilter(tab.key)}
                      className={`${styles.pipelineTab} ${orderStatusFilter === tab.key ? styles.pipelineTabActive : ''}`}
                    >
                      <span>{tab.label}</span>
                      <span className={styles.pipelineCount}>{tab.count}</span>
                    </button>
                  ))}
                </div>
                <button onClick={handleExportOrdersExcel} className={styles.ghostBtn} disabled={filteredOrders.length === 0}>
                  {t.exportToExcel}
                </button>
              </div>

              <div className={styles.tableCard}>
                <div className={styles.tableWrap}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>{t.colReference}</th>
                        <th>{t.colDate}</th>
                        <th>{t.colCustomer}</th>
                        <th>{t.colItems}</th>
                        <th>{t.colTotal}</th>
                        <th>{t.colPayment}</th>
                        <th>{t.colFulfillment}</th>
                        <th>{t.colActions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '40px' }}>
                            <span style={{ color: 'var(--ad-text-muted)' }}>{t.noOrders}</span>
                          </td>
                        </tr>
                      ) : (
                        paginatedOrders.map((ord) => (
                          <tr key={ord.id} className={styles.tableRow}>
                            <td style={{ fontWeight: 700, color: 'var(--ad-primary)' }}>
                              #{ord.id.slice(0, 8)}
                            </td>
                            <td>{fmtDate(ord.createdAt)}</td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{ord.email}</div>
                              <div style={{ fontSize: '11px', color: 'var(--ad-text-muted)' }}>
                                {ord.phone || t.noPhoneFallback}
                              </div>
                            </td>
                            <td style={{ maxWidth: '220px' }}>
                              <div
                                style={{ fontSize: '12px', color: 'var(--ad-text-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                title={ord.items?.map((it) => `${it.name} ×${it.quantity}`).join(', ')}
                              >
                                {ord.items?.map((it) => `${it.name} ×${it.quantity}`).join(', ') || '—'}
                              </div>
                            </td>
                            <td style={{ fontWeight: 700 }}>{fmtCurrency(ord.totalAmount)}</td>
                            <td>
                              <span
                                className={`${styles.statusBadge} ${
                                  ord.payment_status === 'captured'
                                    ? styles.statusPaid
                                    : ord.payment_status === 'refunded'
                                    ? styles.statusRefunded
                                    : styles.statusPending
                                }`}
                              >
                                {fmtStatus('payment', ord.payment_status, lang)}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`${styles.statusBadge} ${
                                  ord.fulfillment_status === 'shipped'
                                    ? styles.statusShipped
                                    : ord.fulfillment_status === 'roasting'
                                    ? styles.statusRoasting
                                    : ord.fulfillment_status === 'fulfilled'
                                    ? styles.statusPacked
                                    : styles.statusPending
                                }`}
                              >
                                {fmtStatus('fulfillment', ord.fulfillment_status, lang)}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button onClick={() => setSelectedOrder(ord)} className={styles.primaryBtn}>
                                  {t.manageOrder}
                                </button>
                                <button
                                  onClick={() => handleDeleteOrder(ord.id)}
                                  className={styles.cardDeleteBtn}
                                  title={t.confirmDelete}
                                >
                                  <TrashIcon size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {filteredOrders.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', padding: '14px 20px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--ad-text-muted)' }}>
                      {t.paginationPageOf.replace('{page}', String(orderPageClamped)).replace('{total}', String(orderTotalPages))}
                    </span>
                    <button
                      onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                      disabled={orderPageClamped <= 1}
                      className={styles.ghostBtn}
                    >
                      {t.paginationPrev}
                    </button>
                    <button
                      onClick={() => setOrderPage((p) => Math.min(orderTotalPages, p + 1))}
                      disabled={orderPageClamped >= orderTotalPages}
                      className={styles.ghostBtn}
                    >
                      {t.paginationNext}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════
              TAB 5: PATRONS & CUSTOMER CRM
          ═════════════════════════════════════════════════════════ */}
          {activeTab === 'customers' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <span className={styles.kpiLabel}>{t.totalCustomers}</span>
                    <div className={styles.kpiIconBox}><UsersIcon size={18} /></div>
                  </div>
                  <div className={styles.kpiValue}>{customerList.length}</div>
                </div>

                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <span className={styles.kpiLabel}>{t.repeatRate}</span>
                    <div className={styles.kpiIconBox}><RefreshIcon size={18} /></div>
                  </div>
                  <div className={styles.kpiValue}>{repeatCustomerRate}%</div>
                </div>

                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <span className={styles.kpiLabel}>{t.avgLifetimeSpend}</span>
                    <div className={styles.kpiIconBox}><WalletMoneyIcon size={18} /></div>
                  </div>
                  <div className={styles.kpiValue}>{fmtCurrency(avgCustomerSpend)}</div>
                </div>
              </div>

              <div className={styles.tableCard}>
                <div className={styles.tableWrap}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>{t.colCustomer}</th>
                        <th>{t.phone}</th>
                        <th>{t.colOrdersCount}</th>
                        <th>{t.colLifetimeSpend}</th>
                        <th>{t.colLastOrder}</th>
                        <th>{t.colCustomerType}</th>
                        <th>{t.colActions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerList.map((cust) => (
                        <tr key={cust.email} className={styles.tableRow}>
                          <td>
                            <div style={{ fontWeight: 700 }}>{cust.email}</div>
                          </td>
                          <td>{cust.phone}</td>
                          <td>
                            <strong>{cust.count}</strong> {t.ordersSuffix}
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--ad-primary)' }}>
                            {fmtCurrency(cust.spend)}
                          </td>
                          <td>{fmtDate(cust.lastOrder)}</td>
                          <td>
                            <span className={`${styles.statusBadge} ${cust.count > 1 ? styles.statusActive : styles.statusPending}`}>
                              {cust.count > 1 ? t.vipRepeat : t.newCustomer}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => {
                                setOrderSearch(cust.email);
                                switchTab('orders');
                              }}
                              className={styles.secondaryBtn}
                            >
                              {t.viewOrdersBtn}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════
              TAB 6: LOGISTICS & SHIPPING
          ═════════════════════════════════════════════════════════ */}
          {activeTab === 'shipping' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className={styles.switchContainer}>
                <div className={styles.switchLabelBlock}>
                  <span className={styles.switchTitle}>{t.chargeShippingLabel}</span>
                  <span className={styles.switchSubtitle}>
                    {shippingEnabled ? t.shippingEnabledNote : t.shippingDisabledNote}
                  </span>
                </div>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={shippingEnabled}
                    onChange={(e) => handleToggleShipping(e.target.checked)}
                  />
                  <span className={styles.toggleSlider} />
                </label>
              </div>

              <div className={styles.toolbarRow}>
                <span style={{ fontSize: '14px', color: 'var(--ad-text-muted)' }}>
                  {t.configuredCourierProviders} ({cargoProviders.length})
                </span>
                <button onClick={() => setShowProviderModal(true)} className={styles.primaryBtn}>
                  <PlusIcon size={14} />
                  <span>{t.addProvider}</span>
                </button>
              </div>

              <div className={styles.bentoGrid}>
                {cargoProviders.map((cp) => (
                  <div key={cp.id} className={styles.bentoCard}>
                    <div className={styles.bentoCardHeader}>
                      <div className={styles.bentoIconBox}><ShippingIcon size={18} /></div>
                      <span className={`${styles.statusBadge} ${cp.isActive ? styles.statusActive : styles.statusHidden}`}>
                        {cp.isActive ? t.active : t.hidden}
                      </span>
                    </div>

                    <div>
                      <h4 className={styles.bentoCardTitle}>{cp.name}</h4>
                      <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ad-primary)', display: 'block', marginTop: '6px' }}>
                        {fmtCurrency(cp.fee)}
                      </span>
                    </div>

                    <div className={styles.bentoCardFooter}>
                      <button
                        onClick={() => {
                          setEditingProvider(cp);
                          setProviderForm({ name: cp.name, fee: cp.fee });
                          setShowProviderModal(true);
                        }}
                        className={styles.secondaryBtn}
                      >
                        <EditPencilIcon size={13} />
                        <span>{t.edit}</span>
                      </button>
                      <button onClick={() => handleDeleteProvider(cp.id)} className={styles.cardDeleteBtn}>
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════
              TAB 7: DISCOUNT COUPONS
          ═════════════════════════════════════════════════════════ */}
          {activeTab === 'coupons' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className={styles.toolbarRow}>
                <span style={{ fontSize: '14px', color: 'var(--ad-text-muted)' }}>
                  {t.activePromoCodesLabel} ({coupons.length})
                </span>
                <button onClick={() => setShowCouponModal(true)} className={styles.primaryBtn}>
                  <PlusIcon size={14} />
                  <span>{t.addCoupon}</span>
                </button>
              </div>

              <div className={styles.bentoGrid}>
                {coupons.map((c) => (
                  <div key={c.id} className={styles.bentoCard}>
                    <div className={styles.bentoCardHeader}>
                      <div className={styles.bentoIconBox}><CouponIcon size={18} /></div>
                      <span className={`${styles.statusBadge} ${c.isActive ? styles.statusActive : styles.statusHidden}`}>
                        {c.isActive ? t.active : t.hidden}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--ad-text-main)' }}>
                        {c.code}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ad-primary)', marginTop: '4px' }}>
                        {c.type === 'percent' ? `%${c.value} ${t.offSuffix}` : `₺${c.value} ${t.offSuffix}`}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--ad-text-muted)', marginTop: '4px' }}>
                        {t.minOrderShortLabel} {fmtCurrency(c.minOrderAmount)} · {t.usesShortLabel} {c.usedCount}/{c.maxUses || '∞'}
                      </div>
                    </div>

                    <div className={styles.bentoCardFooter}>
                      <span style={{ fontSize: '11px', color: 'var(--ad-text-muted)' }}>
                        {c.expiresAt ? `${t.expiresPrefix} ${fmtDate(c.expiresAt)}` : t.noExpiry}
                      </span>
                      <button onClick={() => handleDeleteCoupon(c.id)} className={styles.cardDeleteBtn}>
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════
              TAB 8: RATINGS & REVIEWS
          ═════════════════════════════════════════════════════════ */}
          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className={styles.tableCard}>
                <div className={styles.tableWrap}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>{t.colProduct}</th>
                        <th>{t.colCustomer}</th>
                        <th>{t.colRating}</th>
                        <th>{t.colReview}</th>
                        <th>{t.colVisibility}</th>
                        <th>{t.colActions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                            <span style={{ color: 'var(--ad-text-muted)' }}>{t.noReviewsRecorded}</span>
                          </td>
                        </tr>
                      ) : (
                        reviews.map((rev) => (
                          <tr key={rev.id} className={styles.tableRow}>
                            <td style={{ fontWeight: 700 }}>{rev.productName || t.coffeeRoastFallback}</td>
                            <td>
                              <div>{rev.customerName || t.reviewerFallback}</div>
                              <div style={{ fontSize: '11px', color: 'var(--ad-text-muted)' }}>{rev.customerEmail}</div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '2px', color: '#e58227' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <StarIcon
                                    key={star}
                                    size={13}
                                    fill={star <= (rev.rating || 5) ? '#e58227' : 'none'}
                                    stroke={star <= (rev.rating || 5) ? '#e58227' : 'var(--ad-border-light)'}
                                  />
                                ))}
                              </div>
                            </td>
                            <td style={{ maxWidth: '300px' }}>
                              <div style={{ fontWeight: 600, fontSize: '12.5px' }}>{rev.title}</div>
                              <div style={{ fontSize: '12px', color: 'var(--ad-text-muted)' }}>{rev.body}</div>
                            </td>
                            <td>
                              <span className={`${styles.statusBadge} ${!rev.isHidden ? styles.statusActive : styles.statusHidden}`}>
                                {!rev.isHidden ? t.visible : t.hide}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button onClick={() => handleToggleReviewVisibility(rev)} className={styles.secondaryBtn}>
                                  {rev.isHidden ? t.show : t.hide}
                                </button>
                                <button onClick={() => handleDeleteReview(rev.id)} className={styles.cardDeleteBtn}>
                                  <TrashIcon size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════
              TAB 9: BLOG CMS
          ═════════════════════════════════════════════════════════ */}
          {activeTab === 'blog' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className={styles.toolbarRow}>
                <span style={{ fontSize: '14px', color: 'var(--ad-text-muted)' }}>
                  {t.publishedJournalStories} ({blogPosts.length})
                </span>
                <button
                  onClick={() => {
                    setSelectedBlogPost(null);
                    setBlogForm({
                      titleEn: '',
                      titleTr: '',
                      contentEn: '',
                      contentTr: '',
                      category: 'culture',
                      imageUrl: '',
                    });
                    setIsAddingBlogPost(true);
                  }}
                  className={styles.primaryBtn}
                >
                  <PlusIcon size={14} />
                  <span>{t.addBlogPost}</span>
                </button>
              </div>

              <div className={styles.bentoGrid}>
                {blogPosts.map((post) => (
                  <div key={post.id} className={styles.bentoCard}>
                    {post.imageUrl && (
                      <div style={{ height: '140px', borderRadius: '10px', overflow: 'hidden' }}>
                        <img src={post.imageUrl} alt={post.titleTr} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--ad-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {BLOG_CATEGORY_LABELS[post.category]?.[lang] || post.category}
                      </span>
                      <h4 className={styles.bentoCardTitle} style={{ marginTop: '4px' }}>
                        {lang === 'tr' ? post.titleTr || post.titleEn : post.titleEn || post.titleTr}
                      </h4>
                      <span style={{ fontSize: '11.5px', color: 'var(--ad-text-muted)' }}>
                        {fmtDate(post.createdAt)}
                      </span>
                    </div>

                    <div className={styles.bentoCardFooter}>
                      <button
                        onClick={() => {
                          setSelectedBlogPost(post);
                          setBlogForm(post);
                          setIsAddingBlogPost(true);
                        }}
                        className={styles.secondaryBtn}
                      >
                        <EditPencilIcon size={13} />
                        <span>{t.edit}</span>
                      </button>
                      <button onClick={() => handleDeleteBlogPost(post.id)} className={styles.cardDeleteBtn}>
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════
              TAB 10: EMAIL STUDIO & AUTOMATIONS
          ═════════════════════════════════════════════════════════ */}
          {activeTab === 'email' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Template Selection Tabs */}
              <div className={styles.emailTemplatePicker}>
                {(['order_confirmation', 'order_shipped', 'review_request', 'refill_reminder', 'abandoned_cart', 'welcome_series'] as const).map((key) => {
                  const tmpl = emailTemplates[key] || DEFAULT_EMAIL_TEMPLATES[key];
                  const isEnabled = tmpl?.enabled !== false;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedEmailKey(key)}
                      className={`${styles.emailTemplateTab} ${selectedEmailKey === key ? styles.emailTemplateTabActive : ''}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {key === 'order_confirmation' && <FlameRoastIcon size={16} />}
                          {key === 'order_shipped' && <ShippingIcon size={16} />}
                          {key === 'review_request' && <StarIcon size={16} />}
                          {key === 'refill_reminder' && <CoffeeBeanIcon size={16} />}
                          {key === 'abandoned_cart' && <TagIcon size={16} />}
                          {key === 'welcome_series' && <SparklesIcon size={16} />}
                          <span className={styles.emailTabTitle}>{tmpl?.name || key}</span>
                        </div>
                        <span className={isEnabled ? styles.emailStatusPillActive : styles.emailStatusPillPaused}>
                          {isEnabled ? '● Active' : '⏸ Paused'}
                        </span>
                      </div>
                      <span className={styles.emailTabSub}>
                        {key === 'order_confirmation'
                          ? 'Triggered on new paid customer order'
                          : key === 'order_shipped'
                          ? 'Triggered when tracking barcode is generated'
                          : key === 'review_request'
                          ? 'Triggered 7 days post-delivery for cupping review'
                          : key === 'refill_reminder'
                          ? 'Sent 21 days after delivery for peak fresh brew'
                          : key === 'abandoned_cart'
                          ? 'Sent 2h after shopper leaves bag in cart'
                          : 'Sent immediately on customer registration'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Studio Split Layout */}
              <div className={styles.emailStudioLayout}>
                {/* Left: Template Editor */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className={styles.sectionCard}>
                    <div className={styles.sectionCardHeader}>
                      <MailIcon size={16} />
                      <h4>Editorial Copy & Design ({emailTemplates[selectedEmailKey]?.name || selectedEmailKey})</h4>
                    </div>

                    {/* Active / Paused Toggle Section */}
                    <div className={styles.emailToggleSection}>
                      <div className={styles.emailToggleInfo}>
                        <div className={styles.emailToggleTitle}>
                          <span>Automated Trigger Status:</span>
                          <span className={emailTemplates[selectedEmailKey]?.enabled !== false ? styles.emailStatusPillActive : styles.emailStatusPillPaused}>
                            {emailTemplates[selectedEmailKey]?.enabled !== false ? '● Live Active' : '⏸ Paused (Skipped)'}
                          </span>
                        </div>
                        <div className={styles.emailToggleDesc}>
                          {emailTemplates[selectedEmailKey]?.enabled !== false
                            ? 'When events trigger, this email will automatically be dispatched to the customer.'
                            : 'This automated flow is paused. Triggers will skip sending this email.'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleEmailActive(selectedEmailKey)}
                        className={`${styles.emailSwitchBtn} ${emailTemplates[selectedEmailKey]?.enabled !== false ? styles.emailSwitchBtnActive : ''}`}
                        title="Toggle template activation"
                      >
                        <div className={styles.emailSwitchKnob} />
                      </button>
                    </div>

                    {/* Hero Image Selector & Uploader */}
                    <div className={styles.formGroup}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className={styles.formLabel}>Hero Banner Artwork Preset & Upload</label>
                        {uploadingEmailImage && (
                          <span style={{ fontSize: '11px', color: '#09090b', fontWeight: 700 }}>
                            Uploading image to Supabase...
                          </span>
                        )}
                      </div>
                      
                      <div className={styles.heroImageSelectorGroup}>
                        {[
                          { name: 'Roasting Drum', url: '/images/hero_roast_order.png' },
                          { name: 'Courier Box', url: '/images/brand-carrier.webp' },
                          { name: 'Single Origin Beans', url: '/images/brand-beans.webp' },
                          { name: 'Coffee Trio', url: '/images/coffee_grouped.png' },
                          { name: 'Barista Pour-Over', url: '/images/barista-chemex.webp' },
                          { name: 'Barista Class', url: '/images/barista-class.webp' },
                        ].map((img) => (
                          <button
                            key={img.url}
                            type="button"
                            onClick={() => {
                              setEmailTemplates((prev) => ({
                                ...prev,
                                [selectedEmailKey]: { ...prev[selectedEmailKey], heroImage: img.url },
                              }));
                            }}
                            className={`${styles.heroImagePresetThumb} ${
                              (emailTemplates[selectedEmailKey]?.heroImage || DEFAULT_EMAIL_TEMPLATES[selectedEmailKey]?.heroImage) === img.url
                                ? styles.heroImagePresetThumbActive
                                : ''
                            }`}
                            title={img.name}
                          >
                            <img src={img.url} alt={img.name} />
                          </button>
                        ))}
                      </div>

                      {/* Custom Upload Drop Area */}
                      <div className={styles.emailImageUploaderSection}>
                        <label className={styles.emailUploadDropArea}>
                          <UploadCloudIcon size={18} />
                          <span style={{ fontSize: '12.5px', fontWeight: 600 }}>
                            {uploadingEmailImage ? 'Uploading image...' : 'Click or Drop file to upload custom email artwork'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUploadEmailHero(file);
                            }}
                          />
                        </label>

                        {/* Direct Image URL input */}
                        <input
                          type="text"
                          className={styles.formInput}
                          placeholder="Or paste external / custom image URL (/images/... or https://...)"
                          value={emailTemplates[selectedEmailKey]?.heroImage || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEmailTemplates((prev) => ({
                              ...prev,
                              [selectedEmailKey]: { ...prev[selectedEmailKey], heroImage: val },
                            }));
                          }}
                        />
                      </div>
                    </div>

                    <div className={styles.formGrid2}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Top Gold Badge Text</label>
                        <input
                          type="text"
                          className={styles.formInput}
                          value={emailTemplates[selectedEmailKey]?.badge || DEFAULT_EMAIL_TEMPLATES[selectedEmailKey]?.badge || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEmailTemplates((prev) => ({
                              ...prev,
                              [selectedEmailKey]: { ...prev[selectedEmailKey], badge: val },
                            }));
                          }}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>{t.subjectLine}</label>
                        <input
                          type="text"
                          className={styles.formInput}
                          value={emailTemplates[selectedEmailKey]?.subject || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEmailTemplates((prev) => ({
                              ...prev,
                              [selectedEmailKey]: { ...prev[selectedEmailKey], subject: val },
                            }));
                          }}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Inbox Preheader Text (Snippet shown next to subject line)</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={emailTemplates[selectedEmailKey]?.preheader || DEFAULT_EMAIL_TEMPLATES[selectedEmailKey]?.preheader || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEmailTemplates((prev) => ({
                            ...prev,
                            [selectedEmailKey]: { ...prev[selectedEmailKey], preheader: val },
                          }));
                        }}
                      />
                    </div>

                    <div className={styles.formGrid2}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>{t.headlineText}</label>
                        <input
                          type="text"
                          className={styles.formInput}
                          value={emailTemplates[selectedEmailKey]?.headline || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEmailTemplates((prev) => ({
                              ...prev,
                              [selectedEmailKey]: { ...prev[selectedEmailKey], headline: val },
                            }));
                          }}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Editorial Subtitle / Lot Reference</label>
                        <input
                          type="text"
                          className={styles.formInput}
                          value={emailTemplates[selectedEmailKey]?.subtitle || DEFAULT_EMAIL_TEMPLATES[selectedEmailKey]?.subtitle || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEmailTemplates((prev) => ({
                              ...prev,
                              [selectedEmailKey]: { ...prev[selectedEmailKey], subtitle: val },
                            }));
                          }}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>{t.bodyMessage}</label>
                      <textarea
                        rows={4}
                        className={styles.formTextarea}
                        value={emailTemplates[selectedEmailKey]?.body || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEmailTemplates((prev) => ({
                            ...prev,
                            [selectedEmailKey]: { ...prev[selectedEmailKey], body: val },
                          }));
                        }}
                      />
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                        {[
                          '{{customer_name}}',
                          '{{order_id}}',
                          '{{tracking_url}}',
                          '{{carrier_name}}',
                          '{{tracking_number}}',
                          '{{last_product_name}}',
                          '{{roast_date}}',
                          '{{total_amount}}',
                        ].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              setEmailTemplates((prev) => ({
                                ...prev,
                                [selectedEmailKey]: {
                                  ...prev[selectedEmailKey],
                                  body: (prev[selectedEmailKey]?.body || '') + ' ' + tag,
                                },
                              }));
                            }}
                            className={styles.chipPresetBtn}
                          >
                            + {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Roaster’s Cupping Tip / Highlight Note</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={emailTemplates[selectedEmailKey]?.roastmasterNote || DEFAULT_EMAIL_TEMPLATES[selectedEmailKey]?.roastmasterNote || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEmailTemplates((prev) => ({
                            ...prev,
                            [selectedEmailKey]: { ...prev[selectedEmailKey], roastmasterNote: val },
                          }));
                        }}
                      />
                    </div>

                    <div className={styles.formGrid2}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Primary CTA Button Text</label>
                        <input
                          type="text"
                          className={styles.formInput}
                          value={emailTemplates[selectedEmailKey]?.buttonText || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEmailTemplates((prev) => ({
                              ...prev,
                              [selectedEmailKey]: { ...prev[selectedEmailKey], buttonText: val },
                            }));
                          }}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Primary Button URL</label>
                        <input
                          type="text"
                          className={styles.formInput}
                          value={emailTemplates[selectedEmailKey]?.buttonUrl || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEmailTemplates((prev) => ({
                              ...prev,
                              [selectedEmailKey]: { ...prev[selectedEmailKey], buttonUrl: val },
                            }));
                          }}
                        />
                      </div>
                    </div>

                    <div className={styles.formGrid2}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Secondary Link Text (Optional)</label>
                        <input
                          type="text"
                          className={styles.formInput}
                          value={emailTemplates[selectedEmailKey]?.secondaryButtonText || DEFAULT_EMAIL_TEMPLATES[selectedEmailKey]?.secondaryButtonText || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEmailTemplates((prev) => ({
                              ...prev,
                              [selectedEmailKey]: { ...prev[selectedEmailKey], secondaryButtonText: val },
                            }));
                          }}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Secondary Link URL</label>
                        <input
                          type="text"
                          className={styles.formInput}
                          value={emailTemplates[selectedEmailKey]?.secondaryButtonUrl || DEFAULT_EMAIL_TEMPLATES[selectedEmailKey]?.secondaryButtonUrl || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEmailTemplates((prev) => ({
                              ...prev,
                              [selectedEmailKey]: { ...prev[selectedEmailKey], secondaryButtonUrl: val },
                            }));
                          }}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>{t.footerMessage}</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={emailTemplates[selectedEmailKey]?.footerNote || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEmailTemplates((prev) => ({
                            ...prev,
                            [selectedEmailKey]: { ...prev[selectedEmailKey], footerNote: val },
                          }));
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                      <button onClick={() => handleSaveEmailSettings()} className={styles.primaryBtn} disabled={actionLoading}>
                        <span>{t.saveEmailSettings}</span>
                      </button>
                    </div>
                  </div>

                  {/* SMTP Credentials Drawer */}
                  <div className={styles.sectionCard}>
                    <div className={styles.sectionCardHeader} style={{ justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <GearIcon size={16} />
                        <h4>{t.smtpSettings}</h4>
                      </div>
                      <button onClick={() => setShowSmtpSettings(!showSmtpSettings)} className={styles.ghostBtn}>
                        {showSmtpSettings ? 'Hide Credentials' : 'Configure SMTP'}
                      </button>
                    </div>

                    {showSmtpSettings && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                        <div className={styles.formGrid2}>
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>{t.fromName}</label>
                            <input
                              type="text"
                              className={styles.formInput}
                              value={emailSettings?.fromName || ''}
                              onChange={(e) => setEmailSettings((prev: any) => ({ ...prev, fromName: e.target.value }))}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>{t.fromEmail}</label>
                            <input
                              type="email"
                              className={styles.formInput}
                              value={emailSettings?.fromEmail || ''}
                              onChange={(e) => setEmailSettings((prev: any) => ({ ...prev, fromEmail: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className={styles.formGrid2}>
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>{t.smtpHost}</label>
                            <input
                              type="text"
                              className={styles.formInput}
                              value={emailSettings?.smtpHost || ''}
                              onChange={(e) => setEmailSettings((prev: any) => ({ ...prev, smtpHost: e.target.value }))}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>{t.smtpPort}</label>
                            <input
                              type="number"
                              className={styles.formInput}
                              value={emailSettings?.smtpPort || 587}
                              onChange={(e) => setEmailSettings((prev: any) => ({ ...prev, smtpPort: Number(e.target.value) }))}
                            />
                          </div>
                        </div>

                        <div className={styles.formGrid2}>
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>{t.smtpUser}</label>
                            <input
                              type="text"
                              className={styles.formInput}
                              value={emailSettings?.smtpUser || ''}
                              onChange={(e) => setEmailSettings((prev: any) => ({ ...prev, smtpUser: e.target.value }))}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>{t.smtpPass}</label>
                            <input
                              type="password"
                              className={styles.formInput}
                              value={emailSettings?.smtpPass || ''}
                              onChange={(e) => setEmailSettings((prev: any) => ({ ...prev, smtpPass: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>{t.resendApiKey}</label>
                          <input
                            type="password"
                            className={styles.formInput}
                            placeholder="re_xxxxxxxxxxxx"
                            value={emailSettings?.resendApiKey || ''}
                            onChange={(e) => setEmailSettings((prev: any) => ({ ...prev, resendApiKey: e.target.value }))}
                          />
                        </div>

                        <button onClick={() => handleSaveEmailSettings()} className={styles.primaryBtn} style={{ alignSelf: 'flex-start' }}>
                          <span>Save SMTP Credentials</span>
                        </button>
                      </div>
                    )}

                    {/* Test Email Dispatcher */}
                    <div style={{ borderTop: '1px solid var(--ad-border-subtle)', paddingTop: '14px', marginTop: '10px' }}>
                      <label className={styles.formLabel}>{t.testEmailRecipient}</label>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <input
                          type="email"
                          className={styles.formInput}
                          placeholder="youremail@domain.com"
                          value={testEmailAddress}
                          onChange={(e) => setTestEmailAddress(e.target.value)}
                        />
                        <button
                          onClick={handleSendTestEmail}
                          className={styles.secondaryBtn}
                          disabled={testEmailLoading}
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          <SendIcon size={14} />
                          <span>{testEmailLoading ? 'Dispatching...' : t.sendTestEmail}</span>
                        </button>
                      </div>
                      {testEmailStatus && (
                        <div style={{ marginTop: '8px', fontSize: '12px', color: testEmailStatus.includes('Delivered') ? '#2b7a4b' : '#b3261e', fontWeight: 600 }}>
                          {testEmailStatus}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Live Responsive Preview Frame */}
                <div className={styles.emailPreviewPane}>
                  <div className={styles.emailPreviewTopBar}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                      Live Inbox Preview
                    </span>
                    <div className={styles.emailDeviceToggle}>
                      <button
                        onClick={() => setEmailPreviewDevice('desktop')}
                        className={`${styles.deviceBtn} ${emailPreviewDevice === 'desktop' ? styles.deviceBtnActive : ''}`}
                      >
                        <DesktopIcon size={14} />
                        <span>Desktop (580px)</span>
                      </button>
                      <button
                        onClick={() => setEmailPreviewDevice('mobile')}
                        className={`${styles.deviceBtn} ${emailPreviewDevice === 'mobile' ? styles.deviceBtnActive : ''}`}
                      >
                        <SmartphoneIcon size={14} />
                        <span>Mobile (360px)</span>
                      </button>
                    </div>
                  </div>

                  {/* Simulated Inbox Client Header */}
                  <div className={styles.emailInboxSimulation}>
                    <div className={styles.emailInboxSimRow}>
                      <span className={styles.emailInboxSimLabel}>From:</span>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>
                        {emailSettings?.fromName || 'Coffee Esto Roastery'} &lt;{emailSettings?.fromEmail || 'orders@grainandgrind.com'}&gt;
                      </span>
                    </div>
                    <div className={styles.emailInboxSimRow}>
                      <span className={styles.emailInboxSimLabel}>Subject:</span>
                      <span style={{ color: '#f4f4f5' }}>
                        {(emailTemplates[selectedEmailKey]?.subject || DEFAULT_EMAIL_TEMPLATES[selectedEmailKey]?.subject || '')
                          .replace(/{{customer_name}}/g, 'Alex')
                          .replace(/{{order_id}}/g, 'ESTO-9281')}
                      </span>
                    </div>
                    <div className={styles.emailInboxSimRow}>
                      <span className={styles.emailInboxSimLabel}>Preview:</span>
                      <span style={{ color: '#a1a1aa' }}>
                        {(emailTemplates[selectedEmailKey]?.preheader || DEFAULT_EMAIL_TEMPLATES[selectedEmailKey]?.preheader || '')
                          .replace(/{{customer_name}}/g, 'Alex')
                          .replace(/{{order_id}}/g, 'ESTO-9281')}
                      </span>
                    </div>
                  </div>

                  {/* Rendered Luxury Email Body */}
                  <div className={`${styles.emailPreviewFrame} ${emailPreviewDevice === 'mobile' ? styles.emailPreviewFrameMobile : ''}`}>
                    {/* Header */}
                    <div className={styles.emailLuxuryHeader}>
                      <div className={styles.emailLuxuryLogoContainer}>
                        <img
                          src="/images/logo.png"
                          alt="Coffee Esto Logo"
                          style={{ width: '42px', height: '42px', objectFit: 'contain', borderRadius: '8px', marginBottom: '6px' }}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className={styles.emailBrandLogo}>COFFEE ESTO</div>
                        <div className={styles.emailBrandTagline}>SPECIALTY COFFEE ROASTERS • İSTANBUL</div>
                      </div>
                    </div>

                    {/* Hero Artwork Banner */}
                    <div className={styles.emailHeroBannerWrap}>
                      <img
                        src={emailTemplates[selectedEmailKey]?.heroImage || DEFAULT_EMAIL_TEMPLATES[selectedEmailKey]?.heroImage || '/images/hero_roast_order.png'}
                        alt="Hero Artwork"
                        className={styles.emailHeroBannerImg}
                      />
                      <div className={styles.emailHeroBannerOverlay}>
                        <div className={styles.emailHeroBadge}>
                          {emailTemplates[selectedEmailKey]?.badge || DEFAULT_EMAIL_TEMPLATES[selectedEmailKey]?.badge || 'ARTISAN SPECIALTY ROAST'}
                        </div>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className={styles.emailPreviewContent}>
                      <div>
                        <div className={styles.emailEditorialTitle}>
                          {(emailTemplates[selectedEmailKey]?.headline || DEFAULT_EMAIL_TEMPLATES[selectedEmailKey]?.headline || '')
                            .replace(/{{customer_name}}/g, 'Alex')
                            .replace(/{{order_id}}/g, 'ESTO-9281')}
                        </div>
                        <div className={styles.emailEditorialSubtitle}>
                          {(emailTemplates[selectedEmailKey]?.subtitle || DEFAULT_EMAIL_TEMPLATES[selectedEmailKey]?.subtitle || '')
                            .replace(/{{order_id}}/g, 'ESTO-9281')
                            .replace(/{{tracking_number}}/g, 'YK-8921827')
                            .replace(/{{carrier_name}}/g, 'Yurtiçi Kargo')}
                        </div>
                      </div>

                      <div className={styles.emailBodyText}>
                        {(emailTemplates[selectedEmailKey]?.body || DEFAULT_EMAIL_TEMPLATES[selectedEmailKey]?.body || '')
                          .replace(/{{customer_name}}/g, 'Alex')
                          .replace(/{{order_id}}/g, 'ESTO-9281')
                          .replace(/{{tracking_url}}/g, 'https://yurticikargo.com/track/YK-8921827')
                          .replace(/{{carrier_name}}/g, 'Yurtiçi Kargo')
                          .replace(/{{tracking_number}}/g, 'YK-8921827')
                          .replace(/{{roast_date}}/g, new Date().toLocaleDateString('tr-TR'))
                          .replace(/{{last_product_name}}/g, 'Ethiopia Yirgacheffe G1')
                          .replace(/{{total_amount}}/g, '₺690.00')}
                      </div>

                      {/* 1. Dynamic Progress Stepper (for Order Confirmation & Shipped) */}
                      {(selectedEmailKey === 'order_confirmation' || selectedEmailKey === 'order_shipped') && (
                        <div className={styles.emailStepper}>
                          <div className={`${styles.stepperItem} ${styles.stepperDone}`}>
                            <div className={styles.stepperDot}>✓</div>
                            <span className={styles.stepperTitle}>1. Order Placed</span>
                          </div>
                          <div
                            className={`${styles.stepperItem} ${
                              selectedEmailKey === 'order_confirmation' ? styles.stepperActive : styles.stepperDone
                            }`}
                          >
                            <div className={styles.stepperDot}>
                              {selectedEmailKey === 'order_confirmation' ? '●' : '✓'}
                            </div>
                            <span className={styles.stepperTitle}>2. Drum Roast</span>
                          </div>
                          <div
                            className={`${styles.stepperItem} ${
                              selectedEmailKey === 'order_shipped' ? styles.stepperDone : ''
                            }`}
                          >
                            <div className={styles.stepperDot}>
                              {selectedEmailKey === 'order_shipped' ? '✓' : '3'}
                            </div>
                            <span className={styles.stepperTitle}>3. Degas Sealed</span>
                          </div>
                          <div
                            className={`${styles.stepperItem} ${
                              selectedEmailKey === 'order_shipped' ? styles.stepperActive : ''
                            }`}
                          >
                            <div className={styles.stepperDot}>
                              {selectedEmailKey === 'order_shipped' ? '🚚' : '4'}
                            </div>
                            <span className={styles.stepperTitle}>4. Dispatched</span>
                          </div>
                        </div>
                      )}

                      {/* 2. Review Rating Prompt (for Review Request) */}
                      {selectedEmailKey === 'review_request' && (
                        <div className={styles.emailBentoReceipt} style={{ textAlign: 'center', padding: '20px 16px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: '#09090b', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                            Rate Your Cupping Experience
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '24px', cursor: 'pointer', margin: '8px 0' }}>
                            <span>⭐️</span>
                            <span>⭐️</span>
                            <span>⭐️</span>
                            <span>⭐️</span>
                            <span>⭐️</span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#71717a' }}>
                            Click any star to open our 1-click tasting questionnaire
                          </div>
                        </div>
                      )}

                      {/* 3. Welcome Series Perks Box (for Welcome Series) */}
                      {selectedEmailKey === 'welcome_series' && (
                        <div className={styles.emailVipCouponBox}>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: '#09090b' }}>
                              Welcome Atelier Member Gift
                            </div>
                            <div style={{ fontSize: '11px', color: '#71717a' }}>
                              10% off your first whole bean or drip bag order
                            </div>
                          </div>
                          <div className={styles.emailCouponCode}>WELCOME10</div>
                        </div>
                      )}

                      {/* 4. Bento Order Receipt (for Order Confirmation & Abandoned Cart) */}
                      {(selectedEmailKey === 'order_confirmation' || selectedEmailKey === 'abandoned_cart') && (
                        <div className={styles.emailBentoReceipt}>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: '#09090b', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                            {selectedEmailKey === 'order_confirmation' ? 'Order Summary' : 'Reserved Items in Cart'}
                          </div>

                          <div className={styles.emailBentoItem}>
                            <div className={styles.emailBentoThumb}>
                              <img src="/images/coffee_packs/ETHIOPIA_YIRGACHEFF.png" alt="Ethiopia Yirgacheffe" />
                            </div>
                            <div className={styles.emailBentoDetails}>
                              <div className={styles.emailBentoName}>Ethiopia Yirgacheffe G1</div>
                              <div className={styles.emailBentoMeta}>250g Pouch • V60 Filter Grind</div>
                              <div className={styles.emailBentoPills}>
                                <span className={styles.emailTastingPill}>Jasmine</span>
                                <span className={styles.emailTastingPill}>Bergamot</span>
                                <span className={styles.emailTastingPill}>Peach</span>
                              </div>
                            </div>
                            <div className={styles.emailBentoPrice}>₺360.00</div>
                          </div>

                          <div className={styles.emailBentoItem} style={{ borderBottom: 'none', paddingBottom: 0 }}>
                            <div className={styles.emailBentoThumb}>
                              <img src="/images/coffee_packs/COLOMBIA.png" alt="Colombia Supremo" />
                            </div>
                            <div className={styles.emailBentoDetails}>
                              <div className={styles.emailBentoName}>Colombia Supremo Huila</div>
                              <div className={styles.emailBentoMeta}>250g Pouch • Whole Bean</div>
                              <div className={styles.emailBentoPills}>
                                <span className={styles.emailTastingPill}>Cocoa</span>
                                <span className={styles.emailTastingPill}>Hazelnut</span>
                              </div>
                            </div>
                            <div className={styles.emailBentoPrice}>₺330.00</div>
                          </div>

                          <div className={styles.emailReceiptSummary}>
                            <div className={styles.emailReceiptRow}>
                              <span>Subtotal</span>
                              <span>₺690.00</span>
                            </div>
                            <div className={styles.emailReceiptRow}>
                              <span>Express Courier Delivery</span>
                              <span style={{ color: '#059669', fontWeight: 700 }}>FREE</span>
                            </div>
                            <div className={styles.emailReceiptTotal}>
                              <span>Total Amount</span>
                              <span>₺690.00</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 5. 21-Day Freshness Curve & VIP Coupon (for Refill Reminder) */}
                      {selectedEmailKey === 'refill_reminder' && (
                        <>
                          <div className={styles.emailFreshnessGauge}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '12px', fontWeight: 800, color: '#09090b' }}>
                                Degassing & Freshness Curve
                              </span>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669' }}>
                                Day 21 (Reorder Window)
                              </span>
                            </div>
                            <div className={styles.emailFreshnessBar} />
                            <div className={styles.emailFreshnessLabels}>
                              <span>Day 1–6 (Degassing)</span>
                              <span style={{ color: '#09090b', fontWeight: 800 }}>Day 7–28 (Peak Flavors)</span>
                              <span>Day 30+ (Fading)</span>
                            </div>
                          </div>

                          <div className={styles.emailVipCouponBox}>
                            <div>
                              <div style={{ fontSize: '12px', fontWeight: 800, color: '#09090b' }}>
                                VIP Replenishment Discount
                              </div>
                              <div style={{ fontSize: '11px', color: '#71717a' }}>
                                Apply at checkout for 10% off entire roast catalog
                              </div>
                            </div>
                            <div className={styles.emailCouponCode}>REFILL10</div>
                          </div>
                        </>
                      )}

                      {/* Roastmaster Note Box */}
                      {(emailTemplates[selectedEmailKey]?.roastmasterNote || DEFAULT_EMAIL_TEMPLATES[selectedEmailKey]?.roastmasterNote) && (
                        <div className={styles.emailRoasterNoteBox}>
                          <span style={{ fontSize: '15px', lineHeight: 1 }}>💬</span>
                          <div>
                            {emailTemplates[selectedEmailKey]?.roastmasterNote || DEFAULT_EMAIL_TEMPLATES[selectedEmailKey]?.roastmasterNote}
                          </div>
                        </div>
                      )}

                      {/* CTA Group */}
                      <div className={styles.emailCtaGroup}>
                        <a href="#preview" onClick={(e) => e.preventDefault()} className={styles.emailGoldBtn}>
                          <span>{emailTemplates[selectedEmailKey]?.buttonText || DEFAULT_EMAIL_TEMPLATES[selectedEmailKey]?.buttonText || 'View Order'}</span>
                          <span>→</span>
                        </a>
                        {(emailTemplates[selectedEmailKey]?.secondaryButtonText || DEFAULT_EMAIL_TEMPLATES[selectedEmailKey]?.secondaryButtonText) && (
                          <a href="#preview" onClick={(e) => e.preventDefault()} className={styles.emailGhostBtn}>
                            {emailTemplates[selectedEmailKey]?.secondaryButtonText || DEFAULT_EMAIL_TEMPLATES[selectedEmailKey]?.secondaryButtonText}
                          </a>
                        )}
                      </div>

                      {/* Barista Micro Brewing Bar */}
                      <div className={styles.emailBrewBar}>
                        <span>⚖️ 1:16 Brew Ratio</span>
                        <span>🌡️ 93°C Water</span>
                        <span>⏱️ 2:45 min Total Time</span>
                      </div>
                    </div>

                    {/* Footer with Deliverability Compliance */}
                    <div className={styles.emailLuxuryFooter}>
                      <div className={styles.emailFooterSocials}>
                        <span>Instagram @esto.roastery</span>
                        <span>•</span>
                        <span>Brewing Journal</span>
                        <span>•</span>
                        <span>Support</span>
                      </div>
                      <div>{emailTemplates[selectedEmailKey]?.footerNote || 'Coffee Esto Roastery • Karaköy, İstanbul • Direct Trade Single Origins'}</div>
                      <div className={styles.emailFooterFineprint}>
                        Coffee Esto Roastery Atelier • Topselvi Mh, Kartal, İstanbul • thecoffeeesto@gmail.com
                        <br />
                        Heat-sealed in Istanbul with one-way degassing valves. Best consumed within 60 days of roast date.
                        <br />
                        © {new Date().getFullYear()} Coffee Esto Roastery. All rights reserved. • <a href="#preview" onClick={(e) => e.preventDefault()} style={{ color: '#71717a', textDecoration: 'underline' }}>Manage Preferences</a> • <a href="#preview" onClick={(e) => e.preventDefault()} style={{ color: '#71717a', textDecoration: 'underline' }}>Unsubscribe</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════
              TAB 11: STOREFRONT & BANNERS
          ═════════════════════════════════════════════════════════ */}
          {activeTab === 'storefront' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Live Banner Preview Box */}
              {storefrontSettings?.announcementEnabled && (
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {t.liveAnnouncementPreview}
                  </span>
                  <div className={styles.announcementPreviewBox} style={{ background: storefrontSettings.announcementBg, marginTop: '6px' }}>
                    <span>{lang === 'tr' ? storefrontSettings.announcementTextTr : storefrontSettings.announcementTextEn}</span>
                    <span style={{ textDecoration: 'underline', fontSize: '12px', cursor: 'pointer' }}>{t.viewDetailsArrow}</span>
                  </div>
                </div>
              )}

              <div className={styles.formGrid2}>
                {/* Announcement Settings Card */}
                <div className={styles.sectionCard}>
                  <div className={styles.sectionCardHeader}>
                    <PaletteIcon size={16} />
                    <h4>{t.announcementBar}</h4>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.toggleSwitch} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(storefrontSettings?.announcementEnabled)}
                        onChange={(e) => setStorefrontSettings((prev: any) => ({ ...prev, announcementEnabled: e.target.checked }))}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ad-text-main)' }}>{t.enableAnnouncement}</span>
                    </label>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t.announcementTextTr}</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={storefrontSettings?.announcementTextTr || ''}
                      onChange={(e) => setStorefrontSettings((prev: any) => ({ ...prev, announcementTextTr: e.target.value }))}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t.announcementTextEn}</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={storefrontSettings?.announcementTextEn || ''}
                      onChange={(e) => setStorefrontSettings((prev: any) => ({ ...prev, announcementTextEn: e.target.value }))}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t.announcementBgColor}</label>
                    <div className={styles.colorPresetRow}>
                      {[
                        { name: 'Dark Espresso', bg: 'linear-gradient(90deg, #2a170c 0%, #4a2817 100%)' },
                        { name: 'Amber Warm', bg: 'linear-gradient(90deg, #d97706 0%, #b45309 100%)' },
                        { name: 'Forest Roast', bg: 'linear-gradient(90deg, #1e3a2b 0%, #2d5a43 100%)' },
                        { name: 'Crimson Velvet', bg: 'linear-gradient(90deg, #4a1515 0%, #6b1f1f 100%)' },
                        { name: 'Royal Midnight', bg: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)' },
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setStorefrontSettings((prev: any) => ({ ...prev, announcementBg: preset.bg }))}
                          className={`${styles.colorPresetCircle} ${storefrontSettings?.announcementBg === preset.bg ? styles.colorPresetCircleActive : ''}`}
                          style={{ background: preset.bg }}
                          title={preset.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t.announcementLinkUrl}</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={storefrontSettings?.announcementLink || ''}
                      onChange={(e) => setStorefrontSettings((prev: any) => ({ ...prev, announcementLink: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Hero Spotlight & Vacation Mode Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className={styles.sectionCard}>
                    <div className={styles.sectionCardHeader}>
                      <SparklesIcon size={16} />
                      <h4>{t.heroSpotlight}</h4>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>{t.selectSpotlightProduct}</label>
                      <select
                        className={styles.formSelect}
                        value={storefrontSettings?.spotlightProductId || ''}
                        onChange={(e) => setStorefrontSettings((prev: any) => ({ ...prev, spotlightProductId: e.target.value }))}
                      >
                        {coffeeProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.origin || 'Single Origin'}) — ₺{p.price}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.sectionCard}>
                    <div className={styles.sectionCardHeader}>
                      <AlertTriangleIcon size={16} />
                      <h4>{t.holidayMode}</h4>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.toggleSwitch} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(storefrontSettings?.holidayModeEnabled)}
                          onChange={(e) => setStorefrontSettings((prev: any) => ({ ...prev, holidayModeEnabled: e.target.checked }))}
                        />
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ad-text-main)' }}>{t.enableHolidayMode}</span>
                      </label>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>{t.holidayNoticeTr}</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="örn. Kavurmahanemiz 10-18 Temmuz tarihleri arasında tatildedir. Siparişler 19 Temmuz'da taze kavrulup gönderilecektir."
                        value={storefrontSettings?.holidayNoticeTr || ''}
                        onChange={(e) => setStorefrontSettings((prev: any) => ({ ...prev, holidayNoticeTr: e.target.value }))}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>{t.holidayNoticeEn}</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="e.g. Our roastery is on holiday until July 18. All orders will be freshly roasted and dispatched on July 19."
                        value={storefrontSettings?.holidayNoticeEn || ''}
                        onChange={(e) => setStorefrontSettings((prev: any) => ({ ...prev, holidayNoticeEn: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button onClick={handleSaveStorefrontSettings} className={styles.primaryBtn} disabled={actionLoading}>
                  <span>{t.saveStorefrontSettings}</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ═════════════════════════════════════════════════════════
          MODAL 1: REDESIGNED PRODUCT MODAL (WITH LIVE PREVIEW & TABS)
      ═════════════════════════════════════════════════════════ */}
      {(isAddingProduct || selectedProduct) && (
        <div className={styles.modalBackdrop}>
          <div className={`${styles.modalCard} ${styles.modalCardExtraLarge}`}>
            {/* Pinned Modal Header with Navigation Tabs */}
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <h3 className={styles.modalTitle}>
                  {modalType === 'coffee'
                    ? selectedProduct
                      ? t.modalEditRoast
                      : t.modalAddRoast
                    : selectedProduct
                    ? t.modalEditEquipment
                    : t.modalAddEquipment}
                </h3>
              </div>

              {/* Navigation Segment Tabs */}
              <div className={styles.modalNavPills}>
                <button
                  type="button"
                  onClick={() => setProductModalTab('all')}
                  className={`${styles.modalNavPill} ${productModalTab === 'all' ? styles.modalNavPillActive : ''}`}
                >
                  <LayersIcon size={13} />
                  <span>{t.tabOverviewAll}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProductModalTab('basics')}
                  className={`${styles.modalNavPill} ${productModalTab === 'basics' ? styles.modalNavPillActive : ''}`}
                >
                  <TagIcon size={13} />
                  <span>{t.tabBasicsPricing}</span>
                </button>
                {modalType === 'coffee' ? (
                  <button
                    type="button"
                    onClick={() => setProductModalTab('profile')}
                    className={`${styles.modalNavPill} ${productModalTab === 'profile' ? styles.modalNavPillActive : ''}`}
                  >
                    <SlidersIcon size={13} />
                    <span>{t.tabRoastSensory}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setProductModalTab('profile')}
                    className={`${styles.modalNavPill} ${productModalTab === 'profile' ? styles.modalNavPillActive : ''}`}
                  >
                    <GearIcon size={13} />
                    <span>{t.tabSpecs}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setProductModalTab('media')}
                  className={`${styles.modalNavPill} ${productModalTab === 'media' ? styles.modalNavPillActive : ''}`}
                >
                  <ImageIcon size={13} />
                  <span>{t.tabPhotosMedia}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setIsAddingProduct(false);
                  setSelectedProduct(null);
                }}
                className={styles.modalCloseBtn}
              >
                <CloseIcon size={15} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className={styles.modalForm}>
              <div className={styles.modalSplitLayout}>
                {/* Left Form Area (Scrollable with smooth scrollbar) */}
                <div className={styles.modalFormScrollable}>
                  {/* Section 1: Basic Information & Pricing */}
                  {(productModalTab === 'all' || productModalTab === 'basics') && (
                    <div className={styles.sectionCard}>
                      <div className={styles.sectionCardHeader}>
                        <h4 className={styles.sectionCardTitle}>
                          <span className={styles.sectionCardIcon}><TagIcon size={15} /></span>
                          <span>{t.productDetailsPricing}</span>
                        </h4>
                        <span style={{ fontSize: '11px', color: 'var(--ad-text-muted)' }}>{t.coreCatalogParams}</span>
                      </div>

                      <div className={styles.formGrid2}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>
                            {modalType === 'coffee' ? t.roastName : t.equipmentName}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder={modalType === 'coffee' ? t.roastNamePlaceholder : t.equipmentNamePlaceholder}
                            value={prodForm.name || ''}
                            onChange={(e) => setProdForm((prev) => ({ ...prev, name: e.target.value }))}
                            className={styles.formInput}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>
                            <span>{t.roastSlug}</span>
                            <span className={styles.formHint}>{t.urlIdentifierHint}</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder={modalType === 'coffee' ? t.roastSlugPlaceholder : t.equipmentSlugPlaceholder}
                            value={prodForm.id || ''}
                            onChange={(e) => setProdForm((prev) => ({ ...prev, id: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                            className={styles.formInput}
                            disabled={!!selectedProduct}
                          />
                        </div>
                      </div>

                      <div className={styles.formGrid2}>
                        <div className={styles.formGroup}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label className={styles.formLabel}>{t.colCategory}</label>
                            <button
                              type="button"
                              onClick={() => setShowCategoryManager(true)}
                              style={{ background: 'none', border: 'none', color: 'var(--ad-primary)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                            >
                              {t.newCategoryBtn}
                            </button>
                          </div>
                          <select
                            required
                            value={prodForm.category || ''}
                            onChange={(e) => setProdForm((prev) => ({ ...prev, category: e.target.value }))}
                            className={styles.formSelect}
                          >
                            <option value="">{t.selectCategory}</option>
                            {(modalType === 'coffee' ? coffeeCategories : equipmentCategories).map((c) => (
                              <option key={c.id} value={c.slug}>
                                {c.label} ({c.slug})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>{t.stockUnits}</label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={prodForm.stock ?? 25}
                            onChange={(e) => setProdForm((prev) => ({ ...prev, stock: Number(e.target.value) }))}
                            className={styles.formInput}
                          />
                        </div>
                      </div>

                      {/* Pricing */}
                      {modalType === 'coffee' ? (
                        <div className={styles.formGrid2}>
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>{t.price250}</label>
                            <input
                              type="number"
                              required
                              min="0"
                              step="any"
                              value={prodForm.price || ''}
                              onChange={(e) => setProdForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
                              className={styles.formInput}
                            />
                          </div>

                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>{t.price1kg}</label>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={prodForm.price1kg || ''}
                              onChange={(e) => setProdForm((prev) => ({ ...prev, price1kg: Number(e.target.value) }))}
                              className={styles.formInput}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>{t.unitPrice}</label>
                          <input
                            type="number"
                            required
                            min="0"
                            step="any"
                            value={prodForm.price || ''}
                            onChange={(e) => setProdForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
                            className={styles.formInput}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Section 2: Coffee Sensory & Terroir Profile (or Equipment Specs) */}
                  {(productModalTab === 'all' || productModalTab === 'profile') && (
                    <div className={styles.sectionCard}>
                      <div className={styles.sectionCardHeader}>
                        <h4 className={styles.sectionCardTitle}>
                          <span className={styles.sectionCardIcon}>
                            {modalType === 'coffee' ? <CoffeeBeanIcon size={15} /> : <GearIcon size={15} />}
                          </span>
                          <span>{modalType === 'coffee' ? t.terroirSensoryProfile : t.technicalSpecifications}</span>
                        </h4>
                        <span style={{ fontSize: '11px', color: 'var(--ad-text-muted)' }}>
                          {modalType === 'coffee' ? t.originRoastFlavorHint : t.specsAndDetailsHint}
                        </span>
                      </div>

                      {modalType === 'coffee' ? (
                        <>
                          <div className={styles.formGrid2}>
                            <div className={styles.formGroup}>
                              <label className={styles.formLabel}>{t.origin}</label>
                              <input
                                type="text"
                                placeholder={t.originPlaceholder}
                                value={prodForm.origin || ''}
                                onChange={(e) => setProdForm((prev) => ({ ...prev, origin: e.target.value }))}
                                className={styles.formInput}
                              />
                            </div>

                            <div className={styles.formGroup}>
                              <label className={styles.formLabel}>{t.altitude}</label>
                              <input
                                type="text"
                                placeholder={t.altitudePlaceholder}
                                value={prodForm.altitude || ''}
                                onChange={(e) => setProdForm((prev) => ({ ...prev, altitude: e.target.value }))}
                                className={styles.formInput}
                              />
                            </div>
                          </div>

                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>{t.varietal}</label>
                            <input
                              type="text"
                              placeholder={t.varietalPlaceholder}
                              value={prodForm.varietal || ''}
                              onChange={(e) => setProdForm((prev) => ({ ...prev, varietal: e.target.value }))}
                              className={styles.formInput}
                            />
                          </div>

                          {/* Visual Roast Level Preset Cards */}
                          <div className={styles.formGroup}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <label className={styles.formLabel}>{t.roastMeterLabel}</label>
                              <span style={{ color: 'var(--ad-primary)', fontWeight: 700, fontSize: '12.5px' }}>
                                {prodForm.roastLevel || 50}% {t.roastPctSuffix}
                              </span>
                            </div>

                            <div className={styles.roastPresetGrid}>
                              {ROAST_PRESETS.map((rp) => (
                                <button
                                  key={rp.value}
                                  type="button"
                                  onClick={() => setProdForm((prev) => ({ ...prev, roastLevel: rp.value }))}
                                  className={`${styles.roastPresetCard} ${(prodForm.roastLevel || 50) === rp.value ? styles.roastPresetCardActive : ''}`}
                                >
                                  <span className={styles.roastPresetName}>{lang === 'tr' ? rp.nameTr : rp.nameEn}</span>
                                  <span className={styles.roastPresetValue}>{rp.value}%</span>
                                </button>
                              ))}
                            </div>

                            <input
                              type="range"
                              min="10"
                              max="100"
                              step="5"
                              value={prodForm.roastLevel || 50}
                              onChange={(e) => setProdForm((prev) => ({ ...prev, roastLevel: Number(e.target.value) }))}
                              className={styles.roastRangeSlider}
                            />
                          </div>

                          {/* Interactive Tasting Notes Chip Builder */}
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                              <span>{t.tastingNotesChips}</span>
                              <span className={styles.formHint}>{t.pressEnterOrComma}</span>
                            </label>

                            <div className={styles.chipContainer}>
                              {tastingNotesList.map((note) => (
                                <span key={note} className={styles.chipItem}>
                                  <span>{note}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeTastingNote(note)}
                                    className={styles.chipRemoveBtn}
                                  >
                                    <CloseIcon size={11} />
                                  </button>
                                </span>
                              ))}
                              <input
                                type="text"
                                placeholder={tastingNotesList.length === 0 ? t.typeNoteAndPressEnter : t.addAnotherNote}
                                value={chipInput}
                                onChange={(e) => setChipInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ',') {
                                    e.preventDefault();
                                    addTastingNote(chipInput);
                                  }
                                }}
                                className={styles.chipInput}
                              />
                            </div>

                            {/* Popular suggestions */}
                            <div className={styles.chipSuggestions}>
                              <span className={styles.chipSuggestionLabel}>{t.quickAdd}</span>
                              {POPULAR_TASTING_NOTES.map((suggest) => (
                                <button
                                  key={suggest}
                                  type="button"
                                  onClick={() => addTastingNote(suggest)}
                                  className={styles.chipPresetBtn}
                                >
                                  + {suggest}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>{t.equipmentDescription}</label>
                          <textarea
                            placeholder={t.equipmentDescriptionPlaceholder}
                            value={prodForm.description || ''}
                            onChange={(e) => setProdForm((prev) => ({ ...prev, description: e.target.value }))}
                            className={styles.formTextarea}
                            style={{ minHeight: '120px' }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Section 3: Media & Photos (With Drag & Drop and Asset Library Picker) */}
                  {(productModalTab === 'all' || productModalTab === 'media') && (
                    <div className={styles.sectionCard}>
                      <div className={styles.sectionCardHeader}>
                        <h4 className={styles.sectionCardTitle}>
                          <span className={styles.sectionCardIcon}><ImageIcon size={15} /></span>
                          <span>{t.productMediaArtwork}</span>
                        </h4>
                        <span style={{ fontSize: '11px', color: 'var(--ad-text-muted)' }}>{t.highResPhotography}</span>
                      </div>

                      {/* Dropzone or Preview */}
                      {prodForm.imageUrl ? (
                        <div className={styles.filePreviewWrap}>
                          <img src={prodForm.imageUrl} alt="Preview" className={styles.previewImg} />
                          <button
                            type="button"
                            onClick={() => setProdForm((prev) => ({ ...prev, imageUrl: '' }))}
                            className={styles.removeFileBtn}
                          >
                            <CloseIcon size={12} /> {t.removeChangeImage}
                          </button>
                        </div>
                      ) : (
                        <label
                          className={`${styles.dropZone} ${dragOverDropzone ? styles.dropZoneActive : ''}`}
                          onDragOver={(e) => { e.preventDefault(); setDragOverDropzone(true); }}
                          onDragLeave={() => setDragOverDropzone(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setDragOverDropzone(false);
                            const file = e.dataTransfer.files?.[0];
                            if (file) uploadFile(file);
                          }}
                        >
                          <span className={styles.dropZoneIcon}><UploadCloudIcon size={30} /></span>
                          <span className={styles.dropZoneText}>
                            {uploadingImage ? t.uploadingImageText : t.dropImageHere}
                          </span>
                          <span className={styles.dropZoneSub}>{t.supportsFormats}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) uploadFile(file);
                            }}
                            style={{ display: 'none' }}
                          />
                        </label>
                      )}

                      {/* Direct URL Input */}
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          <span>{t.imageUrlLabel}</span>
                          <span className={styles.formHint}>{t.orPasteCustomLink}</span>
                        </label>
                        <input
                          type="text"
                          placeholder={t.pasteUrl}
                          value={prodForm.imageUrl || ''}
                          onChange={(e) => setProdForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                          className={styles.formInput}
                        />
                      </div>

                      {/* Quick Asset Library Picker */}
                      <div className={styles.assetPickerSection}>
                        <div className={styles.assetPickerHeader}>
                          <span>{t.pickFromLibrary} ({modalType === 'coffee' ? t.packsWord : t.equipmentWord}):</span>
                        </div>
                        <div className={styles.assetPickerGrid}>
                          {(modalType === 'coffee' ? COFFEE_PACK_PRESETS : EQUIPMENT_PRESETS).map((preset) => (
                            <button
                              key={preset.url}
                              type="button"
                              title={preset.name}
                              onClick={() => setProdForm((prev) => ({ ...prev, imageUrl: preset.url }))}
                              className={`${styles.assetThumbCard} ${prodForm.imageUrl === preset.url ? styles.assetThumbCardActive : ''}`}
                            >
                              <img src={preset.url} alt={preset.name} className={styles.assetThumbImg} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Section 4: Story & Visibility */}
                  {(productModalTab === 'all' || productModalTab === 'story') && modalType === 'coffee' && (
                    <div className={styles.sectionCard}>
                      <div className={styles.sectionCardHeader}>
                        <h4 className={styles.sectionCardTitle}>
                          <span className={styles.sectionCardIcon}><JournalIcon size={15} /></span>
                          <span>{t.coffeeStoryFarmerNotes}</span>
                        </h4>
                      </div>

                      <div className={styles.formGroup}>
                        <textarea
                          placeholder={t.descriptionPlaceholder}
                          value={prodForm.description || ''}
                          onChange={(e) => setProdForm((prev) => ({ ...prev, description: e.target.value }))}
                          className={styles.formTextarea}
                          style={{ minHeight: '90px' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Visibility switch */}
                  <div className={styles.switchContainer}>
                    <div className={styles.switchLabelBlock}>
                      <span className={styles.switchTitle}>{t.showInCatalog}</span>
                      <span className={styles.switchSubtitle}>{t.showInCatalogSubtitle}</span>
                    </div>
                    <label className={styles.toggleSwitch}>
                      <input
                        type="checkbox"
                        checked={prodForm.isActive ?? true}
                        onChange={(e) => setProdForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                      />
                      <span className={styles.toggleSlider} />
                    </label>
                  </div>
                </div>

                {/* Right Sticky Column: Live Product Card Preview */}
                <div className={styles.modalPreviewSidebar}>
                  <div className={styles.previewSidebarTitle}>
                    <span>{t.liveStorefrontPreview}</span>
                    <span className={styles.liveBadge}>
                      <span className={styles.liveBadgeDot} />
                      {t.liveLabel}
                    </span>
                  </div>

                  {/* The Preview Card */}
                  <div className={styles.productCard} style={{ margin: 0, boxShadow: 'var(--ad-shadow-sm)', border: '1px solid var(--ad-border-light)' }}>
                    <div className={styles.productImageWrap}>
                      {prodForm.imageUrl ? (
                        <img src={prodForm.imageUrl} alt="Preview" className={styles.productImg} />
                      ) : (
                        <div style={{ color: 'var(--ad-text-light)' }}>
                          {modalType === 'coffee' ? <CoffeeBeanIcon size={42} strokeWidth={1.2} /> : <GearIcon size={42} strokeWidth={1.2} />}
                        </div>
                      )}
                      <span className={styles.productCardCategoryBadge}>
                        {prodForm.category || t.categoryFallback}
                      </span>
                      <span className={`${styles.productCardStockBadge} ${(prodForm.stock ?? 25) <= 0 ? styles.badgeOutOfStock : styles.badgeInStock}`}>
                        {(prodForm.stock ?? 25) <= 0 ? t.soldOutBadge : `${prodForm.stock ?? 25} ${t.inStockSuffix}`}
                      </span>
                    </div>

                    <div className={styles.productCardBody}>
                      <h4 className={styles.productCardTitle}>
                        {prodForm.name || (modalType === 'coffee' ? t.specialtyCoffeeRoastNamePlaceholder : t.machineryGearSkuPlaceholder)}
                      </h4>

                      {modalType === 'coffee' && (
                        <>
                          <div className={styles.productCardOrigin}>
                            <PinLocationIcon size={12} />
                            <span>{prodForm.origin || t.terroirRegionFallback} · {prodForm.altitude || t.highAltitudeFallback}</span>
                          </div>

                          <div className={styles.roastLevelMeter}>
                            {[1, 2, 3, 4, 5].map((dot) => {
                              const activeDots = Math.min(5, Math.max(1, Math.round((prodForm.roastLevel || 50) / 20)));
                              return (
                                <span key={dot} className={`${styles.roastDot} ${dot <= activeDots ? styles.roastDotFilled : ''}`} />
                              );
                            })}
                            <span className={styles.roastMeterText}>{prodForm.roastLevel || 50}% {t.roastPctSuffix}</span>
                          </div>

                          {tastingNotesList.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '4px 0' }}>
                              {tastingNotesList.slice(0, 3).map((n) => (
                                <span key={n} style={{ fontSize: '10.5px', background: 'var(--ad-bg-subtle)', padding: '2px 6px', borderRadius: '4px', color: 'var(--ad-text-muted)' }}>
                                  {n}
                                </span>
                              ))}
                            </div>
                          )}
                        </>
                      )}

                      <div className={styles.productCardPrices} style={{ marginTop: 'auto', paddingTop: '8px' }}>
                        <div>
                          <span className={styles.price250g}>{fmtCurrency(prodForm.price || 0)}</span>
                          {modalType === 'coffee' && <span style={{ fontSize: '11px', color: 'var(--ad-text-muted)' }}> / 250g</span>}
                        </div>
                        {modalType === 'coffee' && (prodForm.price1kg || 0) > 0 && (
                          <span className={styles.price1kg}>{fmtCurrency(prodForm.price1kg || 0)} (1kg)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--ad-text-muted)', lineHeight: 1.4, background: 'var(--ad-bg-canvas)', padding: '12px', borderRadius: '10px' }}>
                    💡 <strong>{t.livePreviewColon}</strong> {t.livePreviewUpdatesText}
                  </div>
                </div>
              </div>

              {/* Pinned Bottom Footer */}
              <div className={styles.modalFooter}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`${styles.statusBadge} ${prodForm.isActive ?? true ? styles.statusActive : styles.statusHidden}`}>
                    {prodForm.isActive ?? true ? t.activeInStorefront : t.hiddenFromStorefront}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingProduct(false);
                      setSelectedProduct(null);
                    }}
                    className={styles.secondaryBtn}
                  >
                    {t.cancel}
                  </button>
                  <button type="submit" disabled={actionLoading} className={styles.primaryBtn}>
                    {actionLoading ? t.saving : t.saveProduct}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════
          MODAL 2: INLINE CATEGORY MANAGER
      ═════════════════════════════════════════════════════════ */}
      {showCategoryManager && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>{t.categoriesModalTitle}</h3>
                <span style={{ fontSize: '12px', color: 'var(--ad-text-muted)' }}>
                  {t.categoriesModalSubtitle}
                </span>
              </div>
              <button onClick={() => setShowCategoryManager(false)} className={styles.modalCloseBtn}>
                <CloseIcon size={15} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Quick Add Category Form */}
              <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  required
                  placeholder={t.categoryLabelPlaceholder}
                  value={newCatLabel}
                  onChange={(e) => setNewCatLabel(e.target.value)}
                  className={styles.formInput}
                />
                <button type="submit" disabled={actionLoading} className={styles.primaryBtn} style={{ whiteSpace: 'nowrap' }}>
                  <PlusIcon size={14} />
                  <span>{t.addCategory}</span>
                </button>
              </form>

              {/* Categories List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '360px', overflowY: 'auto' }}>
                {categories.map((c) => {
                  const count = products.filter((p) => p.category === c.slug).length;
                  const isEditing = editingCat?.id === c.id;

                  return (
                    <div
                      key={c.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: 'var(--ad-bg-canvas)',
                        borderRadius: '10px',
                        border: '1px solid var(--ad-border-subtle)',
                      }}
                    >
                      {isEditing ? (
                        <form onSubmit={handleRenameCategory} style={{ display: 'flex', gap: '8px', flex: 1, marginRight: '8px' }}>
                          <input
                            type="text"
                            required
                            value={editCatLabel}
                            onChange={(e) => setEditCatLabel(e.target.value)}
                            className={styles.formInput}
                            style={{ height: '34px' }}
                          />
                          <button type="submit" className={styles.primaryBtn} style={{ padding: '4px 12px', fontSize: '12px' }}>
                            {t.save}
                          </button>
                          <button type="button" onClick={() => setEditingCat(null)} className={styles.secondaryBtn} style={{ padding: '4px 10px', fontSize: '12px' }}>
                            <CloseIcon size={12} />
                          </button>
                        </form>
                      ) : (
                        <div>
                          <span style={{ fontWeight: 700, fontSize: '13.5px' }}>{c.label}</span>
                          <span style={{ fontSize: '11px', color: 'var(--ad-text-muted)', marginLeft: '8px' }}>
                            <code>{c.slug}</code> · <strong>{count}</strong> {t.productsSuffix}
                          </span>
                        </div>
                      )}

                      {!isEditing && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCat(c);
                              setEditCatLabel(c.label);
                            }}
                            className={styles.ghostBtn}
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                          >
                            <EditPencilIcon size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(c.id)}
                            className={styles.ghostBtn}
                            style={{ padding: '4px 8px', fontSize: '12px', color: 'var(--ad-danger)' }}
                          >
                            <TrashIcon size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <div />
              <button onClick={() => setShowCategoryManager(false)} className={styles.primaryBtn}>
                {t.done}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════
          MODAL 3: ORDER DETAILS & WORKFLOW DRAWER
      ═════════════════════════════════════════════════════════ */}
      {selectedOrder && (
        <div className={styles.modalBackdrop}>
          <div className={`${styles.modalCard} ${styles.modalCardLarge}`}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>{t.orderSpecs}</h3>
                <span style={{ fontSize: '12px', color: 'var(--ad-text-muted)' }}>
                  Order #{selectedOrder.id} · {fmtDate(selectedOrder.createdAt)}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className={styles.modalCloseBtn}>
                <CloseIcon size={15} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGrid2}>
                <div style={{ background: 'var(--ad-bg-canvas)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase' }}>
                    {t.customerInfo}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '6px' }}>
                    {selectedOrder.fullName || selectedOrder.email}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ad-text-body)', marginTop: '2px' }}>
                    {selectedOrder.email}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ad-text-body)', marginTop: '2px' }}>
                    {selectedOrder.phone || t.noPhoneProvided}
                  </div>
                  {selectedOrder.identityNumber && (
                    <div style={{ fontSize: '13px', color: 'var(--ad-text-body)', marginTop: '2px' }}>
                      {t.identityNumberLabel}: {selectedOrder.identityNumber}
                    </div>
                  )}
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ad-primary)', marginTop: '6px', textTransform: 'uppercase' }}>
                    {selectedOrder.isWholesale ? t.orderTypeWholesale : t.orderTypeRetail}
                  </div>
                </div>

                <div style={{ background: 'var(--ad-bg-canvas)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase' }}>
                    {t.address}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ad-text-body)', marginTop: '6px', lineHeight: 1.4 }}>
                    {selectedOrder.address || t.standardDeliveryAddress}
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>{t.lineItems}</div>
                <div style={{ border: '1px solid var(--ad-border-subtle)', borderRadius: '12px', overflow: 'hidden' }}>
                  {selectedOrder.items?.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--ad-border-subtle)',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--ad-text-muted)' }}>
                          {t.qtyLabel} {item.quantity} × {fmtCurrency(item.price)}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700 }}>{fmtCurrency(item.quantity * item.price)}</div>
                    </div>
                  ))}

                  <div style={{ padding: '14px 16px', background: '#faf8f5', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span>{t.subtotal}</span>
                      <span>{fmtCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span>{t.shipping}</span>
                      <span>{selectedOrder.shippingFee ? fmtCurrency(selectedOrder.shippingFee) : t.free}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '15px',
                        fontWeight: 800,
                        borderTop: '1px solid var(--ad-border-subtle)',
                        paddingTop: '8px',
                        marginTop: '4px',
                      }}
                    >
                      <span>{t.grandTotal}</span>
                      <span style={{ color: 'var(--ad-primary)' }}>{fmtCurrency(selectedOrder.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Roastery Fulfillment Workflow */}
              <div style={{ background: 'var(--ad-bg-canvas)', padding: '20px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>{t.workflowTitle}</div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedOrder.fulfillment_status === 'not_fulfilled' && (
                    <button
                      onClick={() => handleOrderAction('start_roasting')}
                      disabled={actionLoading}
                      className={styles.primaryBtn}
                    >
                      <FlameRoastIcon size={14} />
                      <span>{t.startRoasting}</span>
                    </button>
                  )}

                  {selectedOrder.fulfillment_status === 'roasting' && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%' }}>
                      <select
                        value={orderCarrier}
                        onChange={(e) => setOrderCarrier(e.target.value)}
                        className={styles.formSelect}
                        style={{ maxWidth: '240px' }}
                      >
                        {cargoProviders.map((cp) => (
                          <option key={cp.id} value={cp.name}>{cp.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleOrderAction('create_fulfillment')}
                        disabled={actionLoading}
                        className={styles.primaryBtn}
                      >
                        <OrdersIcon size={14} />
                        <span>{t.packOrder}</span>
                      </button>
                    </div>
                  )}

                  {selectedOrder.fulfillment_status === 'fulfilled' && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%' }}>
                      <input
                        type="text"
                        placeholder={t.trackingPlaceholder}
                        value={orderTracking}
                        onChange={(e) => setOrderTracking(e.target.value)}
                        className={styles.formInput}
                        style={{ maxWidth: '260px' }}
                      />
                      <button
                        onClick={() => handleOrderAction('ship_fulfillment')}
                        disabled={actionLoading || !orderTracking.trim()}
                        className={styles.primaryBtn}
                      >
                        <ShippingIcon size={14} />
                        <span>{t.dispatchOrder}</span>
                      </button>
                    </div>
                  )}

                  {selectedOrder.status !== 'canceled' && (
                    <button
                      onClick={() => handleOrderAction('cancel_order')}
                      disabled={actionLoading}
                      className={styles.secondaryBtn}
                      style={{ color: 'var(--ad-danger)' }}
                    >
                      <CloseIcon size={13} />
                      <span>{t.cancelOrder}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => window.print()} className={styles.secondaryBtn}>
                <PrinterIcon size={14} />
                <span>{t.printSlip}</span>
              </button>
              <button onClick={() => setSelectedOrder(null)} className={styles.primaryBtn}>
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════
          MODAL 4: CARRIER PROVIDER
      ═════════════════════════════════════════════════════════ */}
      {showProviderModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingProvider ? t.editCargoCarrier : t.addCargoCarrier}
              </h3>
              <button
                onClick={() => {
                  setShowProviderModal(false);
                  setEditingProvider(null);
                }}
                className={styles.modalCloseBtn}
              >
                <CloseIcon size={15} />
              </button>
            </div>

            <form onSubmit={handleSaveProvider} className={styles.modalForm}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{t.colProvider}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yurtiçi Kargo, MNG Express"
                    value={providerForm.name}
                    onChange={(e) => setProviderForm((prev) => ({ ...prev, name: e.target.value }))}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{t.colFee}</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    value={providerForm.fee}
                    onChange={(e) => setProviderForm((prev) => ({ ...prev, fee: Number(e.target.value) }))}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <div />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProviderModal(false);
                      setEditingProvider(null);
                    }}
                    className={styles.secondaryBtn}
                  >
                    {t.cancel}
                  </button>
                  <button type="submit" disabled={actionLoading} className={styles.primaryBtn}>
                    {t.saveProvider}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════
          MODAL 5: DISCOUNT COUPONS
      ═════════════════════════════════════════════════════════ */}
      {showCouponModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingCoupon ? t.editDiscountCoupon : t.newDiscountCoupon}
              </h3>
              <button
                onClick={() => {
                  setShowCouponModal(false);
                  setEditingCoupon(null);
                }}
                className={styles.modalCloseBtn}
              >
                <CloseIcon size={15} />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className={styles.modalForm}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{t.colCode}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WELCOME10, ROASTERY20"
                    value={couponForm.code}
                    onChange={(e) => setCouponForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t.discountTypeLabel}</label>
                    <select
                      value={couponForm.type}
                      onChange={(e) => setCouponForm((prev) => ({ ...prev, type: e.target.value }))}
                      className={styles.formSelect}
                    >
                      <option value="percent">{t.percentOff}</option>
                      <option value="fixed">{t.fixedOff}</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t.valueLabel} ({couponForm.type === 'percent' ? '%' : '₺'})</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={couponForm.value}
                      onChange={(e) => setCouponForm((prev) => ({ ...prev, value: Number(e.target.value) }))}
                      className={styles.formInput}
                    />
                  </div>
                </div>

                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t.minOrderAmountLabel}</label>
                    <input
                      type="number"
                      min="0"
                      value={couponForm.minOrderAmount}
                      onChange={(e) => setCouponForm((prev) => ({ ...prev, minOrderAmount: Number(e.target.value) }))}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t.maxUsesOptional}</label>
                    <input
                      type="number"
                      min="1"
                      placeholder={t.leaveEmptyUnlimited}
                      value={couponForm.maxUses}
                      onChange={(e) => setCouponForm((prev) => ({ ...prev, maxUses: e.target.value }))}
                      className={styles.formInput}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{t.expiryDateOptional}</label>
                  <input
                    type="date"
                    value={couponForm.expiresAt}
                    onChange={(e) => setCouponForm((prev) => ({ ...prev, expiresAt: e.target.value }))}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <div />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCouponModal(false);
                      setEditingCoupon(null);
                    }}
                    className={styles.secondaryBtn}
                  >
                    {t.cancel}
                  </button>
                  <button type="submit" disabled={actionLoading} className={styles.primaryBtn}>
                    {t.saveCoupon}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════
          MODAL 6: BLOG CMS EDITOR
      ═════════════════════════════════════════════════════════ */}
      {isAddingBlogPost && (
        <div className={styles.modalBackdrop}>
          <div className={`${styles.modalCard} ${styles.modalCardLarge}`}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {selectedBlogPost ? t.editJournalStory : t.writeJournalStory}
              </h3>
              <button
                onClick={() => {
                  setIsAddingBlogPost(false);
                  setSelectedBlogPost(null);
                }}
                className={styles.modalCloseBtn}
              >
                <CloseIcon size={15} />
              </button>
            </div>

            <form onSubmit={handleSaveBlogPost} className={styles.modalForm}>
              <div className={styles.modalBody}>
                <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--ad-border-subtle)', paddingBottom: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setBlogLangTab('tr')}
                    className={`${styles.viewSwitchBtn} ${blogLangTab === 'tr' ? styles.viewSwitchBtnActive : ''}`}
                  >
                    🇹🇷 Türkçe Versiyon
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlogLangTab('en')}
                    className={`${styles.viewSwitchBtn} ${blogLangTab === 'en' ? styles.viewSwitchBtnActive : ''}`}
                  >
                    🇬🇧 English Version
                  </button>
                </div>

                {blogLangTab === 'tr' ? (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>{t.colTitleTr}</label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: 2026 Hasadı: Yirgacheffe Kahve Notları"
                        value={blogForm.titleTr || ''}
                        onChange={(e) => setBlogForm((prev) => ({ ...prev, titleTr: e.target.value }))}
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>{t.articleContentTr}</label>
                      <div
                        ref={contentTrRef}
                        contentEditable
                        onInput={() => {
                          if (contentTrRef.current) {
                            setBlogForm((prev) => ({ ...prev, contentTr: contentTrRef.current?.innerHTML || '' }));
                          }
                        }}
                        className={styles.editorContentArea}
                        dangerouslySetInnerHTML={{ __html: blogForm.contentTr || '' }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>{t.colTitleEn}</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2026 Harvest: Exploring Yirgacheffe Notes"
                        value={blogForm.titleEn || ''}
                        onChange={(e) => setBlogForm((prev) => ({ ...prev, titleEn: e.target.value }))}
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>{t.articleContentEn}</label>
                      <div
                        ref={contentEnRef}
                        contentEditable
                        onInput={() => {
                          if (contentEnRef.current) {
                            setBlogForm((prev) => ({ ...prev, contentEn: contentEnRef.current?.innerHTML || '' }));
                          }
                        }}
                        className={styles.editorContentArea}
                        dangerouslySetInnerHTML={{ __html: blogForm.contentEn || '' }}
                      />
                    </div>
                  </>
                )}

                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t.blogCategoryLabel}</label>
                    <select
                      value={blogForm.category || 'culture'}
                      onChange={(e) => setBlogForm((prev) => ({ ...prev, category: e.target.value }))}
                      className={styles.formSelect}
                    >
                      <option value="culture">{t.blogCatCulture}</option>
                      <option value="brew">{t.blogCatBrewing}</option>
                      <option value="origins">{t.blogCatOrigin}</option>
                      <option value="news">{t.blogCatNews}</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t.coverImageUrl}</label>
                    <input
                      type="text"
                      placeholder={t.pasteImageUrlPlaceholder}
                      value={blogForm.imageUrl || ''}
                      onChange={(e) => setBlogForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                      className={styles.formInput}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <div />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingBlogPost(false);
                      setSelectedBlogPost(null);
                    }}
                    className={styles.secondaryBtn}
                  >
                    {t.cancel}
                  </button>
                  <button type="submit" disabled={actionLoading} className={styles.primaryBtn}>
                    {t.publishPost}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════
          MODAL 6: THERMAL BAG LABEL GENERATOR (4x6" STICKER)
      ═════════════════════════════════════════════════════════ */}
      {bagLabelProduct && (
        <div className={styles.modalBackdrop}>
          <div className={`${styles.modalCard} ${styles.modalCardMedium}`}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <h3 className={styles.modalTitle}>{t.thermalLabelTitle}</h3>
                <span className={styles.modalSubtitle}>
                  {t.thermalLabelSubtitle}
                </span>
              </div>
              <button onClick={() => setBagLabelProduct(null)} className={styles.modalCloseBtn}>
                <CloseIcon size={16} />
              </button>
            </div>

            <div className={styles.modalBody} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Controls */}
              <div className={styles.formGrid2}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{t.thermalRoastDate}</label>
                  <input
                    type="date"
                    className={styles.formInput}
                    value={bagLabelRoastDate}
                    onChange={(e) => setBagLabelRoastDate(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{t.pouchNetWeightLabel}</label>
                  <select
                    className={styles.formSelect}
                    value={bagLabelSize}
                    onChange={(e) => setBagLabelSize(e.target.value as '250g' | '1kg')}
                  >
                    <option value="250g">{t.pouch250gOption}</option>
                    <option value="1kg">{t.pouch1kgOption}</option>
                  </select>
                </div>
              </div>

              {/* 4x6" Printable Label Card */}
              <div className={styles.thermalLabelCard}>
                <div className={styles.thermalHeaderRow}>
                  <div>
                    <div className={styles.thermalBrandName}>ESTO ROASTERY</div>
                    <div className={styles.thermalBrandOrigin}>ARTISANAL SPECIALTY COFFEE • İSTANBUL</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#111' }}>{bagLabelSize.toUpperCase()}</div>
                    <div style={{ fontSize: '9px', color: '#666' }}>DEGAS VALVE SEALED</div>
                  </div>
                </div>

                <div className={styles.thermalCoffeeName}>
                  {bagLabelProduct.name}
                </div>

                <div className={styles.thermalOriginRow}>
                  <span><strong>ORIGIN:</strong> {bagLabelProduct.origin || 'Single Origin'}</span>
                  <span><strong>ALTITUDE:</strong> {bagLabelProduct.altitude || '1,800 - 2,200 MASL'}</span>
                </div>

                <div className={styles.thermalOriginRow} style={{ marginTop: '3px' }}>
                  <span><strong>VARIETAL:</strong> {bagLabelProduct.varietal || '100% Arabica'}</span>
                  <span><strong>PROCESS:</strong> {bagLabelProduct.category === 'filter' ? 'Washed Process' : 'Artisan Natural'}</span>
                </div>

                <div className={styles.thermalRoastBar}>
                  <span>ROAST LEVEL: {bagLabelProduct.roastLevel || 50}% • {bagLabelProduct.category.toUpperCase()}</span>
                </div>

                <div className={styles.thermalNotesBox}>
                  <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#444' }}>CUPPING FLAVOR PROFILE</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111', marginTop: '2px' }}>
                    {bagLabelProduct.tastingNotes || 'Bergamot, Jasmine, White Peach, Cocoa Nibs'}
                  </div>
                </div>

                <div className={styles.thermalFooterRow}>
                  <div>
                    <div className={styles.thermalRoastStamp}>ROAST DATE: {bagLabelRoastDate}</div>
                    <div style={{ fontSize: '8.5px', color: '#666', marginTop: '2px' }}>
                      Best enjoyed 7 to 28 days from roast date. Store in cool, dry space.
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <BarcodeIcon size={28} />
                    <span className={styles.thermalBarcodeNumber}>*ESTO-{bagLabelProduct.id.slice(0, 4).toUpperCase()}-{bagLabelSize}*</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <div />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setBagLabelProduct(null)} className={styles.secondaryBtn}>
                  {t.close}
                </button>
                <button onClick={() => window.print()} className={styles.primaryBtn}>
                  <PrinterIcon size={14} />
                  <span>{t.printSticker}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
