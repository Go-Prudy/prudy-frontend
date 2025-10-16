import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// Define public and private routes
const publicRoutes = [
  '/signup',
  '/login',
  '/',
  '/terms&conditions',
  '/privacy&policy',
  '/about',
  '/contact',
];
const privateRoutes = [
  '/budgets',
  '/budgets/:path*',
  '/analytics',
  '/budget',
  '/budget/:path*',
  '/collaborators',
  '/faqs',
  '/invite',
  '/track',
  '/invite/:path*',
  '/subscription',
  '/manage-subscription',
  '/profile',
  '/profile/:path*',
  '/reminders',
  '/reports',
  '/settings',
  '/home',
  '/notifications',
];

// Define the middleware function
export async function middleware(request: NextRequest) {
  // Retrieve the token from cookies
  const token = request.cookies.get('token')?.value; // Adjust 'token' to your actual cookie name

  const { pathname } = request.nextUrl;
  // console.log(token); console.log(token);
  // If the token exists, the user is authenticated
  if (token) {
    // If the user is authenticated and tries to access a public route, redirect them to /budgets
    if (publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  } else {
    // If the user is not authenticated and tries to access a private route, redirect them to /login
    const isPrivateRoute = privateRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + '/'),
    );

    if (isPrivateRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set(
        'redirect',
        encodeURIComponent(pathname + request.nextUrl.search),
      );
      return NextResponse.redirect(loginUrl);
    }
  }
}

// Define the routes that should use this middleware
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
