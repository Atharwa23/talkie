import { NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt";
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const url = request.nextUrl;

  if(token && (
    url.pathname.startsWith('/sign-in') ||
    url.pathname.startsWith('/sign-up') ||
    url.pathname === '/ ' ||
    url.pathname.startsWith('/verify')
  )) return NextResponse.redirect(new URL('/dashboard', request.url));

  if(!token && (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/verify') || url.pathname.startsWith('/u'))) return NextResponse.redirect(new URL('/sign-in', request.url));

  return NextResponse.next();
}
 
export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*', '/u/:path*'],
}