import { useState, useEffect } from 'react';
import { encryptData, base64ToUint8Array } from '../utils/encryption';
import { createVaultItem, updateVaultItem } from '../services/api';
import { AlertCircle } from './Icons';

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
  const [type, setType] = useState(normalizeType(item?.type) || 'password');
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

    if (item?.type) {
      setType(normalizeType(item.type) || 'password');
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

      const safeEncryptedData = typeof encryptedData === 'string' ? encryptedData.trim() : '';
      const safeIv = typeof iv === 'string' ? iv.trim() : '';

      if (!safeEncryptedData || !safeIv) {
        throw new Error('Encryption failed. Please try again.');
      }

      const payload = {
        type: normalizedType,
        title: title.trim(),
        encryptedData: safeEncryptedData,
        iv: safeIv,
        category: String(category || 'general').trim() || 'general'
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
            <div className="form-group">
              <label className="form-label" htmlFor="modal-api-key">API Key</label>
              <input
                id="modal-api-key"
                type="text"
                className="input"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="modal-api-url">URL (optional)</label>
              <input
                id="modal-api-url"
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
            <div className="form-group">
              <label className="form-label" htmlFor="modal-username">Username / Email</label>
              <input
                id="modal-username"
                type="text"
                className="input"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="modal-password">Password</label>
              <input
                id="modal-password"
                type="password"
                className="input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="modal-pass-url">URL (optional)</label>
              <input
                id="modal-pass-url"
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
          <div className="form-group">
            <label className="form-label" htmlFor="modal-content">Content</label>
            <textarea
              id="modal-content"
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{item ? 'Edit Item' : 'Add New Item'}</h2>

        <form onSubmit={handleSubmit} id="vault-item-form">
          <div className="form-group">
            <label className="form-label" htmlFor="modal-type">Type</label>
            <select
              id="modal-type"
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

          <div className="form-group">
            <label className="form-label" htmlFor="modal-title">Title</label>
            <input
              id="modal-title"
              type="text"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="modal-category">Category</label>
            <select
              id="modal-category"
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
            <div className="error-box">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={loading} id="modal-save">
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary" id="modal-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
