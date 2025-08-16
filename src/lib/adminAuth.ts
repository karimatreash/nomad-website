// // import { supabase } from './supabaseClient';

// // export interface AdminUser {
// //   id: string;
// //   email: string;
// //   role: 'admin';
// //   permissions: string[];
// // }

// // export async function checkAdminAuth(): Promise<{ user: AdminUser | null; error: string | null }> {
// //   try {
// //     // Get current usera
// //     const { data: { user }, error: authError } = await supabase.auth.getUser();
    
// //     if (authError || !user) {
// //       return { user: null, error: 'Authentication required' };
// //     }

// //     // Check if user exists in admins table
// //     const { data: adminData } = await supabase
// //     .from('admins')
// //     .select('*')
// //     .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
// //     .single();
// //     debugger;
  
// //     if  (!adminData) {
// //       return { user: null, error: 'Admin access denied' };
// //     }

// //     // Return admin user data
// //     const adminUser: AdminUser = {
// //       id: user.id,
// //       email: user.email || '',
// //       role: 'admin',
// //       permissions: adminData.permissions || ['read', 'write']
// //     };

// //     return { user: adminUser, error: null };
// //   } catch (error) {
// //     console.error('Admin auth check failed:', error);
// //     return { user: null, error: 'Authentication failed' };
// //   }
// // }

// // export async function requireAdminAuth(): Promise<AdminUser> {
// //   const { user, error } = await checkAdminAuth();
  
// //   if (error || !user) {
// //     throw new Error(error || 'Admin access required');
// //   }
  
// //   return user;
// // }

// // export function isAdminRoute(pathname: string): boolean {
// //   return pathname.startsWith('/admin') && pathname !== '/admin/login';
// // } 
// // lib/adminAuth.ts
// import { supabase } from './supabaseClient';

// export interface AdminUser {
//   id: string;
//   email: string | null | undefined;  // 👈 يقبل كل الحالات
//   role: 'admin';
// }

// export async function checkAdminAuth(): Promise<{ user: AdminUser | null; error: string | null }> {
//   try {
//     const { data: { user }, error } = await supabase.auth.getUser();

//     if (error || !user) {
//       return { user: null, error: 'Authentication required' };
//     }
// debugger;
//     // التحقق إذا كان user.id موجود في جدول admins
//     const { data: adminData, error: adminError } = await supabase
//       .from('admins')
//       .select('id') // ما بدنا كل الأعمدة (مفيش غير id أصلاً)
//       .eq('id', user.id) // أو eq('user_id', user.id) إذا اسم العمود مختلف
//       .single();
// debugger;
//     if (adminError || !adminData) {
//       return { user: null, error: 'Admin access denied' };
//     }

//     // إذا موجود → اعتبره admin
//     return {
//       user: {
//         id: user.id,
//         email: user.email,
//         role: 'admin',
//       },
//       error: null,
//     };
//   } catch (err) {
//     console.error('Admin auth check failed:', err);
//     return { user: null, error: 'Authentication failed' };
//   }
// }

