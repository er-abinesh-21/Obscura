import { useState } from 'react';
import { KeyIcon, LockIcon, FileText, EyeIcon, EyeOffIcon, CopyIcon, CheckIcon, EditIcon, TrashIcon, LinkIcon, UserIcon } from './Icons';

export default function VaultCard({ item, onEdit, onDelete }) {
  const [showValue, setShowValue] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [displayValue, setDisplayValue] = useState('••••••••••••');
  
  const value = item.decryptedData ? (item.decryptedData.value || item.decryptedData.password || item.decryptedData.key) : '';

  const typeConfig = {
    api: { icon: KeyIcon, label: 'API Key' },
    password: { icon: LockIcon, label: 'Password' },
    note: { icon: FileText, label: 'Note' },
  };

  const config = typeConfig[item.type] || typeConfig.password;
  const Icon = config.icon;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleShowValue = () => {
    if (showValue) {
      setShowValue(false);
      setDisplayValue('••••••••••••');
    } else {
      setShowValue(true);
      if (!value) return;
      
      const chars = '!<>-_\\\\/[]{}—=+*^?#________';
      let iterations = 0;
      
      const interval = setInterval(() => {
        setDisplayValue(
          value.split('')
            .map((char, index) => {
              if (index < iterations) {
                return value[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );
        
        if (iterations >= value.length) {
          clearInterval(interval);
        }
        
        iterations += 1/3; // Speed of decryption
      }, 30);
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const renderValue = () => {
    if (!item.decryptedData) {
      return <span className="card-note-content" style={{ color: 'var(--danger)' }}>Decryption failed</span>;
    }

    if (item.type === 'note') {
      return (
        <div style={{ position: 'relative', marginTop: '14px' }}>
          <div className="card-note-content" style={{ marginTop: 0, paddingRight: '44px' }}>
            {item.decryptedData.content}
          </div>
          <button
            onClick={() => handleCopy(item.decryptedData.content)}
            className={`btn-icon tooltip ${copied ? 'success' : ''}`}
            style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--bg-card)' }}
            data-tooltip={copied ? 'Copied!' : 'Copy'}
            aria-label="Copy to clipboard"
          >
            {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
          </button>
        </div>
      );
    }

    if (!value) {
      return <span style={{ color: 'var(--text-tertiary)', fontSize: '13px', marginTop: '12px', display: 'block' }}>No value found</span>;
    }

    return (
      <div className="card-value">
        <code className={`card-code ${showValue ? 'revealed' : ''}`}>
          {displayValue}
        </code>
        <button
          onClick={toggleShowValue}
          className="btn-icon tooltip"
          data-tooltip={showValue ? 'Hide' : 'Show'}
          aria-label={showValue ? 'Hide value' : 'Show value'}
        >
          {showValue ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
        </button>
        <button
          onClick={() => handleCopy(value)}
          className={`btn-icon tooltip ${copied ? 'success' : ''}`}
          data-tooltip={copied ? 'Copied!' : 'Copy'}
          aria-label="Copy to clipboard"
        >
          {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
        </button>
      </div>
    );
  };

  return (
    <div 
      className={`card card-${item.type} animate-stagger`}
      onMouseMove={handleMouseMove}
      style={{
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`
      }}
    >
      <div className="card-glass-shine" />
      <div className="card-header">
        <div className="card-meta">
          <div className={`card-icon ${item.type}`}>
            <Icon size={20} />
          </div>
          <div className="card-info">
            <h3 className="card-title">{item.title}</h3>
            <span className={`card-badge ${item.type}`}>{config.label}</span>
          </div>
        </div>
        <div className="card-actions">
          <button onClick={onEdit} className="btn-icon tooltip" data-tooltip="Edit" aria-label="Edit item">
            <EditIcon size={16} />
          </button>
          <button onClick={onDelete} className="btn-icon danger tooltip" data-tooltip="Delete" aria-label="Delete item">
            <TrashIcon size={16} />
          </button>
        </div>
      </div>

      {renderValue()}

      {item.decryptedData?.url && (
        <div className="card-detail">
          <LinkIcon size={14} />
          <a href={item.decryptedData.url} target="_blank" rel="noopener noreferrer">
            {item.decryptedData.url}
          </a>
        </div>
      )}

      {item.decryptedData?.username && (
        <div className="card-detail">
          <UserIcon size={14} />
          <span style={{ overflowWrap: 'anywhere' }}>{item.decryptedData.username}</span>
        </div>
      )}

      <div className="card-footer">
        Updated {new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </div>
    </div>
  );
}
