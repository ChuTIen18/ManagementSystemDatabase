import bcrypt from 'bcryptjs';

const password = '123456';

const hash = await bcrypt.hash(password, 10);
console.log('Password:', password);
console.log('Hash:', hash);
console.log('\n✅ Copy the hash above and update USERS table\n');

// Verify immediately
const isMatch = await bcrypt.compare(password, hash);
console.log('Verification:', isMatch ? '✅ PASS' : '❌ FAIL');
