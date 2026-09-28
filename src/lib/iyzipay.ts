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

export interface IyzipayThreeDSInitializeResult {
  status: 'success' | 'failure';
  threeDSHtmlContent?: string; // base64-encoded HTML that redirects the customer to their bank
  errorCode?: string;
  errorMessage?: string;
}

// Starts a 3D Secure payment: the returned HTML must be shown to the customer
// (e.g. in an iframe) — it auto-submits to the issuing bank, which authenticates
// the cardholder and then POSTs the result to `request.callbackUrl`.
export function initializeThreeDSPayment(
  request: IyzipayPaymentRequest & { callbackUrl: string }
): Promise<IyzipayThreeDSInitializeResult> {
  return new Promise((resolve, reject) => {
    iyzipay.threedsInitialize.create(
      { locale: Iyzipay.LOCALE.TR, ...request },
      (err: Error | null, result: IyzipayThreeDSInitializeResult) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}

// Finalizes a 3D Secure payment after the bank has called back with a
// paymentId + conversationId — this is what actually charges the card.
export function completeThreeDSPayment(params: {
  paymentId: string;
  conversationId: string;
}): Promise<IyzipayPaymentResult> {
  return new Promise((resolve, reject) => {
    iyzipay.threedsPayment.create(
      {
        locale: Iyzipay.LOCALE.TR,
        paymentId: params.paymentId,
        conversationId: params.conversationId,
      },
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

export interface IyzipayCreateCardRequest {
  email: string;
  externalId: string;
  cardUserKey?: string; // omit to create a new cardUserKey for this customer
  card: {
    cardAlias: string;
    cardNumber: string;  // no spaces — sent to iyzico only, never persisted by us
    expireYear: string;  // "YYYY"
    expireMonth: string; // "MM"
    cardHolderName: string;
  };
}

export interface IyzipayCardResult {
  status: 'success' | 'failure';
  cardUserKey?: string;
  cardToken?: string;
  cardAlias?: string;
  binNumber?: string;
  lastFourDigits?: string;
  cardType?: string;
  cardAssociation?: string;
  cardFamily?: string;
  cardBankName?: string;
  errorCode?: string;
  errorMessage?: string;
}

export function createCard(request: IyzipayCreateCardRequest): Promise<IyzipayCardResult> {
  return new Promise((resolve, reject) => {
    iyzipay.card.create(
      { locale: Iyzipay.LOCALE.TR, ...request },
      (err: Error | null, result: IyzipayCardResult) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}

export function deleteCard(cardUserKey: string, cardToken: string): Promise<IyzipayActionResult> {
  return new Promise((resolve, reject) => {
    iyzipay.card.delete(
      { locale: Iyzipay.LOCALE.TR, cardUserKey, cardToken },
      (err: Error | null, result: IyzipayActionResult) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}

export { Iyzipay };
