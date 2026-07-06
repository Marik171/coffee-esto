// eslint-disable-next-line @typescript-eslint/no-require-imports
const Iyzipay = require('iyzipay');

if (!process.env.IYZIPAY_API_KEY || !process.env.IYZIPAY_SECRET_KEY) {
  throw new Error('IYZIPAY_API_KEY and IYZIPAY_SECRET_KEY must be set in environment variables.');
}

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY,
  secretKey: process.env.IYZIPAY_SECRET_KEY,
  uri: process.env.IYZIPAY_BASE_URL ?? 'https://sandbox-api.iyzipay.com',
});

export interface IyzipayPaymentRequest {
  conversationId: string;
  price: string;          // basket subtotal (must equal sum of basketItems prices)
  paidPrice: string;      // amount actually charged (subtotal + shipping)
  currency: string;
  installment: string;
  basketId: string;
  paymentChannel: string;
  paymentGroup: string;
  paymentCard: {
    cardHolderName: string;
    cardNumber: string;   // no spaces
    expireMonth: string;  // "MM"
    expireYear: string;   // "YYYY"
    cvc: string;
    registerCard: string;
  };
  buyer: {
    id: string;
    name: string;
    surname: string;
    gsmNumber: string;
    email: string;
    identityNumber: string;
    registrationAddress: string;
    ip: string;
    city: string;
    country: string;
    zipCode: string;
  };
  shippingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
    zipCode: string;
  };
  billingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
    zipCode: string;
  };
  basketItems: Array<{
    id: string;
    name: string;
    category1: string;
    itemType: string;
    price: string;
  }>;
}

export interface IyzipayPaymentResult {
  status: 'success' | 'failure';
  paymentId?: string;
  conversationId?: string;
  errorCode?: string;
  errorMessage?: string;
  errorGroup?: string;
}

export function createPayment(request: IyzipayPaymentRequest): Promise<IyzipayPaymentResult> {
  return new Promise((resolve, reject) => {
    iyzipay.payment.create(
      { locale: Iyzipay.LOCALE.TR, ...request },
      (err: Error | null, result: IyzipayPaymentResult) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}

export interface IyzipayActionResult {
  status: 'success' | 'failure';
  errorCode?: string;
  errorMessage?: string;
}

export function cancelPayment(paymentId: string, ip: string): Promise<IyzipayActionResult> {
  return new Promise((resolve, reject) => {
    iyzipay.cancel.create(
      {
        locale: Iyzipay.LOCALE.TR,
        conversationId: `CANCEL-${paymentId}`,
        paymentId,
        ip,
      },
      (err: Error | null, result: IyzipayActionResult) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}

export { Iyzipay };
