import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Custom middleware logic can go here
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Public routes that don't require authentication
        const publicRoutes = [
          "/", 
          "/login", 
          "/signup", 
          "/assessment",  // Guest-accessible assessment flow
          "/pricing", 
          "/terms", 
          "/privacy",
          "/disclaimer",
          "/blog",
          "/community",
          "/support",
          "/contact",
          "/forgot-password",
        ];
        const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith("/api/auth") || path.startsWith("/api/plan/generate-guest"));
        
        if (isPublicRoute) {
          return true;
        }
        
        // All other routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth (auth endpoints)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};

