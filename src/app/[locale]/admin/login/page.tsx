'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError('فشل تسجيل الدخول. يرجى التحقق من بياناتك والمحاولة مرة أخرى.');
      } else {
        // Check if user is admin
        const { data: adminData } = await supabase
          .from('admins')
          .select('*')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .single();
        if (adminData) {
          debugger;
          router.push('/admin');
        } else {
          setError('ليس لديك صلاحيات إدارية. يرجى التواصل مع المسؤول.');
          await supabase.auth.signOut();
        }
      }
    } catch (error) {
      setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-cairo">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
                                <div className="mx-auto h-20 w-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">N</span>
                      </div>
          <h2 className="mt-6 text-3xl font-bold text-text-primary">
            تسجيل دخول المدير
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            سجل دخولك للوصول إلى لوحة التحكم
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg text-center font-cairo">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2 font-cairo">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-primary font-cairo"
                placeholder="أدخل بريدك الإلكتروني"
                dir="ltr"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2 font-cairo">
                كلمة المرور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-primary font-cairo"
                placeholder="أدخل كلمة المرور"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg py-3 font-cairo disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </div>

          <div className="text-center">
            <a href="/login" className="text-sm text-primary hover:text-primary-dark font-cairo">
              العودة إلى تسجيل دخول المستخدم
            </a>
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-text-secondary font-cairo">
              <p className="font-medium text-text-primary mb-1">ملاحظة أمنية</p>
              <p>هذه الصفحة مخصصة للمديرين فقط. إذا كنت مستخدماً عادياً، يرجى استخدام صفحة تسجيل دخول المستخدم.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 