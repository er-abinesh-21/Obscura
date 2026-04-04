// Run this with: node check-firebase-config.js
// This will help diagnose Firebase configuration issues

require('dotenv').config({ path: '.env.local' });

console.log('\n🔍 Firebase Configuration Check\n');
console.log('================================\n');

const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

let allPresent = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value && value !== 'your_api_key' && value !== 'your_project_id' && !value.includes('your_')) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`❌ ${varName}: Missing or not configured`);
    allPresent = false;
  }
});

console.log('\n================================\n');

if (allPresent) {
  console.log('✅ All required variables are set!\n');
  console.log('Next steps:');
  console.log('1. Verify Firebase Authentication is enabled in Firebase Console');
  console.log('2. Go to: https://console.firebase.google.com/');
  console.log('3. Select your project');
  console.log('4. Click Authentication → Sign-in method');
  console.log('5. Enable "Email/Password" and "Google"\n');
} else {
  console.log('❌ Some variables are missing!\n');
  console.log('Fix:');
  console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
  console.log('2. Select your project → Project Settings');
  console.log('3. Scroll to "Your apps" → Copy config values');
  console.log('4. Update .env.local with real values\n');
}

console.log('After fixing, restart your dev server:\n');
console.log('  npm run dev\n');
