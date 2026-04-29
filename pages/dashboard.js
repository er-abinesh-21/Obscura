import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { auth } from '../utils/firebase';
import { signOut } from 'firebase/auth';
import { getVaultItems, deleteVaultItem } from '../services/api';
import { decryptData, base64ToUint8Array } from '../utils/encryption';
import VaultCard from '../components/VaultCard';
import AddEditModal from '../components/AddEditModal';
import ThemeToggle from '../components/ThemeToggle';
import { ShieldLock, LogOutIcon, PlusIcon, SearchIcon, VaultIcon, LockIcon, AlertCircle } from '../components/Icons';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [decryptedItems, setDecryptedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [decryptError, setDecryptError] = useState(null);
  const [showReenterPassword, setShowReenterPassword] = useState(false);
  const [newMasterPassword, setNewMasterPassword] = useState('');
  const [reDecrypting, setReDecrypting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const masterPassword = sessionStorage.getItem('masterPassword');
    const salt = sessionStorage.getItem('salt');
    
    if (!masterPassword || !salt) {
      router.push('/');
      return;
    }

    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await getVaultItems();
      const safeData = Array.isArray(data) ? data : [];

      setItems(safeData);
      await decryptItems(safeData);
    } catch (error) {
      console.error('Load error:', error);
      setItems([]);
      setDecryptedItems([]);
    } finally {
      setLoading(false);
    }
  };

  const decryptItems = async (itemsToDecrypt = []) => {
    const masterPassword = sessionStorage.getItem('masterPassword');
    const saltBase64 = sessionStorage.getItem('salt');

    if (!masterPassword || !saltBase64) {
      setDecryptedItems([]);
      return;
    }

    const safeItems = Array.isArray(itemsToDecrypt) ? itemsToDecrypt : [];
    const salt = base64ToUint8Array(saltBase64);
    
    let failCount = 0;
    let firstError = null;

    const decrypted = await Promise.all(
      safeItems.map(async (item) => {
        try {
          if (!item.encryptedData || !item.iv) {
            failCount++;
            return { ...item, decryptedData: null, error: 'Missing encrypted data' };
          }
          const plaintext = await decryptData(item.encryptedData, item.iv, masterPassword, salt);
          return { ...item, decryptedData: JSON.parse(plaintext) };
        } catch (error) {
          failCount++;
          if (!firstError) firstError = error;
          console.error(`[Decrypt] Failed for "${item.title}":`, error.name, error.message);
          return { ...item, decryptedData: null, error: 'Decryption failed' };
        }
      })
    );
    
    // If ALL items failed, it's almost certainly a wrong master password
    if (safeItems.length > 0 && failCount === safeItems.length) {
      const errorName = firstError?.name || '';
      if (errorName === 'OperationError') {
        setDecryptError('wrong_password');
      } else {
        setDecryptError('unknown');
      }
    } else if (failCount > 0) {
      setDecryptError('partial');
    } else {
      setDecryptError(null);
    }

    setDecryptedItems(decrypted);
  };

  const handleReenterPassword = async (e) => {
    e.preventDefault();
    if (!newMasterPassword) return;

    setReDecrypting(true);
    sessionStorage.setItem('masterPassword', newMasterPassword);
    
    setDecryptError(null);
    await decryptItems(items);
    
    setReDecrypting(false);
    setNewMasterPassword('');
    setShowReenterPassword(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    
    try {
      await deleteVaultItem(id);
      setItems((prev) => (Array.isArray(prev) ? prev.filter((i) => i.id !== id) : []));
      setDecryptedItems((prev) => (Array.isArray(prev) ? prev.filter((i) => i.id !== id) : []));
    } catch (error) {
      alert('Delete failed');
    }
  };

  const handleLogout = async () => {
    sessionStorage.clear();
    await signOut(auth);
    router.push('/');
  };

  const safeItems = Array.isArray(items) ? items : [];
  const safeDecryptedItems = Array.isArray(decryptedItems) ? decryptedItems : [];

  const filteredItems = safeDecryptedItems.filter((item) => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = (item.title || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <>
        <Head><title>Loading — Obscura</title></Head>
        <div className="loading-screen">
          <div className="spinner" style={{ width: '48px', height: '48px' }} />
          <p className="loading-text">Decrypting your vault...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard — Obscura</title>
        <meta name="description" content="Manage your secure vault - API keys, passwords, and notes" />
      </Head>

      <div className="container animate-slide-in">
        <ThemeToggle />

        <div className="dashboard-header animate-fade-in">
          <div>
            <div className="dashboard-brand">
              <img src="/Obscura_Logo.png" alt="Obscura Logo" className="dashboard-logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              <h1 className="dashboard-title">Obscura</h1>
            </div>
            <div className="dashboard-count" style={{ marginTop: '8px' }}>
              <strong>{safeItems.length}</strong>
              <span>{safeItems.length === 1 ? 'item' : 'items'} stored securely</span>
            </div>
          </div>

          <div className="dashboard-actions">
            <button
              onClick={() => { setEditItem(null); setShowModal(true); }}
              className="btn btn-primary btn-add-desktop"
              id="add-item-btn"
            >
              <PlusIcon size={18} />
              New Item
            </button>
            <button onClick={handleLogout} className="btn btn-logout" id="logout-btn">
              <LogOutIcon size={16} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Wrong password banner */}
        {decryptError === 'wrong_password' && (
          <div className="decrypt-error-banner animate-fade-in">
            <div className="decrypt-error-content">
              <AlertCircle size={22} />
              <div>
                <strong>Unable to decrypt your vault</strong>
                <p>The master password you entered appears to be incorrect. All {safeItems.length} items could not be decrypted.</p>
              </div>
            </div>
            {!showReenterPassword ? (
              <button
                onClick={() => setShowReenterPassword(true)}
                className="btn btn-primary"
                id="reenter-password-btn"
              >
                <LockIcon size={16} />
                Re-enter Master Password
              </button>
            ) : (
              <form onSubmit={handleReenterPassword} className="reenter-form">
                <input
                  type="password"
                  className="input"
                  placeholder="Enter correct master password"
                  value={newMasterPassword}
                  onChange={(e) => setNewMasterPassword(e.target.value)}
                  autoFocus
                  id="reenter-password-input"
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={reDecrypting || !newMasterPassword}
                  id="reenter-submit-btn"
                >
                  {reDecrypting ? 'Decrypting...' : 'Unlock'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => { setShowReenterPassword(false); setNewMasterPassword(''); }}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        )}

        {decryptError === 'partial' && (
          <div className="decrypt-error-banner partial animate-fade-in">
            <AlertCircle size={18} />
            <span>Some items could not be decrypted. They may have been encrypted with a different master password.</span>
          </div>
        )}

        <div className="dashboard-controls animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="input-with-icon search-input">
            <SearchIcon size={18} className="input-icon" />
            <input
              id="search-vault"
              type="text"
              className="input"
              placeholder="Search your vault..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select
            id="filter-type"
            className="input filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Items</option>
            <option value="api">API Keys</option>
            <option value="password">Passwords</option>
            <option value="note">Notes</option>
          </select>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid">
            {filteredItems.map((item, index) => (
              <div key={item.id} style={{ animationDelay: `${index * 0.05}s` }}>
                <VaultCard
                  item={item}
                  onEdit={() => { setEditItem(item); setShowModal(true); }}
                  onDelete={() => handleDelete(item.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <VaultIcon size={80} className="empty-icon" />
            <h3 className="empty-title">No items yet</h3>
            <p className="empty-desc">
              Start securing your secrets by creating your first vault item.
            </p>
          </div>
        )}

        {/* Mobile FAB */}
        <button
          className="btn-fab"
          onClick={() => { setEditItem(null); setShowModal(true); }}
          aria-label="Add new item"
          id="add-item-fab"
        >
          <PlusIcon size={24} />
        </button>

        {showModal && (
          <AddEditModal
            item={editItem}
            onClose={() => { setShowModal(false); setEditItem(null); }}
            onSave={() => { loadItems(); setShowModal(false); setEditItem(null); }}
          />
        )}
      </div>
    </>
  );
}
