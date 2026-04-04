// Client-side encryption utilities - NEVER send master password to server

/**
 * Derives encryption key from master password using PBKDF2
 * @param {string} masterPassword - User's master password
 * @param {Uint8Array} salt - Unique salt for user
 * @returns {Promise<CryptoKey>} Derived encryption key
 */
export async function deriveKey(masterPassword, salt) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(masterPassword);
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts data using AES-256-GCM
 * @param {string} plaintext - Data to encrypt
 * @param {string} masterPassword - Master password
 * @param {Uint8Array} salt - User's salt
 * @returns {Promise<Object>} Encrypted data with iv and authTag
 */
export async function encryptData(plaintext, masterPassword, salt) {
  const key = await deriveKey(masterPassword, salt);
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    data
  );
  
  return {
    encryptedData: arrayBufferToBase64(encryptedBuffer),
    iv: arrayBufferToBase64(iv)
  };
}

/**
 * Decrypts data using AES-256-GCM
 * @param {string} encryptedData - Base64 encrypted data
 * @param {string} iv - Base64 initialization vector
 * @param {string} masterPassword - Master password
 * @param {Uint8Array} salt - User's salt
 * @returns {Promise<string>} Decrypted plaintext
 */
export async function decryptData(encryptedData, iv, masterPassword, salt) {
  const key = await deriveKey(masterPassword, salt);
  
  const encryptedBuffer = base64ToArrayBuffer(encryptedData);
  const ivBuffer = base64ToArrayBuffer(iv);
  
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBuffer },
    key,
    encryptedBuffer
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

/**
 * Generates a random salt for new users
 * @returns {Uint8Array} Random salt
 */
export function generateSalt() {
  return crypto.getRandomValues(new Uint8Array(16));
}

// Helper functions
export function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export function base64ToUint8Array(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
