import axios from 'axios';

const API_BASE = '/api';

export async function getAuthToken() {
  const auth = (await import('../utils/firebase')).auth;
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return await user.getIdToken();
}

export async function getUserSalt() {
  const token = await getAuthToken();
  const response = await axios.get(`${API_BASE}/user`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.salt;
}

export async function createUser(email, salt) {
  const token = await getAuthToken();
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
  return response.data.items;
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
