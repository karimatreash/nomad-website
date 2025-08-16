import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute

function getRateLimitKey(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  return `rate_limit:${ip}`;
}

function checkRateLimit(request: NextRequest): boolean {
  const key = getRateLimitKey(request);
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limiting
  if (!checkRateLimit(request)) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
        },
      }
    );
  }

  // Security headers for all routes
  const response = NextResponse.next();
  
  // Basic security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Additional security for admin routes
  // if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
  //   response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  //   response.headers.set('X-XSS-Protection', '1; mode=block');
  //   response.headers.set('X-DNS-Prefetch-Control', 'off');
  // }

  // Block access to sensitive files
  if (pathname.match(/\.(env|config|json|md|txt)$/)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Prevent access to admin routes without proper authentication
  // if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
  //   // Check for admin session cookie or token
  //   const authToken = request.cookies.get('admin-auth-token')?.value;
  //   const sessionToken = request.cookies.get('sb-access-token')?.value;
    
  //   if (!authToken && !sessionToken) {
  //     return NextResponse.redirect(new URL('/admin/login', request.url));
  //   }
  // }

  // API route protection
  // if (pathname.startsWith('/api/admin')) {
  //   const authToken = request.headers.get('authorization');
  //   if (!authToken || !authToken.startsWith('Bearer ')) {
  //     return new NextResponse(
  //       JSON.stringify({ error: 'Unauthorized' }),
  //       {
  //         status: 401,
  //         headers: { 'Content-Type': 'application/json' },
  //       }
  //     );
  //   }
  // }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 