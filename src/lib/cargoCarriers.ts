/**
 * Well-known carriers for the admin "add cargo" dropdown.
 * `logo` is optional: drop a file in /public/images/cargo and set it here. Carriers without one
 * (Sürat Kargo, Kolay Gelsin) get a brand-coloured monogram badge, so the admin never sees a broken image.
 */
export interface CargoCarrier {
  slug: string;
  name: string;
  color: string;      // badge background
  textColor: string;  // badge text
  site: string;       // official site — where the account-specific tariff lives
  logo?: string;
  aliases?: string[]; // extra spellings matched against a typed name
}

export const CARGO_CARRIERS: CargoCarrier[] = [
  { slug: 'yurtici', name: 'Yurtiçi Kargo', color: '#0B3C8A', textColor: '#ffffff', site: 'https://www.yurticikargo.com', logo: '/images/cargo/yurtici.png', aliases: ['yurtici'] },
  { slug: 'aras', name: 'Aras Kargo', color: '#E30613', textColor: '#ffffff', site: 'https://www.araskargo.com.tr', logo: '/images/cargo/aras.png' },
  { slug: 'mng', name: 'MNG Kargo', color: '#F37021', textColor: '#ffffff', site: 'https://www.mngkargo.com.tr', logo: '/images/cargo/mng.png', aliases: ['mng express'] },
  { slug: 'ptt', name: 'PTT Kargo', color: '#FFCC00', textColor: '#1a1a1a', site: 'https://www.ptt.gov.tr', logo: '/images/cargo/ptt.png' },
  { slug: 'surat', name: 'Sürat Kargo', color: '#E31E24', textColor: '#ffffff', site: 'https://www.suratkargo.com.tr', aliases: ['surat'] },
  { slug: 'hepsijet', name: 'HepsiJet', color: '#FF6000', textColor: '#ffffff', site: 'https://www.hepsijet.com', logo: '/images/cargo/hepsijet.png' },
  { slug: 'trendyol', name: 'Trendyol Express', color: '#F27A1A', textColor: '#ffffff', site: 'https://www.trendyolexpress.com', logo: '/images/cargo/trendyol.png' },
  { slug: 'kolaygelsin', name: 'Kolay Gelsin', color: '#F9B000', textColor: '#1a1a1a', site: 'https://www.kolaygelsin.com' },
  { slug: 'sendeo', name: 'Sendeo', color: '#00A0DF', textColor: '#ffffff', site: 'https://www.sendeo.com.tr', logo: '/images/cargo/sendeo.jpg' },
  { slug: 'ups', name: 'UPS', color: '#351C15', textColor: '#FFB500', site: 'https://www.ups.com', logo: '/images/cargo/ups.png' },
  { slug: 'dhl', name: 'DHL Express', color: '#FFCC00', textColor: '#D40511', site: 'https://www.dhl.com', logo: '/images/cargo/dhl.png', aliases: ['dhl'] },
  { slug: 'fedex', name: 'FedEx', color: '#4D148C', textColor: '#ffffff', site: 'https://www.fedex.com', logo: '/images/cargo/fedex.png' },
];

const norm = (s: string) =>
  s.toLocaleLowerCase('tr').replace(/ı/g, 'i').replace(/[^a-z0-9ğüşöçâîû ]/g, '').replace(/\s+/g, ' ').trim()
    .normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Match a (possibly hand-typed) provider name to a known carrier. */
export function findCarrier(name: string): CargoCarrier | undefined {
  const n = norm(name);
  if (!n) return undefined;
  return CARGO_CARRIERS.find((c) =>
    [c.name, ...(c.aliases ?? [])].some((v) => {
      const x = norm(v);
      return n === x || n.startsWith(x) || x.startsWith(n) && n.length >= 3;
    })
  );
}
