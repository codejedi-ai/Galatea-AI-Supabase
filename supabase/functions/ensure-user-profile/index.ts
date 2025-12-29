import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    
    const supabase = createClient(supabaseUrl, serviceRoleKey)
    const authHeader = req.headers.get('Authorization')
    
    const userSupabase = createClient(supabaseUrl, anonKey, {
      global: {
        headers: { Authorization: authHeader ?? '' },
      },
    })

    const { data: { user }, error: authError } = await userSupabase.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Ensure tables exist
    await supabase.rpc('create_table_user_profiles').catch(() => {})
    await supabase.rpc('create_table_user_stats').catch(() => {})
    await supabase.rpc('create_table_user_preferences').catch(() => {})

    // Try to call database function first
    const { error: rpcError } = await supabase.rpc('ensure_user_profile_exists', {
      p_user_id: user.id
    })

    // If RPC doesn't exist, create profile directly
    if (rpcError) {
      const displayName = user.user_metadata?.full_name || 
                         user.user_metadata?.name || 
                         user.user_metadata?.first_name ||
                         user.email?.split('@')[0] || 
                         'User'

      // Upsert user profile
      await supabase.from('user_profiles').upsert({
        id: user.id,
        display_name: displayName,
        avatar_url: user.user_metadata?.avatar_url || null
      }, {
        onConflict: 'id'
      }).catch(() => {})

      // Upsert user stats
      await supabase.from('user_stats').upsert({
        user_id: user.id
      }, {
        onConflict: 'user_id'
      }).catch(() => {})

      // Upsert user preferences
      await supabase.from('user_preferences').upsert({
        user_id: user.id
      }, {
        onConflict: 'user_id'
      }).catch(() => {})
    }

    return new Response(
      JSON.stringify({ success: true, message: 'User profile ensured' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error ensuring user profile:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

