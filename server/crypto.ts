import crypto from 'crypto';

/**
 * Encryption utility for sensitive data (CPF, phone, address, etc.)
 * Uses AES-256-GCM for authenticated encryption
 * 
 * IMPORTANT: The encryption key is derived from JWT_SECRET
 * This ensures the same key is used for all encrypted data
 */

const ALGORITHM = 'aes-256-gcm';
const SALT_LENGTH = 16;
const TAG_LENGTH = 16;
const IV_LENGTH = 12;

function getEncryptionKey(): Buffer {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required for encryption');
  }
  
  // Derive a 32-byte key from the JWT_SECRET using SHA-256
  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypt sensitive data
 * Returns: base64(iv + tag + ciphertext)
 */
export function encryptSensitive(plaintext: string | null | undefined): string | null {
  if (!plaintext) return null;
  
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    
    const tag = cipher.getAuthTag();
    
    // Combine: IV (12 bytes) + tag (16 bytes) + ciphertext
    const combined = Buffer.concat([iv, tag, encrypted]);
    return combined.toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt sensitive data');
  }
}

/**
 * Decrypt sensitive data
 * Expects: base64(iv + tag + ciphertext)
 */
export function decryptSensitive(encrypted: string | null | undefined): string | null {
  if (!encrypted) return null;
  
  try {
    const key = getEncryptionKey();
    const combined = Buffer.from(encrypted, 'base64');
    
    // Extract components
    const iv = combined.slice(0, IV_LENGTH);
    const tag = combined.slice(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const ciphertext = combined.slice(IV_LENGTH + TAG_LENGTH);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);
    
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt sensitive data');
  }
}

/**
 * Hash for verification (one-way, not reversible)
 * Useful for comparing CPF/phone without storing plaintext
 */
export function hashSensitive(plaintext: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required for hashing');
  }
  
  return crypto
    .createHmac('sha256', secret)
    .update(plaintext)
    .digest('hex');
}
