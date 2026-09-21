import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  let session = null;
  try {
    session = await auth.api.getSession({
      headers: request.headers,
    });
  } catch {
    session = null;
  }

  if (!session) {
    if (
      pathName === "/" ||
      pathName.startsWith("/auth/login") ||
      pathName.startsWith("/auth/signup")
    ) {
      return NextResponse.next();
    }
    return NextResponse.redirect(
      new URL("/auth/login", request.nextUrl.origin),
    );
  }

  if (session && pathName.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/playground/:path*", "/dashboard", "/auth/:path*"],
};
