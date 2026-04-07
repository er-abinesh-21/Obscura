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
      const { type, title, encryptedData, iv, category } = req.body;
      const normalizedType = normalizeType(type);
      const safeTitle = typeof title === 'string' ? title.trim() : '';
      const safeEncryptedData = typeof encryptedData === 'string' ? encryptedData.trim() : '';
      const safeIv = typeof iv === 'string' ? iv.trim() : '';
      
      if (!safeTitle || !safeEncryptedData || !safeIv) {
        return res.status(400).json({ error: 'Missing required fields: title, encryptedData, or iv' });
      }
      
      if (!normalizedType) {
        return res.status(400).json({ error: 'Invalid type. Use api, password, or note.' });
      }
      
      const newItem = {
        userId,
        type: normalizedType,
        title: sanitize(safeTitle),
        encryptedData: safeEncryptedData,
        iv: safeIv,
        category: category || 'general',
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

function normalizeType(type) {
  const value = String(type || '').trim().toLowerCase();

  if (['api', 'apikey', 'api key', 'api-key'].includes(value)) {
    return 'api';
  }

  if (['password', 'pass', 'credential', 'credentials'].includes(value)) {
    return 'password';
  }

  if (['note', 'secure note', 'secure-note', 'notes'].includes(value)) {
    return 'note';
  }

  return null;
}
