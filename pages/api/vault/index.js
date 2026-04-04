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
      
      if (!type || !title || !encryptedData || !iv) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      if (!['api', 'password', 'note'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
      }
      
      const newItem = {
        userId,
        type,
        title: sanitize(title),
        encryptedData,
        iv,
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
