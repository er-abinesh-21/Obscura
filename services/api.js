import axios from 'axios';

const API_BASE = '/api';

async function waitForAuthenticatedUser(auth, timeoutMs = 5000) {
  if (typeof auth.authStateReady === 'function') {
    await auth.authStateReady();
  }

  if (auth.currentUser) {
    return auth.currentUser;
  }

  const { onAuthStateChanged } = await import('firebase/auth');

  return await new Promise((resolve) => {
    const timeout = setTimeout(() => {
      unsubscribe();
      resolve(null);
    }, timeoutMs);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(timeout);
      unsubscribe();
      resolve(user || null);
    });
  });
}

export async function getAuthToken(tokenOverride = null) {
  if (tokenOverride) {
    return tokenOverride;
  }

  const auth = (await import('../utils/firebase')).auth;
  const user = auth.currentUser || await waitForAuthenticatedUser(auth);

  if (!user) throw new Error('Not authenticated');

  return await user.getIdToken();
}

function isNotFoundError(error) {
  const status = error?.response?.status ?? error?.status;
  return status === 404;
}

export async function getUserSalt(tokenOverride = null, options = {}) {
  const token = await getAuthToken(tokenOverride);

  try {
    const response = await axios.get(`${API_BASE}/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data.salt;
  } catch (error) {
    if (options.allowNotFound && isNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}

export async function createUser(email, salt, tokenOverride = null) {
  const token = await getAuthToken(tokenOverride);
  await axios.post(`${API_BASE}/user`, 
    { email, salt },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function getVaultItems() {
  const token = await getAuthToken();
  const response = await axios.get(`${API_BASE}/vault`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const items = response?.data?.items;
  return Array.isArray(items) ? items : [];
}

export async function createVaultItem(item) {
  const token = await getAuthToken();
  const response = await axios.post(`${API_BASE}/vault`, item, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export async function updateVaultItem(id, updates) {
  const token = await getAuthToken();
  const response = await axios.put(`${API_BASE}/vault/${id}`, updates, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export async function deleteVaultItem(id) {
  const token = await getAuthToken();
  await axios.delete(`${API_BASE}/vault/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
