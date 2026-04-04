const { adminDb } = require('../../../utils/firebaseAdmin');
const { verifyAuth } = require('../middleware/auth');

export default async function handler(req, res) {
  try {
    const userId = await verifyAuth(req);
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Item ID required' });
    }
    
    const docRef = adminDb.collection('vaultItems').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    if (doc.data().userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    if (req.method === 'PUT') {
      const { title, encryptedData, iv, category } = req.body;
      
      const updates = {
        updatedAt: new Date().toISOString()
      };
      
      if (title) updates.title = sanitize(title);
      if (encryptedData) updates.encryptedData = encryptedData;
      if (iv) updates.iv = iv;
      if (category) updates.category = category;
      
      await docRef.update(updates);
      
      return res.status(200).json({ 
        id,
        ...doc.data(),
        ...updates
      });
    }
    
    if (req.method === 'DELETE') {
      await docRef.delete();
      return res.status(200).json({ message: 'Item deleted' });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Vault item API error:', error);
    
    if (error.message.includes('Unauthorized')) {
      return res.status(401).json({ error: error.message });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function sanitize(str) {
  return str.replace(/[<>]/g, '');
}
