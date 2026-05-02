(async function(){
  try{
    const base = 'http://localhost:3000/api/v1';
    console.log('Logging in as manager...');
    const loginRes = await fetch(`${base}/auth/login`,{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email: 'manager@coffee.local', password: '123456' })
    });
    const loginBody = await loginRes.text();
    console.log('Login status:', loginRes.status);
    console.log(loginBody);
    let token;
    try{ token = JSON.parse(loginBody).accessToken }catch(e){}
    if(!token){ console.error('No access token; aborting tests'); process.exit(1); }

    const auth = { 'Content-Type':'application/json', 'Authorization': 'Bearer '+token };

    console.log('\nFetching current inventory...');
    let r = await fetch(`${base}/inventory`,{ headers: auth });
    console.log('GET /inventory', r.status); let items = await r.json(); console.log(items && items.data? items.data.length : items);

    console.log('\nCreating test inventory item...');
    const payload = { item_name: 'TEST ITEM (autotest)', quantity: 10, unit: 'pcs', min_quantity: 1, cost_per_unit: 100 };
    r = await fetch(`${base}/inventory`,{ method:'POST', headers: auth, body: JSON.stringify(payload) });
    console.log('POST /inventory', r.status); const created = await r.json(); console.log(created);
    const createdId = created?.data?.id || created?.data?.item_id || created?.data?.inventory_id;

    if(!createdId){
      // try to find by name
      r = await fetch(`${base}/inventory`,{ headers: auth }); const all = await r.json();
      const found = (all.data||[]).find(i=>i.item_name==='TEST ITEM (autotest)');
      if(found) createdId = found.id || found.item_id;
    }

    if(!createdId){ console.error('Could not determine created item id'); process.exit(1); }

    console.log('Created item id:', createdId);

    console.log('\nUpdating item name...');
    r = await fetch(`${base}/inventory/${createdId}`,{ method:'PUT', headers: auth, body: JSON.stringify({ item_name: 'TEST ITEM (autotest) - updated' }) });
    console.log('PUT /inventory/:id', r.status); console.log(await r.json());

    console.log('\nAdding stock +5...');
    r = await fetch(`${base}/inventory/${createdId}/add`,{ method:'POST', headers: auth, body: JSON.stringify({ quantity: 5, notes: 'autotest add' }) });
    console.log('POST /inventory/:id/add', r.status); console.log(await r.json());

    console.log('\nRemoving stock -3...');
    r = await fetch(`${base}/inventory/${createdId}/remove`,{ method:'POST', headers: auth, body: JSON.stringify({ quantity: 3, notes: 'autotest remove' }) });
    console.log('POST /inventory/:id/remove', r.status); console.log(await r.json());

    console.log('\nDeleting item...');
    r = await fetch(`${base}/inventory/${createdId}`,{ method:'DELETE', headers: auth });
    console.log('DELETE /inventory/:id', r.status); console.log(await r.json());

    console.log('\nRe-fetch inventory...');
    r = await fetch(`${base}/inventory`,{ headers: auth }); console.log('GET /inventory', r.status); console.log((await r.json()).data?.length);

    console.log('\nAll mutation tests completed.');
    process.exit(0);
  }catch(e){ console.error('Script error', e); process.exit(1); }
})();