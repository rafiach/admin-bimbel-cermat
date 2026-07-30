import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const AUTH_ONLY_PATHS = ["/auth/sign-in", "/auth/sign-up"];

// Route yang boleh diakses tanpa login
const PUBLIC_PATHS = ["/report"];

const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "development"
    ? "better-auth.session_token"
    : "__Secure-better-auth.session_token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const callbackUrl = `${pathname}${request.nextUrl.search}`;

  const isAuthOnly = AUTH_ONLY_PATHS.some((path) =>
    pathname.startsWith(path),
  );

  const isPublic = PUBLIC_PATHS.some((path) =>
    pathname.startsWith(path),
  );

  // Route yang memang membutuhkan login
  const requiresAuth = !isAuthOnly && !isPublic;

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    if (requiresAuth) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/sign-in";
      url.searchParams.set("callbackUrl", callbackUrl);

      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.session && requiresAuth) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/sign-in";
      url.searchParams.set("callbackUrl", callbackUrl);

      return NextResponse.redirect(url);
    }

    if (isAuthOnly && session?.session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    console.error(error);

    if (requiresAuth) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/sign-in";
      url.searchParams.set("callbackUrl", callbackUrl);

      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};