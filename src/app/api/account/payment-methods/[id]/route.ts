import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { deleteCard } from '@/lib/iyzipay';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const customerId = request.headers.get('x-customer-id');
    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Not signed in.' }, { status: 401 });
    }

    const { id } = await params;
    const method = await db.paymentMethod.findUnique({ where: { id } });
    if (!method || method.customerId !== customerId) {
      return NextResponse.json({ success: false, error: 'Payment method not found.' }, { status: 404 });
    }

    const customer = await db.customer.findUnique({ where: { id: customerId } });
    if (customer?.iyzicoCardUserKey) {
      try {
        await deleteCard(customer.iyzicoCardUserKey, method.cardToken);
      } catch (err) {
        console.error('iyzico card delete error:', err);
      }
    }

    await db.paymentMethod.delete({ where: { id } });

    return NextResponse.json({ success: true, error: null });
  } catch (error) {
    console.error('Delete payment method error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
