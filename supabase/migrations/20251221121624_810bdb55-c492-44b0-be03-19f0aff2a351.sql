-- Fix Board Invite Token Enumeration Vulnerability
-- Drop the vulnerable SELECT policy that exposes all active tokens
DROP POLICY IF EXISTS "Anyone can view active invite links by token" ON public.board_invite_links;

-- Create secure RPC function for token validation
-- This prevents token enumeration by only returning info for exact token matches
CREATE OR REPLACE FUNCTION public.validate_board_invite_token(token_input TEXT)
RETURNS TABLE (
  board_id UUID,
  expires_at TIMESTAMPTZ,
  invite_link_id UUID,
  is_valid BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bil.board_id,
    bil.expires_at,
    bil.id as invite_link_id,
    (bil.is_active = true AND (bil.expires_at IS NULL OR bil.expires_at > NOW())) as is_valid
  FROM board_invite_links bil
  WHERE bil.token = token_input
  LIMIT 1;
END;
$$;

-- Grant execute permissions to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.validate_board_invite_token(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_board_invite_token(TEXT) TO anon;

-- Add comment documenting the function's purpose and security considerations
COMMENT ON FUNCTION public.validate_board_invite_token(TEXT) IS 'Securely validates board invite tokens without exposing other tokens. Returns board_id, expires_at, invite_link_id, and validity status for exact token match only.';