// Temporary debug endpoint - shows vault item structure (no sensitive data)
const { adminDb } = require('../../utils/firebaseAdmin');
const { verifyAuth } = require('./middleware/auth');

export default async function handler(req, res) {
  try {
    const userId = await verifyAuth(req);
    
    // Get user salt
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : null;
    
    // Get first 3 vault items (structure only, no full encrypted data)
    const snapshot = await adminDb
      .collection('vaultItems')
      .where('userId', '==', userId)
      .limit(3)
      .get();
    
    const items = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type,
        title: data.title,
        hasEncryptedData: !!data.encryptedData,
        encryptedDataLength: data.encryptedData?.length || 0,
        encryptedDataPreview: data.encryptedData?.substring(0, 20) + '...',
        hasIv: !!data.iv,
        ivLength: data.iv?.length || 0,
        ivPreview: data.iv?.substring(0, 20) + '...',
        category: data.category,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        // Check if encryptedData looks like valid base64
        encDataIsBase64: /^[A-Za-z0-9+/]+=*$/.test(data.encryptedData || ''),
        ivIsBase64: /^[A-Za-z0-9+/]+=*$/.test(data.iv || ''),
      };
    });
    
    return res.status(200).json({
      userId,
      hasSalt: !!userData?.salt,
      saltLength: userData?.salt?.length || 0,
      saltPreview: userData?.salt?.substring(0, 10) + '...',
      saltIsBase64: /^[A-Za-z0-9+/]+=*$/.test(userData?.salt || ''),
      totalItems: snapshot.size,
      sampleItems: items
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
