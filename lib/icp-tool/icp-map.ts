/**
 * Mappers purs entre une ligne DB `public.icps` et le type applicatif `ICP`.
 * Aucun import client/serveur : utilisable côté navigateur (db.ts) ET côté
 * serveur (page publique de partage).
 *
 * Le document ICP complet est stocké dans la colonne `data` (jsonb). Les
 * colonnes (segment, status, version, share_id, shared) sont des miroirs
 * indexables/queryables ; au retour elles font foi pour l'état de partage.
 */
import type { ICP } from "./types";

export type IcpRow = {
  id: string;
  user_id: string;
  segment: string;
  status: string;
  version: number;
  share_id: string | null;
  shared: boolean;
  data: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
};

export function rowToIcp(row: IcpRow): ICP {
  const data = (row.data ?? {}) as Partial<ICP>;
  return {
    ...(data as ICP),
    id: row.id,
    segment: row.segment ?? data.segment ?? "",
    status: (row.status as ICP["status"]) ?? data.status ?? "draft",
    version: row.version ?? data.version ?? 1,
    shareId: row.share_id ?? undefined,
    shared: !!row.shared,
  };
}

export function icpToRow(icp: ICP, userId: string): IcpRow {
  return {
    id: icp.id,
    user_id: userId,
    segment: icp.segment ?? "",
    status: icp.status ?? "draft",
    version: icp.version ?? 1,
    share_id: icp.shareId ?? null,
    shared: icp.shared ?? false,
    data: icp as unknown as Record<string, unknown>,
  };
}
