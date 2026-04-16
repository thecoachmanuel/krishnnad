import { createAdminClient } from './src/lib/supabase/server';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testAdmin() {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient.auth.admin.listUsers();
  
  if (error) {
    console.error('Admin API Error:', error);
  } else {
    console.log('Success! Found', data.users.length, 'users.');
    const admin = data.users.find(u => u.email === process.env.ADMIN_EMAIL);
    console.log('Admin user found:', !!admin);
  }
}

testAdmin();
