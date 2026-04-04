// Encryption Test Suite
// Run this in browser console to test encryption functionality

console.log('🧪 Starting Obscura Encryption Tests...\n');

// Test 1: Generate Salt
console.log('Test 1: Generate Salt');
try {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  console.log('✅ Salt generated:', salt.length, 'bytes');
  console.assert(salt.length === 16, 'Salt should be 16 bytes');
} catch (error) {
  console.error('❌ Salt generation failed:', error);
}

// Test 2: Key Derivation (PBKDF2)
console.log('\nTest 2: Key Derivation (PBKDF2)');
async function testKeyDerivation() {
  try {
    const password = 'TestPassword123!';
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveKey']
    );
    
    const key = await crypto.subtle.deriveKey(
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
    
    console.log('✅ Key derived successfully');
    console.log('   Algorithm:', key.algorithm.name);
    console.log('   Key length:', key.algorithm.length, 'bits');
    return key;
  } catch (error) {
    console.error('❌ Key derivation failed:', error);
  }
}

// Test 3: Encryption
console.log('\nTest 3: AES-256-GCM Encryption');
async function testEncryption() {
  try {
    const plaintext = 'Secret API Key: sk_test_123456789';
    const password = 'TestPassword123!';
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    // Derive key
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const keyMaterial = await crypto.subtle.importKey('raw', passwordBuffer, 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    
    // Encrypt
    const data = encoder.encode(plaintext);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      data
    );
    
    console.log('✅ Encryption successful');
    console.log('   Plaintext length:', plaintext.length, 'chars');
    console.log('   Encrypted length:', encryptedBuffer.byteLength, 'bytes');
    console.log('   IV length:', iv.length, 'bytes');
    
    return { encryptedBuffer, iv, salt, password };
  } catch (error) {
    console.error('❌ Encryption failed:', error);
  }
}

// Test 4: Decryption
console.log('\nTest 4: AES-256-GCM Decryption');
async function testDecryption() {
  try {
    const { encryptedBuffer, iv, salt, password } = await testEncryption();
    
    // Derive key again
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const keyMaterial = await crypto.subtle.importKey('raw', passwordBuffer, 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    
    // Decrypt
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encryptedBuffer
    );
    
    const decoder = new TextDecoder();
    const decrypted = decoder.decode(decryptedBuffer);
    
    console.log('✅ Decryption successful');
    console.log('   Decrypted text:', decrypted);
    console.assert(decrypted === 'Secret API Key: sk_test_123456789', 'Decrypted text should match original');
  } catch (error) {
    console.error('❌ Decryption failed:', error);
  }
}

// Test 5: Wrong Password Fails
console.log('\nTest 5: Wrong Password Should Fail');
async function testWrongPassword() {
  try {
    const plaintext = 'Secret data';
    const correctPassword = 'CorrectPassword123!';
    const wrongPassword = 'WrongPassword123!';
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    // Encrypt with correct password
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(correctPassword);
    const keyMaterial = await crypto.subtle.importKey('raw', passwordBuffer, 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    
    const data = encoder.encode(plaintext);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, data);
    
    // Try to decrypt with wrong password
    const wrongPasswordBuffer = encoder.encode(wrongPassword);
    const wrongKeyMaterial = await crypto.subtle.importKey('raw', wrongPasswordBuffer, 'PBKDF2', false, ['deriveKey']);
    const wrongKey = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
      wrongKeyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    
    try {
      await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, wrongKey, encryptedBuffer);
      console.error('❌ Should have failed with wrong password');
    } catch (decryptError) {
      console.log('✅ Correctly failed with wrong password');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Test 6: Unique IVs
console.log('\nTest 6: Unique IVs for Each Encryption');
function testUniqueIVs() {
  const iv1 = crypto.getRandomValues(new Uint8Array(12));
  const iv2 = crypto.getRandomValues(new Uint8Array(12));
  
  const same = iv1.every((val, idx) => val === iv2[idx]);
  
  if (!same) {
    console.log('✅ IVs are unique');
  } else {
    console.error('❌ IVs are not unique (extremely unlikely)');
  }
}

// Test 7: Base64 Encoding/Decoding
console.log('\nTest 7: Base64 Encoding/Decoding');
function testBase64() {
  try {
    const data = new Uint8Array([1, 2, 3, 4, 5]);
    
    // Encode
    let binary = '';
    for (let i = 0; i < data.length; i++) {
      binary += String.fromCharCode(data[i]);
    }
    const base64 = btoa(binary);
    
    // Decode
    const decodedBinary = atob(base64);
    const decoded = new Uint8Array(decodedBinary.length);
    for (let i = 0; i < decodedBinary.length; i++) {
      decoded[i] = decodedBinary.charCodeAt(i);
    }
    
    const match = data.every((val, idx) => val === decoded[idx]);
    
    if (match) {
      console.log('✅ Base64 encoding/decoding works');
    } else {
      console.error('❌ Base64 encoding/decoding failed');
    }
  } catch (error) {
    console.error('❌ Base64 test failed:', error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔒 OBSCURA ENCRYPTION TEST SUITE');
  console.log('═══════════════════════════════════════════════════════\n');
  
  await testKeyDerivation();
  await testEncryption();
  await testDecryption();
  await testWrongPassword();
  testUniqueIVs();
  testBase64();
  
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('✅ All encryption tests completed!');
  console.log('═══════════════════════════════════════════════════════');
}

// Auto-run tests
runAllTests();
