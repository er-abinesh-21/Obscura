import { useEffect, useState } from 'react';
import { auth } from '../utils/firebase';

export default function TestFirebase() {
  const [status, setStatus] = useState({});

  useEffect(() => {
    const checkFirebase = async () => {
      const checks = {
        apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        firebaseInitialized: !!auth,
      };

      // Test if we can reach Firebase
      try {
        await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: 'test' })
        });
      } catch (error) {
        checks.firebaseReachable = true; // If we get an error, Firebase is reachable (just invalid token)
      }

      setStatus(checks);
    };

    checkFirebase();
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🔍 Firebase Setup Check</h1>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Environment Variables</h2>
        <ul>
          <li>API Key: {status.apiKey ? '✅' : '❌'}</li>
          <li>Auth Domain: {status.authDomain ? '✅' : '❌'}</li>
          <li>Project ID: {status.projectId ? '✅' : '❌'}</li>
          <li>Firebase Initialized: {status.firebaseInitialized ? '✅' : '❌'}</li>
        </ul>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h3>Next Steps:</h3>
        <ol>
          <li>Go to <a href="https://console.firebase.google.com" target="_blank">Firebase Console</a></li>
          <li>Select your project</li>
          <li>Click <strong>Authentication</strong> → <strong>Sign-in method</strong></li>
          <li>Enable <strong>Email/Password</strong></li>
          <li>Enable <strong>Google</strong></li>
          <li>Go to <strong>Firestore Database</strong> → Create database</li>
          <li>Restart dev server: <code>npm run dev</code></li>
        </ol>
      </div>

      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>← Back to Login</a>
      </div>
    </div>
  );
}
