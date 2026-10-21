import { NextResponse, type NextRequest } from "next/server";
import { parseSetCookie } from "cookie";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

function isRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivateRoute = isRoute(pathname, privateRoutes);
  const isPublicRoute = isRoute(pathname, publicRoutes);
  if (!isPrivateRoute && !isPublicRoute) return NextResponse.next();

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  let sessionResponse;
  try {
    if (accessToken || refreshToken) {
      sessionResponse = await checkSession(request.cookies.toString());
    }
  } catch {
    sessionResponse = undefined;
  }
  const isAuthenticated = sessionResponse?.data.success === true;

  const response = NextResponse.next();
  if (!accessToken && refreshToken && sessionResponse) {
    const refreshedCookies = sessionResponse.headers["set-cookie"];
    const cookies = Array.isArray(refreshedCookies)
      ? refreshedCookies
      : refreshedCookies
        ? [refreshedCookies]
        : [];
    for (const cookie of cookies) {
      const parsed = parseSetCookie(cookie);
      if (parsed.value) {
        response.cookies.set(parsed.name, parsed.value, parsed);
      }
    }
  }

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  if (isPublicRoute && isAuthenticated) {
    const redirect = NextResponse.redirect(new URL("/", request.url));
    for (const cookie of response.cookies.getAll()) {
      redirect.cookies.set(cookie);
    }
    return redirect;
  }
  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
