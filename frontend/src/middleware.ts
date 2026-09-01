import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value || 'CASHIER';
  const path = request.nextUrl.pathname;

  // Protect /admin routes
  if (path.startsWith('/admin')) {
    if (!token) {
      // If no token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Role Based Access Control
    if (role === 'CASHIER') {
      if (!path.startsWith('/admin/pos') && !path.startsWith('/admin/sales')) {
        return NextResponse.redirect(new URL('/admin/pos', request.url));
      }
    } else if (role === 'MANAGER') {
      if (path.startsWith('/admin/management')) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
  }

  // If user is already logged in, prevent them from accessing /login
  if (path === '/login') {
    if (token) {
      if (role === 'CASHIER') {
        return NextResponse.redirect(new URL('/admin/pos', request.url));
      }
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*', '/login'],
};
