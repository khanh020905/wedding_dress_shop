import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error("SESSION_SECRET is not defined in environment variables.");
}
const key = new TextEncoder().encode(secretKey);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get(process.env.SESSION_COOKIE_NAME || 'dd_admin_session')?.value;
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    try {
      await jwtVerify(sessionCookie, key, { algorithms: ['HS256'] });
      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protect /api/admin routes (except /api/admin/login)
  if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/login')) {
    const sessionCookie = request.cookies.get(process.env.SESSION_COOKIE_NAME || 'dd_admin_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    try {
      await jwtVerify(sessionCookie, key, { algorithms: ['HS256'] });
      return NextResponse.next();
    } catch (err) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
