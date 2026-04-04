const { adminDb } = require('../../utils/firebaseAdmin');
const { verifyAuth } = require('./middleware/auth');

export default async function handler(req, res) {
  try {
    const userId = await verifyAuth(req);
    
    if (req.method === 'GET') {
      const userDoc = await adminDb.collection('users').doc(userId).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      return res.status(200).json({ 
        salt: userDoc.data().salt 
      });
    }
    
    if (req.method === 'POST') {
      const { email, salt } = req.body;
      
      if (!salt) {
        return res.status(400).json({ error: 'Salt required' });
      }
      
      await adminDb.collection('users').doc(userId).set({
        uid: userId,
        email,
        salt,
        createdAt: new Date().toISOString()
      });
      
      return res.status(201).json({ message: 'User created' });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('User API error:', error);
    
    if (error.message.includes('Unauthorized')) {
      return res.status(401).json({ error: error.message });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
}
