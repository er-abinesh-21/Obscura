/**
 * Password strength analyzer
 * Returns strength score and feedback
 */
export function analyzePasswordStrength(password) {
  let score = 0;
  const feedback = [];

  if (!password) return { score: 0, strength: 'none', feedback: ['Password required'] };

  // Length check
  if (password.length >= 8) score += 1;
  else feedback.push('Use at least 8 characters');
  
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Character variety
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Add lowercase letters');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Add uppercase letters');
  
  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Add numbers');
  
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push('Add special characters');

  // Common patterns (weak)
  const commonPatterns = ['password', '123456', 'qwerty', 'abc123', 'letmein'];
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    score -= 2;
    feedback.push('Avoid common patterns');
  }

  let strength = 'weak';
  if (score >= 7) strength = 'strong';
  else if (score >= 5) strength = 'medium';

  return { score, strength, feedback };
}

/**
 * Generate random secure password
 */
export function generatePassword(length = 16) {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const all = lowercase + uppercase + numbers + symbols;
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  let password = '';
  for (let i = 0; i < length; i++) {
    password += all[array[i] % all.length];
  }
  
  // Ensure at least one of each type
  if (!/[a-z]/.test(password)) password = password.slice(0, -1) + lowercase[Math.floor(Math.random() * lowercase.length)];
  if (!/[A-Z]/.test(password)) password = password.slice(0, -1) + uppercase[Math.floor(Math.random() * uppercase.length)];
  if (!/[0-9]/.test(password)) password = password.slice(0, -1) + numbers[Math.floor(Math.random() * numbers.length)];
  if (!/[^a-zA-Z0-9]/.test(password)) password = password.slice(0, -1) + symbols[Math.floor(Math.random() * symbols.length)];
  
  return password;
}
