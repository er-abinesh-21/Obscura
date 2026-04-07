require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const base = 'http://localhost:3001';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function request(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch (_e) {
    json = null;
  }
  return { status: res.status, text, json };
}

async function run() {
  assert(apiKey, 'Missing NEXT_PUBLIC_FIREBASE_API_KEY');

  const testRes = await request(base + '/api/test');
  console.log('GET /api/test ->', testRes.status, testRes.text);
  assert(testRes.status === 200, 'api/test failed');

  const email = 'smoke_' + Date.now() + '@obscura.local';
  const password = 'TestPass123!';

  const signUpRes = await request(
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + apiKey,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );
  console.log('Firebase signUp ->', signUpRes.status, signUpRes.text);
  assert(signUpRes.status === 200, 'Firebase signUp failed');

  const token = signUpRes.json.idToken;
  assert(token, 'Missing idToken after signUp');

  const userGetBefore = await request(base + '/api/user', {
    headers: { Authorization: 'Bearer ' + token },
  });
  console.log('GET /api/user (before profile) ->', userGetBefore.status, userGetBefore.text);
  assert(userGetBefore.status === 404, 'Expected 404 before user profile creation');

  const userCreate = await request(base + '/api/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({ email, salt: 'c21va2Vfc2FsdA==' }),
  });
  console.log('POST /api/user ->', userCreate.status, userCreate.text);
  assert(userCreate.status === 201, 'User profile creation failed');

  const userGetAfter = await request(base + '/api/user', {
    headers: { Authorization: 'Bearer ' + token },
  });
  console.log('GET /api/user (after profile) ->', userGetAfter.status, userGetAfter.text);
  assert(userGetAfter.status === 200, 'Expected 200 after user profile creation');

  const vaultCreate = await request(base + '/api/vault', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      type: 'note',
      title: 'Smoke Note',
      encryptedData: 'ZW5jcnlwdGVkLWRhdGE=',
      iv: 'aXYtZGF0YQ==',
      category: 'dev',
    }),
  });
  console.log('POST /api/vault ->', vaultCreate.status, vaultCreate.text);
  assert(vaultCreate.status === 201, 'Vault create failed');
  assert(vaultCreate.json && vaultCreate.json.id, 'Vault create did not return item id');

  const itemId = vaultCreate.json.id;

  const vaultList1 = await request(base + '/api/vault', {
    headers: { Authorization: 'Bearer ' + token },
  });
  console.log('GET /api/vault ->', vaultList1.status, vaultList1.text);
  assert(vaultList1.status === 200, 'Vault list failed');
  assert(Array.isArray(vaultList1.json.items), 'Vault list items is not an array');
  assert(vaultList1.json.items.some((x) => x.id === itemId), 'Created item not found in vault list');

  const vaultUpdate = await request(base + '/api/vault/' + itemId, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      title: 'Smoke Note Updated',
      encryptedData: 'ZW5jcnlwdGVkLWRhdGEtMg==',
      iv: 'aXYtZGF0YS0y',
      category: 'work',
    }),
  });
  console.log('PUT /api/vault/{id} ->', vaultUpdate.status, vaultUpdate.text);
  assert(vaultUpdate.status === 200, 'Vault update failed');

  const vaultDelete = await request(base + '/api/vault/' + itemId, {
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + token },
  });
  console.log('DELETE /api/vault/{id} ->', vaultDelete.status, vaultDelete.text);
  assert(vaultDelete.status === 200, 'Vault delete failed');

  const vaultList2 = await request(base + '/api/vault', {
    headers: { Authorization: 'Bearer ' + token },
  });
  console.log('GET /api/vault (after delete) ->', vaultList2.status, vaultList2.text);
  assert(vaultList2.status === 200, 'Vault list after delete failed');
  assert(Array.isArray(vaultList2.json.items), 'Vault list after delete items is not an array');
  assert(!vaultList2.json.items.some((x) => x.id === itemId), 'Deleted item still present in vault list');

  console.log('SMOKE TEST RESULT: PASS');
}

run().catch((err) => {
  console.error('SMOKE TEST RESULT: FAIL');
  console.error(err.message || err);
  process.exit(1);
});
