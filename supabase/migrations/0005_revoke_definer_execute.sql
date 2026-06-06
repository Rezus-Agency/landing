-- ============================================================================
-- 0005_revoke_definer_execute
-- Durcissement : empêche l'appel direct des fonctions SECURITY DEFINER via
-- l'API REST (anon/authenticated). Les triggers continuent de fonctionner (ils
-- n'exigent pas le privilège EXECUTE). Corrige les advisors de sécurité Supabase.
-- ============================================================================

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
