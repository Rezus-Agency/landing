/**
 * Page publique de partage d'un ICP (sans auth).
 *
 * Server Component : lit l'ICP directement en DB par son `share_id` (la policy
 * RLS publique autorise la lecture des lignes `shared = true`). C'est ce qui
 * fait fonctionner un lien de partage depuis n'importe quel navigateur, contrôle
 * fait côté serveur. Le rendu interactif est délégué à PublicShareView (client).
 */
import { createClient } from "@/lib/supabase/server";
import { rowToIcp, type IcpRow } from "@/lib/icp-tool/icp-map";
import { PublicShareView } from "./PublicShareView";

// Toujours rendu à la demande, jamais mis en cache : un partage désactivé doit
// devenir indisponible immédiatement (pas de version périmée servie).
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function PublicSharePage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;

  const supabase = await createClient();
  const { data } = await supabase
    .from("icps")
    .select("*")
    .eq("share_id", shareId)
    .eq("shared", true)
    .maybeSingle();

  const icp = data ? rowToIcp(data as IcpRow) : null;

  return <PublicShareView icp={icp} />;
}
