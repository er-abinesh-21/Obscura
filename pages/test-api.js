import { useEffect, useState } from 'react';

export default function TestAPI() {
  const [results, setResults] = useState({});

  useEffect(() => {
    const testAPIs = async () => {
      const tests = {};

      // Test if API routes are accessible
      try {
        const res = await fetch('/api/user');
        tests.userAPI = res.status === 401 ? '✅ Route exists (401 Unauthorized - expected)' : `Status: ${res.status}`;
      } catch (err) {
        tests.userAPI = '❌ Route not found';
      }

      try {
        const res = await fetch('/api/vault');
        tests.vaultAPI = res.status === 401 ? '✅ Route exists (401 Unauthorized - expected)' : `Status: ${res.status}`;
      } catch (err) {
        tests.vaultAPI = '❌ Route not found';
      }

      setResults(tests);
    };

    testAPIs();
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'monospace' }}>
      <h1>🧪 API Routes Test</h1>
      
      <div style={{ marginTop: '30px', background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
        <h2>Test Results:</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>/api/user:</strong> {results.userAPI || 'Testing...'}
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>/api/vault:</strong> {results.vaultAPI || 'Testing...'}
          </li>
        </ul>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#e3f2fd', borderRadius: '8px' }}>
        <h3>Expected Results:</h3>
        <p>Both routes should show: <strong>✅ Route exists (401 Unauthorized - expected)</strong></p>
        <p>401 is correct because we're not sending an auth token.</p>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#fff3cd', borderRadius: '8px' }}>
        <h3>If you see "Route not found":</h3>
        <ol>
          <li>Stop the dev server (Ctrl+C)</li>
          <li>Delete .next folder: <code>rmdir /s /q .next</code></li>
          <li>Restart: <code>npm run dev</code></li>
        </ol>
      </div>

      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>← Back to Login</a>
      </div>
    </div>
  );
}
