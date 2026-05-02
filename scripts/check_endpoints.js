(async ()=>{
  const base = 'http://localhost:3000/api/v1';
  try{
    const loginRes = await fetch(`${base}/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'manager@coffee.local',password:'123456'})});
    console.log('LOGIN', loginRes.status);
    const rawCookies = loginRes.headers.get('set-cookie') ? [loginRes.headers.get('set-cookie')] : [];
    const cookieHeader = rawCookies.map(c => c.split(';')[0]).join('; ');
    const endpoints = ['/menu','/inventory','/equipment','/users','/orders','/schedules','/reports/summary','/attendance'];
    for(const ep of endpoints){
      try{
        const r = await fetch(base+ep, { headers: { Cookie: cookieHeader } });
        const text = await r.text();
        let body = null;
        try{ body = JSON.parse(text); }catch(e){ body = text.slice(0,200); }
        console.log(ep, r.status, (typeof body === 'object' && body !== null) ? Object.keys(body).slice(0,6) : String(body).slice(0,120));
      }catch(e){ console.log(ep, 'ERROR', e.message); }
    }
  }catch(e){ console.error('FAILED', e); process.exit(1); }
})();
