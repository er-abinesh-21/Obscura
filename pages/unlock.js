import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ThemeToggle from '../components/ThemeToggle';
import { LockIcon, AlertCircle } from '../components/Icons';

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
        <title>Unlock Vault — Obscura</title>
        <meta name="description" content="Enter your master password to unlock your secure vault" />
      </Head>

      <div className="auth-wrapper">
        <ThemeToggle />

        <div className="glass auth-card animate-slide-in" style={{ textAlign: 'center' }}>
          <div className="auth-header">
            <img src="/Obscura_Logo.png" alt="Obscura Logo" className="auth-icon" style={{ width: '72px', height: '72px', objectFit: 'contain' }} />
            <h1 className="auth-title">Unlock Vault</h1>
            <p className="auth-subtitle">Enter your master password to continue</p>
          </div>

          <form onSubmit={handleUnlock} id="unlock-form">
            <div className="form-group">
              <input
                id="unlock-password"
                type="password"
                className="input"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                placeholder="Master password"
                autoFocus
                style={{ textAlign: 'center', letterSpacing: '2px' }}
              />
            </div>

            {error && (
              <div className="error-box" style={{ justifyContent: 'center' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px' }}
              id="unlock-submit"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
