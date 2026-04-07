const { adminDb, adminAuth } = require('../../utils/firebaseAdmin');
const { verifyAuth } = require('./middleware/auth');

export default async function handler(req, res) {
  try {
    const userId = await verifyAuth(req);
    
    if (req.method === 'GET') {
      let userDoc = await adminDb.collection('users').doc(userId).get();

      if (!userDoc.exists) {
        const authUser = await adminAuth.getUser(userId);
        const email = authUser.email?.trim() || '';
        const normalizedEmail = email.toLowerCase();
        let legacyDoc = null;

        const byUidSnapshot = await adminDb
          .collection('users')
          .where('uid', '==', userId)
          .limit(1)
          .get();

        if (!byUidSnapshot.empty) {
          legacyDoc = byUidSnapshot.docs[0];
        }

        if (!legacyDoc && email) {
          const byEmailSnapshot = await adminDb
            .collection('users')
            .where('email', '==', email)
            .limit(1)
            .get();

          if (!byEmailSnapshot.empty) {
            legacyDoc = byEmailSnapshot.docs[0];
          }
        }

        if (!legacyDoc && normalizedEmail) {
          const byNormalizedEmailSnapshot = await adminDb
            .collection('users')
            .where('emailNormalized', '==', normalizedEmail)
            .limit(1)
            .get();

          if (!byNormalizedEmailSnapshot.empty) {
            legacyDoc = byNormalizedEmailSnapshot.docs[0];
          }
        }

        if (legacyDoc) {
          const legacyData = legacyDoc.data();
          const legacyEmail = typeof legacyData.email === 'string' ? legacyData.email.trim() : '';
          const profileEmail = email || legacyEmail;
          const profileEmailNormalized = profileEmail ? profileEmail.toLowerCase() : '';

          await adminDb.collection('users').doc(userId).set(
            {
              ...legacyData,
              uid: userId,
              ...(profileEmail ? { email: profileEmail } : {}),
              ...(profileEmailNormalized ? { emailNormalized: profileEmailNormalized } : {}),
              migratedAt: new Date().toISOString()
            },
            { merge: true }
          );

          if (legacyDoc.id !== userId) {
            await legacyDoc.ref.delete();
          }

          userDoc = await adminDb.collection('users').doc(userId).get();
        }
      }
      
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userData = userDoc.data();

      if (!userData?.salt) {
        return res.status(404).json({ error: 'User profile not initialized' });
      }
      
      return res.status(200).json({ 
        salt: userData.salt
      });
    }
    
    if (req.method === 'POST') {
      const { email, salt } = req.body;
      const profileEmail = typeof email === 'string' ? email.trim() : '';
      const profileEmailNormalized = profileEmail ? profileEmail.toLowerCase() : '';
      
      if (!salt) {
        return res.status(400).json({ error: 'Salt required' });
      }
      
      await adminDb.collection('users').doc(userId).set({
        uid: userId,
        ...(profileEmail ? { email: profileEmail } : {}),
        ...(profileEmailNormalized ? { emailNormalized: profileEmailNormalized } : {}),
        salt,
        createdAt: new Date().toISOString()
      }, { merge: true });
      
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
