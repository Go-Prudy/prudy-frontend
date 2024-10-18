import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// Define public and private routes
const publicRoutes = ['/signup', '/login', '/'];
const privateRoutes = [
    '/budgets',
    '/budgets/:path*',
    '/analysis',
    '/budget',
    '/budget/:path*',
    '/collaborators',
    '/faqs',
    '/profile',
    '/profile/:path*'
];

// Define the middleware function
export async function middleware(request: NextRequest) {
    // Retrieve the token from cookies
    const token: string | undefined = request.cookies.get('token')?.value;

    // Extract the requested URL
    const { pathname } = request.nextUrl;

    // If the token exists, the user is authenticated
    if (token) {
        // If the user is authenticated and tries to access a public route, redirect them to /budgets
        if (publicRoutes.includes(pathname)) {
            return NextResponse.redirect(new URL('/budgets', request.url));
        }
    } else {
        // If the user is not authenticated and tries to access a private route, redirect them to /login
        if (privateRoutes.some(route => pathname.startsWith(route))) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
}

// Define the routes that should use this middleware
export const config = {
    matcher: [...publicRoutes, ...privateRoutes],
};
