import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const customerId = request.headers.get('x-customer-id');
    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Not signed in.' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await db.address.findUnique({ where: { id } });
    if (!existing || existing.customerId !== customerId) {
      return NextResponse.json({ success: false, error: 'Address not found.' }, { status: 404 });
    }

    const body = await request.json();
    const { fullName, address, city, zipCode, phone, isDefault } = body as {
      fullName?: string;
      address?: string;
      city?: string;
      zipCode?: string;
      phone?: string;
      isDefault?: boolean;
    };

    if (isDefault) {
      await db.address.updateMany({ where: { customerId }, data: { isDefault: false } });
    }

    const updated = await db.address.update({
      where: { id },
      data: {
        ...(fullName !== undefined && { fullName: fullName.trim() }),
        ...(address !== undefined && { address: address.trim() }),
        ...(city !== undefined && { city: city.trim() }),
        ...(zipCode !== undefined && { zipCode: zipCode.trim() }),
        ...(phone !== undefined && { phone: phone.trim() }),
        ...(isDefault !== undefined && { isDefault }),
      },
    });

    return NextResponse.json({ success: true, data: updated, error: null });
  } catch (error) {
    console.error('Update address error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const customerId = request.headers.get('x-customer-id');
    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Not signed in.' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await db.address.findUnique({ where: { id } });
    if (!existing || existing.customerId !== customerId) {
      return NextResponse.json({ success: false, error: 'Address not found.' }, { status: 404 });
    }

    await db.address.delete({ where: { id } });

    return NextResponse.json({ success: true, error: null });
  } catch (error) {
    console.error('Delete address error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
