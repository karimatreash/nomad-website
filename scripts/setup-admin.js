const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupAdmin() {
  try {
    console.log('🔧 Setting up admin user...');
    
    // Check if admins table exists, if not create it
    const { error: tableError } = await supabase.rpc('create_admins_table_if_not_exists');
    
    if (tableError) {
      console.log('Creating admins table...');
      const { error } = await supabase.rpc(`
        CREATE TABLE IF NOT EXISTS admins (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          permissions TEXT[] DEFAULT ARRAY['read', 'write'],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Admins can view their own records" ON admins
          FOR SELECT USING (auth.uid() = user_id);
      `);
      
      if (error) {
        console.error('❌ Error creating admins table:', error);
        return;
      }
    }
    
    console.log('✅ Admins table ready');
    
    // Get admin email from command line or use default
    const adminEmail = process.argv[2] || 'admin@nomad.com';
    
    console.log(`📧 Setting up admin for: ${adminEmail}`);
    
    // Check if user exists
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('❌ Error fetching users:', userError);
      return;
    }
    
    const existingUser = users.find(user => user.email === adminEmail);
    
    if (!existingUser) {
      console.log('👤 Creating new admin user...');
      
      // Create user with temporary password
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: tempPassword,
        email_confirm: true,
      });
      
      if (createError) {
        console.error('❌ Error creating user:', createError);
        return;
      }
      
      console.log(`✅ User created with temporary password: ${tempPassword}`);
      console.log('⚠️  Please change the password after first login!');
      
      // Add to admins table
      const { error: adminError } = await supabase
        .from('admins')
        .insert({
          user_id: newUser.user.id,
          permissions: ['read', 'write', 'admin']
        });
      
      if (adminError) {
        console.error('❌ Error adding user to admins:', adminError);
        return;
      }
      
      console.log('✅ User added to admins table');
      
    } else {
      console.log('👤 User already exists, checking admin status...');
      
      // Check if user is already an admin
      const { data: adminData, error: adminCheckError } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', existingUser.id)
        .single();
      
      if (adminCheckError && adminCheckError.code !== 'PGRST116') {
        console.error('❌ Error checking admin status:', adminCheckError);
        return;
      }
      
      if (!adminData) {
        console.log('➕ Adding existing user to admins table...');
        
        const { error: adminError } = await supabase
          .from('admins')
          .insert({
            user_id: existingUser.id,
            permissions: ['read', 'write', 'admin']
          });
        
        if (adminError) {
          console.error('❌ Error adding user to admins:', adminError);
          return;
        }
        
        console.log('✅ User added to admins table');
      } else {
        console.log('✅ User is already an admin');
      }
    }
    
    console.log('\n🎉 Admin setup complete!');
    console.log(`📧 Admin email: ${adminEmail}`);
    console.log('🔗 Admin login URL: /admin/login');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Run the setup
setupAdmin(); 