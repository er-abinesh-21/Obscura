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

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [decryptedItems, setDecryptedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
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
      setItems(data);
      await decryptItems(data);
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const decryptItems = async (itemsToDecrypt) => {
    const masterPassword = sessionStorage.getItem('masterPassword');
    const salt = base64ToUint8Array(sessionStorage.getItem('salt'));
    
    const decrypted = await Promise.all(
      itemsToDecrypt.map(async (item) => {
        try {
          const plaintext = await decryptData(item.encryptedData, item.iv, masterPassword, salt);
          return { ...item, decryptedData: JSON.parse(plaintext) };
        } catch (error) {
          return { ...item, decryptedData: null, error: 'Decryption failed' };
        }
      })
    );
    
    setDecryptedItems(decrypted);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    
    try {
      await deleteVaultItem(id);
      setItems(items.filter(i => i.id !== id));
      setDecryptedItems(decryptedItems.filter(i => i.id !== id));
    } catch (error) {
      alert('Delete failed');
    }
  };

  const handleLogout = async () => {
    sessionStorage.clear();
    await signOut(auth);
    router.push('/');
  };

  const filteredItems = decryptedItems.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading - Obscura</title>
        </Head>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px' }}>
          <div className="spinner" style={{ width: '56px', height: '56px', borderWidth: '3px' }}></div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '17px', fontWeight: '500' }}>Loading your vault...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - Obscura</title>
        <meta name="description" content="Manage your secure vault - API keys, passwords, and notes" />
      </Head>
      <div className="container animate-slide-in">
      <ThemeToggle />
      <div className="dashboard-header animate-fade-in">
        <div>
          <h1 className="hero-title" style={{ fontSize: '56px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            Obscura
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '19px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{items.length}</span>
            <span>{items.length === 1 ? 'item' : 'items'} stored securely</span>
          </p>
        </div>
        <button onClick={handleLogout} className="btn btn-logout">
          Sign Out
        </button>
      </div>

      <div className="dashboard-controls animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <input
          type="text"
          className="input search-input"
          placeholder="Search your vault..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <select
          className="input filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Items</option>
          <option value="api">API Keys</option>
          <option value="password">Passwords</option>
          <option value="note">Notes</option>
        </select>

        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="btn btn-primary" style={{ padding: '14px 32px', whiteSpace: 'nowrap' }}>
          New Item
        </button>
      </div>

      <div className="grid">
        {filteredItems.map(item => (
          <VaultCard
            key={item.id}
            item={item}
            onEdit={() => { setEditItem(item); setShowModal(true); }}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '120px 20px', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '96px', marginBottom: '32px', opacity: '0.3' }}>📦</div>
          <h3 style={{ fontSize: '28px', marginBottom: '12px', color: 'var(--text-primary)', fontWeight: '600', letterSpacing: '-0.5px' }}>No items yet</h3>
          <p style={{ fontSize: '17px', maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>Start securing your secrets by creating your first vault item.</p>
        </div>
      )}

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
