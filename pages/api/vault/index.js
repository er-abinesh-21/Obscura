const { adminDb } = require('../../../utils/firebaseAdmin');
const { verifyAuth } = require('../middleware/auth');

export default async function handler(req, res) {
  try {
    const userId = await verifyAuth(req);
    
    if (req.method === 'GET') {
      const snapshot = await adminDb
        .collection('vaultItems')
        .where('userId', '==', userId)
        .get();
      
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return res.status(200).json({ items });
    }
    
    if (req.method === 'POST') {
      const { type, title, encryptedData, iv, category } = normalizeVaultBody(req.body);
      const normalizedType = normalizeType(type);
      const safeTitle = typeof title === 'string' ? title.trim() : '';
      const safeEncryptedData = typeof encryptedData === 'string' ? encryptedData.trim() : '';
      const safeIv = typeof iv === 'string' ? iv.trim() : '';
      const safeCategory = normalizeCategory(category);
      const missingFields = [];

      if (!safeTitle) missingFields.push('title');
      if (!safeEncryptedData) missingFields.push('encryptedData');
      if (!safeIv) missingFields.push('iv');
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          error: 'Missing required fields',
          missingFields
        });
      }
      
      if (!normalizedType) {
        return res.status(400).json({
          error: 'Invalid type. Use api, password, or note.',
          receivedType: typeof type === 'string' ? type : null
        });
      }
      
      const newItem = {
        userId,
        type: normalizedType,
        title: sanitize(safeTitle),
        encryptedData: safeEncryptedData,
        iv: safeIv,
        category: safeCategory,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const docRef = await adminDb.collection('vaultItems').add(newItem);
      
      return res.status(201).json({ 
        id: docRef.id,
        ...newItem
      });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Vault API error:', error);
    
    if (error.message.includes('Unauthorized')) {
      return res.status(401).json({ error: error.message });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function sanitize(str) {
  return str.replace(/[<>]/g, '');
}

function normalizeCategory(category) {
  const value = typeof category === 'string' ? category.trim() : '';

  if (!value) {
    return 'general';
  }

  return sanitize(value).slice(0, 64);
}

function normalizeVaultBody(rawBody) {
  const body = parseBody(rawBody);

  return {
    type: body.type ?? body.itemType ?? body.kind ?? '',
    title: body.title ?? body.name ?? '',
    encryptedData: body.encryptedData ?? body.encrypted_payload ?? body.ciphertext ?? body.data ?? '',
    iv: body.iv ?? body.initializationVector ?? body.nonce ?? '',
    category: body.category ?? body.group ?? 'general'
  };
}

function parseBody(rawBody) {
  if (!rawBody) {
    return {};
  }

  if (typeof rawBody === 'string') {
    try {
      const parsed = JSON.parse(rawBody);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  return typeof rawBody === 'object' && !Array.isArray(rawBody) ? rawBody : {};
}

function normalizeType(type) {
  const value = String(type || '').trim().toLowerCase();

  if (['api', 'apikey', 'api key', 'api-key', 'apikeys', 'api keys', 'api_keys'].includes(value)) {
    return 'api';
  }

  if (['password', 'pass', 'credential', 'credentials', 'passwords', 'login', 'logins'].includes(value)) {
    return 'password';
  }

  if (['note', 'secure note', 'secure-note', 'secure_note', 'securenote', 'notes', 'memo'].includes(value)) {
    return 'note';
  }

  return null;
}
