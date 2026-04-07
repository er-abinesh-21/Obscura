import { useState, useEffect } from 'react';
import { encryptData, base64ToUint8Array } from '../utils/encryption';
import { createVaultItem, updateVaultItem } from '../services/api';

function normalizeType(type) {
  const value = String(type || '').trim().toLowerCase();

  if (['api', 'apikey', 'api key', 'api-key'].includes(value)) return 'api';
  if (['password', 'pass', 'credential', 'credentials'].includes(value)) return 'password';
  if (['note', 'secure note', 'secure-note', 'notes'].includes(value)) return 'note';

  return null;
}

function getApiErrorMessage(err) {
  return err?.response?.data?.error || err?.message || 'Failed to save item';
}

export default function AddEditModal({ item, onClose, onSave }) {
  const [type, setType] = useState(item?.type || 'password');
  const [title, setTitle] = useState(item?.title || '');
  const [category, setCategory] = useState(item?.category || 'general');
  const [formData, setFormData] = useState({
    value: '',
    url: '',
    username: '',
    password: '',
    key: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item?.decryptedData) {
      setFormData(item.decryptedData);
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const masterPassword = sessionStorage.getItem('masterPassword');
      const saltBase64 = sessionStorage.getItem('salt');
      const normalizedType = normalizeType(type);

      if (!masterPassword || !saltBase64) {
        throw new Error('Session expired. Please sign in again.');
      }

      if (!normalizedType) {
        throw new Error('Invalid item type selected');
      }

      if (!title.trim()) {
        throw new Error('Title is required');
      }

      const salt = base64ToUint8Array(saltBase64);

      let dataToEncrypt = {};
      
      if (normalizedType === 'api') {
        if (!formData.key.trim()) {
          throw new Error('API key is required');
        }

        dataToEncrypt = { key: formData.key, url: formData.url };
      } else if (normalizedType === 'password') {
        if (!formData.username.trim() || !formData.password.trim()) {
          throw new Error('Username and password are required');
        }

        dataToEncrypt = { username: formData.username, password: formData.password, url: formData.url };
      } else if (normalizedType === 'note') {
        if (!formData.content.trim()) {
          throw new Error('Note content is required');
        }

        dataToEncrypt = { content: formData.content };
      }

      const { encryptedData, iv } = await encryptData(
        JSON.stringify(dataToEncrypt),
        masterPassword,
        salt
      );

      const payload = {
        type: normalizedType,
        title: title.trim(),
        encryptedData,
        iv,
        category
      };

      if (item) {
        await updateVaultItem(item.id, payload);
      } else {
        await createVaultItem(payload);
      }

      onSave();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const renderFields = () => {
    switch (type) {
      case 'api':
        return (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>API Key</label>
              <input
                type="text"
                className="input"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>URL (optional)</label>
              <input
                type="url"
                className="input"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
          </>
        );
      
      case 'password':
        return (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Username/Email</label>
              <input
                type="text"
                className="input"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Password</label>
              <input
                type="password"
                className="input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>URL (optional)</label>
              <input
                type="url"
                className="input"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
          </>
        );
      
      case 'note':
        return (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Content</label>
            <textarea
              className="input"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows="6"
              required
            />
          </div>
        );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ animation: 'fadeIn 0.3s var(--transition-curve)' }}>
      <div className="modal animate-slide-in" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '24px', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px', background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {item ? 'Edit Item' : 'Add New Item'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Type</label>
            <select
              className="input"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={!!item}
            >
              <option value="password">Password</option>
              <option value="api">API Key</option>
              <option value="note">Secure Note</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Title</label>
            <input
              type="text"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Category</label>
            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="general">General</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="dev">Development</option>
            </select>
          </div>

          {renderFields()}

          {error && (
            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
