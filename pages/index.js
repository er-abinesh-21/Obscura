import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { auth } from '../utils/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { generateSalt, arrayBufferToBase64 } from '../utils/encryption';
import { createUser, getUserSalt } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';

function isNotFoundError(err) {
  const status = err?.response?.status ?? err?.status;
  return status === 404 || /status code 404/i.test(err?.message || '');
}

function getReadableError(err) {
  return err?.response?.data?.error || err?.message || 'Something went wrong';
}

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const initializeVaultProfile = async (profileEmail, token) => {
    const masterPass = prompt('No vault profile found. Set your master password (min 8 characters):');

    if (!masterPass || masterPass.length < 8) {
      throw new Error('Master password must be at least 8 characters');
    }

    const salt = generateSalt();
    const saltBase64 = arrayBufferToBase64(salt);

    await createUser(profileEmail, saltBase64, token);

    sessionStorage.setItem('masterPassword', masterPass);
    sessionStorage.setItem('salt', saltBase64);
    router.push('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        if (!masterPassword || masterPassword.length < 8) {
          throw new Error('Master password must be at least 8 characters');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        const salt = generateSalt();
        const saltBase64 = arrayBufferToBase64(salt);
        
        await createUser(email, saltBase64, token);
        
        sessionStorage.setItem('masterPassword', masterPassword);
        sessionStorage.setItem('salt', saltBase64);
        
        router.push('/dashboard');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        
        const salt = await getUserSalt(token, { allowNotFound: true });

        if (!salt) {
          await initializeVaultProfile(email, token);
          return;
        }

        sessionStorage.setItem('salt', salt);
        
        router.push('/unlock');
      }
    } catch (err) {
      setError(getReadableError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();
      const profileEmail = user.email?.trim() || '';

      if (!profileEmail) {
        throw new Error('Google account does not have an email address');
      }

      const salt = await getUserSalt(token, { allowNotFound: true });

      if (salt) {
        sessionStorage.setItem('salt', salt);
        router.push('/unlock');
      } else {
        await initializeVaultProfile(profileEmail, token);
      }
    } catch (err) {
      if (isNotFoundError(err)) {
        setError('Vault profile not found. Please try again to initialize your vault.');
      } else {
        setError(getReadableError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Obscura</title>
        <meta name="description" content="Sign in to your secure vault or create a new account" />
      </Head>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <ThemeToggle />
      <div className="glass animate-slide-in" style={{ padding: '64px 48px', maxWidth: '480px', width: '100%', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="animate-float" style={{ fontSize: '72px', marginBottom: '24px', filter: 'drop-shadow(0 8px 24px rgba(10, 132, 255, 0.4))' }}>🔒</div>
          <h1 className="hero-title" style={{ fontSize: '48px', marginBottom: '16px' }}>Obscura</h1>
          <p className="hero-subtitle" style={{ fontSize: '19px', fontWeight: '400', color: 'var(--text-secondary)' }}>
            {isSignup ? 'Create your secure vault' : 'Welcome back'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>
              Password
            </label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {isSignup && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>
                Master Password
              </label>
              <input
                type="password"
                className="input"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                placeholder="For encryption only"
                required
              />
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: '1.5' }}>
                This password encrypts your data. It cannot be recovered if lost.
              </p>
            </div>
          )}

          {error && (
            <div style={{ padding: '16px 20px', background: 'rgba(255, 45, 85, 0.1)', border: '1px solid rgba(255, 45, 85, 0.3)', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '15px', color: 'var(--secondary)' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '16px', fontSize: '17px', padding: '16px', fontWeight: '600' }} disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span>
                <span>Loading...</span>
              </span>
            ) : (
              <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
            )}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '17px', padding: '16px', fontWeight: '600' }}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? 'Already have an account?' : 'Create account'}
          </button>

          <div style={{ margin: '24px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
            or
          </div>

          <button
            type="button"
            className="btn"
            style={{ width: '100%', background: 'white', color: '#333', border: '1px solid #ddd' }}
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <span style={{ marginRight: '8px' }}>🔍</span>
            Continue with Google
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
