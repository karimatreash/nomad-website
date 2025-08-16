// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { checkAdminAuth, AdminUser } from '@/lib/adminAuth';

// interface AdminAuthGuardProps {
//   children: React.ReactNode;
// }

// export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
//   const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     const verifyAdminAuth = async () => {
//       try {
//         const { user, error } = await checkAdminAuth();
        
//         if (error || !user) {
//           setError(error);
//           // Redirect to admin login if not authenticated
//           router.push('/admin/login');
//           return;
//         }

//         setAdminUser(user);
//       } catch (err) {
//         setError('Authentication failed');
//         router.push('/admin/login');
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyAdminAuth();
//   }, [router]);

//   // Show loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//           <p className="text-text-secondary font-cairo">جاري التحقق من الصلاحيات...</p>
//         </div>
//       </div>
//     );
//   }

//   // Show error state
//   if (error || !adminUser) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto p-6">
//           <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//             </svg>
//           </div>
//           <h2 className="text-xl font-bold text-text-primary mb-2 font-cairo">غير مصرح</h2>
//           <p className="text-text-secondary mb-4 font-cairo">
//             {error === 'Authentication required' 
//               ? 'يجب تسجيل الدخول للوصول إلى لوحة التحكم'
//               : 'ليس لديك صلاحيات إدارية للوصول إلى هذه الصفحة'
//             }
//           </p>
//           <button
//             onClick={() => router.push('/admin/login')}
//             className="btn-primary font-cairo"
//           >
//             تسجيل دخول المدير
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Render children if authenticated
//   return <>{children}</>;
// } 