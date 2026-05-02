const apiBase = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

type RoleCheck = {
  email: string;
  password: string;
  name: string;
  endpoints: string[];
};

const roles: RoleCheck[] = [
  {
    email: 'manager@coffee.local',
    password: '123456',
    name: 'manager',
    endpoints: ['/reports/summary', '/inventory', '/equipment', '/users', '/orders'],
  },
  {
    email: 'pos@coffee.local',
    password: '123456',
    name: 'pos',
    endpoints: ['/menu', '/orders', '/promotions', '/tables'],
  },
  {
    email: 'staff@coffee.local',
    password: '123456',
    name: 'staff',
    endpoints: ['/schedules', '/attendance', '/orders', '/feedback/customer/summary'],
  },
];

async function login(email: string, password: string) {
  const res = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  let body: any = null;
  try { body = await res.json(); } catch { body = null; }

  const accessToken = body?.data?.accessToken || '';
  return { status: res.status, accessToken, body };
}

async function checkEndpoint(accessToken: string, path: string) {
  const url = `${apiBase}${path}`;
  try {
    const res = await fetch(url, { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {} });
    let bodyText = await res.text();
    try { JSON.parse(bodyText); } catch {};
    return { status: res.status, ok: res.ok, path };
  } catch (err: any) {
    return { status: 0, ok: false, path, error: err.message };
  }
}

async function main() {
  console.log('Role endpoint checks — base:', apiBase);
  for (const r of roles) {
    console.log('\n--- Checking role:', r.name, r.email);
    const loginRes = await login(r.email, r.password);
    console.log(' login status', loginRes.status, loginRes.accessToken ? 'token-set' : 'no-token');

    const accessToken = loginRes.accessToken;
    for (const ep of r.endpoints) {
      const result = await checkEndpoint(accessToken, ep.startsWith('/') ? ep : '/' + ep);
      console.log(result.ok ? 'PASS' : 'FAIL', ep, result.status, result.error ? result.error : '');
    }
  }
}

main().catch((e) => { console.error('Error:', e); process.exit(1); });
