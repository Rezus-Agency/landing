/**
 * Helper "updateSession" exécuté par le middleware racine sur chaque requête.
 *
 * Rôles :
 *  1. Rafraîchir la session Supabase (cookies à jour partout, sinon
 *     déconnexions aléatoires côté SSR).
 *  2. Protéger les ROUTES API : 401 pour /api/icp/* et /api/account/*.
 *  3. Exposer le pathname courant via l'en-tête `x-pathname` (le layout de
 *     /icp/tool s'en sert pour le `?next=` du redirect login).
 *
 * La protection des PAGES /icp/tool/* est faite dans `app/icp/tool/layout.tsx`
 * (server component). Raison : le middleware tourne AVANT le routage Next, donc
 * il ne sait pas distinguer une vraie page d'une route inexistante. En déplaçant
 * le gate dans le layout, les routes inconnues tombent sur la vraie page 404 au
 * lieu d'être redirigées vers /login.
 *
 * IMPORTANT : ne rien exécuter entre createServerClient() et getUser().
 * IMPORTANT : toujours renvoyer l'objet supabaseResponse tel quel (cookies).
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Préfixes d'API qui exigent une session. */
const PROTECTED_API_PREFIXES = ["/api/icp", "/api/account"];

export async function updateSession(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  let supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // NE RIEN mettre entre createServerClient et getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // API protégées → 401 JSON (les pages sont gérées par le layout).
  if (!user && PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Toujours renvoyer supabaseResponse (pour ne pas désynchroniser les cookies).
  return supabaseResponse;
}
