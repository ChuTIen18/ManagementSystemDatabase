const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
const healthUrl = process.env.HEALTH_URL || 'http://localhost:3000/health';
let accessToken = process.env.ACCESS_TOKEN;

// If no ACCESS_TOKEN provided, attempt to login using test manager credentials
async function attemptLogin() {
    try {
        const loginRes = await fetch(`${apiBaseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'manager@coffee.local', password: '123456' }),
        });

        if (!loginRes.ok) return null;

        const payload = (await loginRes.json()) as { data?: { accessToken?: string } };
        return payload.data?.accessToken || null;
    } catch (err) {
        return null;
    }
}

async function request(path: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> | undefined),
    };

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${apiBaseUrl}${path}`, {
        ...options,
        headers,
    });

    const text = await response.text();
    let body: any = text;

    try {
        body = text ? JSON.parse(text) : null;
    } catch {
        body = text;
    }

    return {
        ok: response.ok,
        status: response.status,
        body,
    };
}

async function main() {
    const checks: Array<{ name: string; path: string; requiresAuth?: boolean }> = [
        { name: 'menu', path: '/menu' },
        { name: 'feedback summary', path: '/feedback/customer/summary', requiresAuth: true },
        { name: 'reports summary', path: '/reports/summary', requiresAuth: true },
        { name: 'reports daily revenue', path: '/reports/daily-revenue', requiresAuth: true },
        { name: 'reports low stock', path: '/reports/low-stock', requiresAuth: true },
        { name: 'reports top items', path: '/reports/top-items', requiresAuth: true },
        { name: 'reports satisfaction', path: '/reports/customer-satisfaction', requiresAuth: true },
    ];

    const results: Array<{ name: string; ok: boolean; status: number }> = [];

    const healthResponse = await fetch(healthUrl);

    if (!accessToken) {
        accessToken = (await attemptLogin()) || undefined;
    }
    results.push({ name: 'health', ok: healthResponse.ok, status: healthResponse.status });

    for (const check of checks) {
        if (check.requiresAuth && !accessToken) {
            results.push({ name: check.name, ok: false, status: 0 });
            continue;
        }

        const result = await request(check.path);
        results.push({ name: check.name, ok: result.ok, status: result.status });
    }

    console.log('API Smoke Test Results');
    console.log('Base URL:', apiBaseUrl);
    console.log('Health URL:', healthUrl);
    console.log('Token provided:', Boolean(accessToken));
    console.log('');

    for (const result of results) {
        console.log(`${result.ok ? 'PASS' : 'FAIL'} ${result.name} (${result.status || 'skipped'})`);
    }

    const failed = results.filter((item) => !item.ok);
    if (failed.length > 0) {
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error('Smoke test failed:', error);
    process.exit(1);
});
