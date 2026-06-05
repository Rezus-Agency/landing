-- ============================================================================
-- 0002_icp_grants
-- Les tables créées via le MCP n'ont pas hérité des privilèges par défaut
-- Supabase (anon/authenticated/service_role n'avaient que REFERENCES/TRIGGER/
-- TRUNCATE). On accorde explicitement les privilèges DML. La sécurité réelle
-- reste portée par les policies RLS (cf. 0001_icp_core.sql).
-- ============================================================================

-- icps : lecture publique (page de partage) + CRUD propriétaire.
grant select on public.icps to anon;
grant select, insert, update, delete on public.icps to authenticated;
grant all on public.icps to service_role;

-- icp_sessions : CRUD propriétaire uniquement.
grant select, insert, update, delete on public.icp_sessions to authenticated;
grant all on public.icp_sessions to service_role;

-- spec_drafts : CRUD propriétaire uniquement.
grant select, insert, update, delete on public.spec_drafts to authenticated;
grant all on public.spec_drafts to service_role;
