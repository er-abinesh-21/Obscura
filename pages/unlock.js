import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ThemeToggle from '../components/ThemeToggle';

export default function Unlock() {
  const [masterPassword, setMasterPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleUnlock = (e) => {
    e.preventDefault();
    
    if (!masterPassword) {
      setError('Master password required');
      return;
    }

    sessionStorage.setItem('masterPassword', masterPassword);
    router.push('/dashboard');
  };

  return (
    <>
      <Head>
        <title>Unlock Vault - Obscura</title>
        <meta name="description" content="Enter your master password to unlock your secure vault" />
      </Head>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <ThemeToggle />
      <div className="glass" style={{ padding: '64px 48px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        <div className="animate-float" style={{ fontSize: '96px', marginBottom: '32px', filter: 'drop-shadow(0 8px 16px rgba(0, 122, 255, 0.3))' }}>🔐</div>
        <h1 className="hero-title" style={{ fontSize: '42px', marginBottom: '16px' }}>Unlock Vault</h1>
        <p className="hero-subtitle" style={{ fontSize: '17px', marginBottom: '40px' }}>
          Enter your master password to continue
        </p>

        <form onSubmit={handleUnlock}>
          <input
            type="password"
            className="input"
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
            placeholder="Master password"
            autoFocus
            style={{ marginBottom: '24px', textAlign: 'center', fontSize: '17px', letterSpacing: '2px' }}
          />

          {error && (
            <div style={{ padding: '16px 20px', background: 'rgba(255, 45, 85, 0.1)', border: '1px solid rgba(255, 45, 85, 0.3)', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '15px', color: 'var(--secondary)' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '17px', padding: '16px', fontWeight: '600' }}>
            Unlock
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
