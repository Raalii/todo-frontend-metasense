import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 *  Règles :
 *  ─────────────────────────────────────────────
 *  • NON authentifié  → accès libre à  /login  /register  /   (+ pages publiques)
 *                      tentative /dashboard → redirige /login?unauth=1
 *
 *  • Authentifié      → accès libre à /dashboard et toutes les routes protégées
 *                      tentative /login|/register → redirige /dashboard?already=1
 */
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const isAuth = !!token;
  const { pathname } = req.nextUrl;

  const isLogin = pathname.startsWith("/login");
  const isRegister = pathname.startsWith("/register");
  // const isPublic    = pathname === "/" || pathname.startsWith("/api"); // ← landing & api hors auth
  const isProtected = pathname.startsWith("/dashboard");

  /* ------ NON authentifié tente d'accéder au protégé -------- */
  if (!isAuth && isProtected) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  /* ------ Authentifié tente login/register ------------------- */
  if (isAuth && (isLogin || isRegister)) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  /* ------ Reste : continuer --------------------------------- */
  return NextResponse.next();
}

/* Le middleware ne s'exécute que sur ces chemins */
export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*"],
};
