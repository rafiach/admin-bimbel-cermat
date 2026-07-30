import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// export function middleware(request: NextRequest) {
//   const sessionCookie = getSessionCookie(request);
//   const { pathname } = request.nextUrl;

//   const isAuthRoute = pathname.startsWith("/auth");
//   const isPublicRoute = pathname.startsWith("/report");

//   if (!sessionCookie && !isAuthRoute && !isPublicRoute) {
//     return NextResponse.redirect(new URL("/auth/sign-in", request.url));
//   }

//   if (sessionCookie && isAuthRoute) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };