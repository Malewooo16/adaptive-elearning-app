import { NextResponse } from "next/server";
import authOptions from "@/auth/auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authOptions);

// Define routes that don't require authentication
const publicRoutes = ["/login", "/forgetpassword", "/", "/register", "/onboarding"];

export default auth((req) => {
  // req.auth will be the session object or null if not authenticated
  const isAuthenticated = !!req.auth;
  const { pathname } = req.nextUrl;

  // CASE 1: User is not authenticated
  if (!isAuthenticated) {
    // Allow access to public routes
    if (publicRoutes.includes(pathname)) {
      return NextResponse.next();
    }
    
    // Redirect to login for protected routes
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  // CASE 2: User is authenticated
  else {
    // Redirect from root to topics
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/topics", req.nextUrl.origin));
    }
    
    // Redirect away from auth pages (login and forgot password)
    if (pathname === "/login" || pathname === "/forgetpassword") {
      return NextResponse.redirect(new URL("/topics", req.nextUrl.origin));
    }
    
    // Allow access to all other routes
    return NextResponse.next();
  }
});

// Configure which routes the middleware applies to
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|login|forgetpassword|register).*)",
    "/api/auth/:path*",
    // Exclude static files and auth pages, but include api/auth
    // Add more paths as needed
  ],
};
