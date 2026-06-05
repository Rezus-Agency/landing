/**
 * Couche d'accès données ICP côté navigateur (client Supabase + RLS).
 * Chaque user ne lit/écrit que ses propres lignes grâce aux policies RLS
 * (cf. supabase/migrations/0001_icp_core.sql).
 */
"use client";

import { createClient } from "@/lib/supabase/client";
import type { ICP, Profile, SessionDraft } from "./types";
import { icpToRow, rowToIcp, type IcpRow } from "./icp-map";

/** Charge tous les ICP du user connecté (plus récents d'abord). */
export async function fetchIcps(): Promise<ICP[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("icps")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as IcpRow[]).map(rowToIcp);
}

/** Crée ou met à jour un ICP (upsert sur la clé `id`). */
export async function saveIcp(icp: ICP): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Session expirée");
  const { error } = await supabase.from("icps").upsert(icpToRow(icp, user.id));
  if (error) throw error;
}

/** Supprime définitivement un ICP. */
export async function deleteIcp(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("icps").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Sessions de chat en cours (table icp_sessions)
// ---------------------------------------------------------------------------

/** Crée ou met à jour la session de chat (upsert sur `id`). */
export async function saveSession(session: SessionDraft): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Session expirée");
  const { error } = await supabase.from("icp_sessions").upsert({
    id: session.id,
    user_id: user.id,
    final: !!session.final,
    data: session,
  });
  if (error) throw error;
}

/** Charge la dernière session non finalisée du user (celle à reprendre). */
export async function fetchOpenSession(): Promise<SessionDraft | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("icp_sessions")
    .select("data")
    .eq("final", false)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? ((data as { data: SessionDraft }).data ?? null) : null;
}

/** Supprime une session (abandon ou consommée par la génération). */
export async function deleteSession(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("icp_sessions").delete().eq("id", id);
  if (error) throw error;
}

/** Charge le profil du user connecté (table profiles). */
export async function fetchProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("profiles").select("*").maybeSingle();
  if (error) throw error;
  return (data as Profile) ?? null;
}

/** Upsert partiel du profil (table profiles). La ligne existe déjà (créée par le
 * trigger à l'inscription) ; on ne met à jour que les champs fournis. */
export async function saveProfile(fields: Partial<Omit<Profile, "id">>): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Session expirée");
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, email: user.email, ...fields }, { onConflict: "id" });
  if (error) throw error;
}
