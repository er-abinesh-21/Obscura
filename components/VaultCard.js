import { useState } from 'react';

export default function VaultCard({ item, onEdit, onDelete }) {
  const [showValue, setShowValue] = useState(false);
  const [copied, setCopied] = useState(false);

  const getIcon = () => {
    switch (item.type) {
      case 'api': return '🔑';
      case 'password': return '🔐';
      case 'note': return '📝';
      default: return '📄';
    }
  };

  const getTypeColor = () => {
    switch (item.type) {
      case 'api': return '#FF9500';
      case 'password': return '#007AFF';
      case 'note': return '#FF2D55';
      default: return '#98989D';
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderValue = () => {
    if (!item.decryptedData) return <span style={{ color: 'var(--secondary)' }}>Decryption failed</span>;

    if (item.type === 'note') {
      return <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.7', marginTop: '16px', letterSpacing: '-0.2px' }}>{item.decryptedData.content}</p>;
    }

    const value = item.decryptedData.value || item.decryptedData.password || item.decryptedData.key;
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
        <code style={{ flex: 1, padding: '14px 18px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', border: '1px solid var(--border)', fontFamily: '"JetBrains Mono", "SF Mono", Monaco, monospace', letterSpacing: '0.5px', transition: 'all 0.3s' }}>
          {showValue ? value : '••••••••••••'}
        </code>
        <button
          onClick={() => setShowValue(!showValue)}
          className="btn btn-secondary tooltip"
          data-tooltip={showValue ? 'Hide' : 'Show'}
          style={{ padding: '12px 16px', fontSize: '15px', minWidth: '56px' }}
        >
          {showValue ? '👁️' : '👁️‍🗨️'}
        </button>
        <button
          onClick={() => handleCopy(value)}
          className="btn btn-secondary tooltip"
          data-tooltip={copied ? 'Copied' : 'Copy'}
          style={{ padding: '12px 16px', fontSize: '15px', minWidth: '56px', background: copied ? 'rgba(52, 199, 89, 0.15)' : undefined, borderColor: copied ? 'rgba(52, 199, 89, 0.3)' : undefined }}
        >
          {copied ? '✓' : '📋'}
        </button>
      </div>
    );
  };

  return (
    <div className="card animate-fade-in" style={{ animationDelay: `${Math.random() * 0.2}s` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
          <span style={{ fontSize: '36px', lineHeight: 1 }}>{getIcon()}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: '19px', marginBottom: '8px', fontWeight: '600', letterSpacing: '-0.3px', lineHeight: '1.3' }}>{item.title}</h3>
            <span className="badge" style={{ fontSize: '11px', color: getTypeColor(), background: `${getTypeColor()}15`, border: `1px solid ${getTypeColor()}30`, fontWeight: '600' }}>
              {item.type}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
          <button onClick={onEdit} className="tooltip" data-tooltip="Edit" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '16px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ✏️
          </button>
          <button onClick={onDelete} className="tooltip" data-tooltip="Delete" style={{ background: 'rgba(255, 45, 85, 0.08)', border: '1px solid rgba(255, 45, 85, 0.2)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '16px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            🗑️
          </button>
        </div>
      </div>

      {renderValue()}

      {item.decryptedData?.url && (
        <div style={{ marginTop: '14px', fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ opacity: 0.6 }}>🔗</span>
          <a href={item.decryptedData.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', transition: 'color 0.2s' }}>
            {item.decryptedData.url}
          </a>
        </div>
      )}

      {item.decryptedData?.username && (
        <div style={{ marginTop: '10px', fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ opacity: 0.6 }}>👤</span>
          <span>{item.decryptedData.username}</span>
        </div>
      )}

      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-secondary)', opacity: 0.6, letterSpacing: '-0.1px' }}>
        Updated {new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </div>
    </div>
  );
}
