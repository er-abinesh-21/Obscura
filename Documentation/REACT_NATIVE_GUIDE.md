# React Native (Expo) Setup Guide

## Quick Setup

### 1. Create Expo App

```bash
npx create-expo-app obscura-mobile
cd obscura-mobile
```

### 2. Install Dependencies

```bash
npm install firebase axios expo-secure-store expo-crypto
npm install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler
```

### 3. Project Structure

```
obscura-mobile/
├── App.js
├── screens/
│   ├── LoginScreen.js
│   ├── UnlockScreen.js
│   └── DashboardScreen.js
├── components/
│   ├── VaultCard.js
│   └── AddEditModal.js
├── utils/
│   ├── encryption.js
│   └── firebase.js
└── services/
    └── api.js
```

### 4. App.js

```javascript
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import UnlockScreen from './screens/UnlockScreen';
import DashboardScreen from './screens/DashboardScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Unlock" component={UnlockScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 5. Modified Encryption (utils/encryption.js)

```javascript
import * as Crypto from 'expo-crypto';

// Use Expo's crypto for random bytes
export function generateSalt() {
  return Crypto.getRandomBytes(16);
}

// For PBKDF2, use a library like crypto-js
import CryptoJS from 'crypto-js';

export function deriveKey(masterPassword, salt) {
  return CryptoJS.PBKDF2(masterPassword, salt, {
    keySize: 256/32,
    iterations: 100000
  });
}

// AES encryption with crypto-js
export function encryptData(plaintext, masterPassword, salt) {
  const key = deriveKey(masterPassword, salt);
  const encrypted = CryptoJS.AES.encrypt(plaintext, key.toString());
  return {
    encryptedData: encrypted.toString(),
    iv: encrypted.iv.toString()
  };
}

export function decryptData(encryptedData, iv, masterPassword, salt) {
  const key = deriveKey(masterPassword, salt);
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key.toString());
  return decrypted.toString(CryptoJS.enc.Utf8);
}
```

### 6. Secure Storage (Replace sessionStorage)

```javascript
import * as SecureStore from 'expo-secure-store';

// Store
await SecureStore.setItemAsync('masterPassword', password);
await SecureStore.setItemAsync('salt', salt);

// Retrieve
const password = await SecureStore.getItemAsync('masterPassword');
const salt = await SecureStore.getItemAsync('salt');

// Delete
await SecureStore.deleteItemAsync('masterPassword');
```

### 7. Run App

```bash
npx expo start
```

Press:
- `i` for iOS simulator
- `a` for Android emulator
- Scan QR code with Expo Go app on physical device

### 8. Build for Production

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## Key Differences from Web

1. **Storage**: Use `expo-secure-store` instead of `sessionStorage`
2. **Crypto**: Use `expo-crypto` or `crypto-js` instead of Web Crypto API
3. **Navigation**: Use React Navigation instead of Next.js router
4. **Styling**: Use React Native StyleSheet instead of CSS
5. **Biometrics**: Add `expo-local-authentication` for fingerprint/face unlock

## Biometric Authentication (Optional)

```bash
npx expo install expo-local-authentication
```

```javascript
import * as LocalAuthentication from 'expo-local-authentication';

const authenticate = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  
  if (hasHardware && isEnrolled) {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Obscura',
      fallbackLabel: 'Use master password'
    });
    
    if (result.success) {
      // Unlock vault
    }
  }
};
```
