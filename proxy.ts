import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next 16 : convention "proxy" (ex-"middleware"). Tourne sur chaque requête
// pour rafraîchir la session Supabase et protéger /icp/tool/* et /api/icp/*.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Toutes les routes sauf :
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico
     * - fichiers d'assets (images, css, js, fonts)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)",
  ],
};
