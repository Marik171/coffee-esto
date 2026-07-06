function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`${name} environment variable is not set.`);
  return val;
}

// Resolved once at module load — throws immediately if the secret is missing
// so misconfiguration surfaces at startup, not at the first login attempt.
const JWT_SECRET = requireEnv('JWT_SECRET');

// Encode a string to an ArrayBuffer (compatible with crypto.subtle)
function stringToBuffer(str: string): ArrayBuffer {
  return new TextEncoder().encode(str).buffer as ArrayBuffer;
}

// Encode an ArrayBuffer to a Base64URL string
function bufferToBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Decode a Base64URL string back to an ArrayBuffer
function base64UrlToBuffer(b64url: string): ArrayBuffer {
  let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  const binary = atob(b64);
  const buf = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) buf[i] = binary.charCodeAt(i);
  return buf.buffer as ArrayBuffer;
}

async function getCryptoKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    stringToBuffer(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signToken(
  payload: Record<string, unknown>,
  expiresInSeconds = 86400
): Promise<string> {
  const key = await getCryptoKey();
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const encodedHeader  = bufferToBase64Url(stringToBuffer(JSON.stringify(header)));
  const encodedPayload = bufferToBase64Url(stringToBuffer(JSON.stringify({ ...payload, exp })));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  const signature = await crypto.subtle.sign('HMAC', key, stringToBuffer(dataToSign));
  return `${dataToSign}.${bufferToBase64Url(signature)}`;
}

export async function verifyToken(token: string): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const key = await getCryptoKey();

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      base64UrlToBuffer(encodedSignature),
      stringToBuffer(`${encodedHeader}.${encodedPayload}`)
    );
    if (!isValid) return null;

    const payload = JSON.parse(
      new TextDecoder().decode(base64UrlToBuffer(encodedPayload))
    ) as Record<string, unknown>;

    if (typeof payload.exp === 'number' && Date.now() / 1000 > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}
