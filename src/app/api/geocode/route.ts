import { NextResponse } from 'next/server';

interface NominatimResult {
  display_name: string;
  address?: {
    house_number?: string;
    road?: string;
    suburb?: string;
    town?: string;
    city?: string;
    city_district?: string;
    county?: string;
    state?: string;
    province?: string;
    postcode?: string;
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  if (!query || query.length < 3) {
    return NextResponse.json({ success: true, data: [] });
  }

  try {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('countrycodes', 'tr');
    url.searchParams.set('limit', '5');
    url.searchParams.set('q', query);

    const res = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'CoffeeEstoRoastery/1.0 (checkout address autocomplete)',
        'Accept-Language': 'tr',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Address lookup failed.', data: [] }, { status: 502 });
    }

    const results = (await res.json()) as NominatimResult[];

    const suggestions = results.map((r) => {
      const a = r.address || {};
      const street = [a.road, a.house_number].filter(Boolean).join(' ');
      const city = a.town || a.city || a.city_district || a.county || '';
      const province = a.province || a.state || '';
      return {
        label: r.display_name,
        address: street || r.display_name,
        city,
        province,
        postcode: a.postcode || '',
      };
    });

    return NextResponse.json({ success: true, data: suggestions, error: null });
  } catch (error) {
    console.error('Geocode lookup failed:', error);
    return NextResponse.json({ success: false, error: 'Internal error during address lookup.', data: [] }, { status: 500 });
  }
}
