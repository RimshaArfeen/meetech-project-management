// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // Use jose instead of jsonwebtoken

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
     const path = request.nextUrl.pathname;
     const publicPaths = ['/login', '/register', '/forgot-password'];

     if (publicPaths.includes(path)) {
          return NextResponse.next();
     }

     const accessToken = request.cookies.get('accessToken')?.value;

     if (!accessToken) {
          return NextResponse.redirect(new URL('/login', request.url));
     }

     try {
          // Verify the token using jose
          const { payload } = await jwtVerify(accessToken, JWT_SECRET);
          const userRole = payload.role;

          // Define access rules
          const dashboardMapping = {
               '/ceo': 'CEO',
               '/project-manager': 'PROJECT_MANAGER',
               '/team-lead': 'TEAM_LEAD',
               '/developer': 'DEVELOPER'
          };

          // Check if the current path is a restricted dashboard
          for (const [route, requiredRole] of Object.entries(dashboardMapping)) {
               if (path.startsWith(route) && userRole !== requiredRole) {
                    // Redirect unauthorized users to their own dashboard
                    const correctDashboard = Object.keys(dashboardMapping).find(
                         key => dashboardMapping[key] === userRole
                    ) || '/login';

                    return NextResponse.redirect(new URL(correctDashboard, request.url));
               }
          }

          return NextResponse.next();
     } catch (error) {
          // If token is invalid or expired
          return NextResponse.redirect(new URL('/login', request.url));
     }
}

export const config = {
     matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};