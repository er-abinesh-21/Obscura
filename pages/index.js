import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { auth } from '../utils/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { generateSalt, arrayBufferToBase64 } from '../utils/encryption';
import { createUser, getUserSalt } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import { ShieldLock, GoogleIcon, AlertCircle, MailIcon, LockIcon, KeyIcon } from '../components/Icons';

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
        <title>{isSignup ? 'Create Account' : 'Sign In'} — Obscura</title>
        <meta name="description" content="Sign in to your secure vault or create a new account" />
      </Head>

      <div className="auth-wrapper">
        <ThemeToggle />

        <div className="glass auth-card animate-slide-in">
          <div className="auth-header">
            <img src="/Obscura_Logo.png" alt="Obscura Logo" className="auth-icon" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
            <h1 className="auth-title">Obscura</h1>
            <p className="auth-subtitle">
              {isSignup ? 'Create your secure vault' : 'Welcome back'}
            </p>
          </div>

          <form onSubmit={handleSubmit} id="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">Email</label>
              <div className="input-with-icon">
                <MailIcon size={18} className="input-icon" />
                <input
                  id="auth-email"
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="auth-password">Password</label>
              <div className="input-with-icon">
                <LockIcon size={18} className="input-icon" />
                <input
                  id="auth-password"
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {isSignup && (
              <div className="form-group">
                <label className="form-label" htmlFor="auth-master">Master Password</label>
                <div className="input-with-icon">
                  <KeyIcon size={18} className="input-icon" />
                  <input
                    id="auth-master"
                    type="password"
                    className="input"
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    placeholder="For encryption only"
                    required
                  />
                </div>
                <p className="form-hint">
                  This password encrypts your data. It cannot be recovered if lost.
                </p>
              </div>
            )}

            {error && (
              <div className="error-box">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '12px', padding: '14px' }}
              disabled={loading}
              id="auth-submit"
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                  <span>Loading...</span>
                </span>
              ) : (
                <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={() => setIsSignup(!isSignup)}
              id="auth-toggle"
            >
              {isSignup ? 'Already have an account?' : 'Create account'}
            </button>

            <div className="form-divider">or</div>

            <button
              type="button"
              className="btn btn-google"
              onClick={handleGoogleSignIn}
              disabled={loading}
              id="auth-google"
            >
              <GoogleIcon size={20} />
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
