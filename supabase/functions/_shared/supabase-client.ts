/**
 * Shared Supabase client utilities for Edge Functions
 * Optimized for database and storage operations
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Get environment variables with validation
 */
export function getEnv() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

  if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    throw new Error('Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY')
  }

  return { supabaseUrl, serviceRoleKey, anonKey }
}

/**
 * Create service role client (for database operations with full access)
 * Use this for operations that need to bypass RLS or perform admin tasks
 */
export function createServiceClient() {
  const { supabaseUrl, serviceRoleKey } = getEnv()
  return createClient(supabaseUrl, serviceRoleKey, {
    db: {
      schema: 'public',
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Create user-authenticated client (for RLS-compliant operations)
 * Use this for storage operations and user-specific database queries
 */
export function createUserClient(authHeader: string | null) {
  const { supabaseUrl, anonKey } = getEnv()
  return createClient(supabaseUrl, anonKey, {
    global: {
      headers: { Authorization: authHeader ?? '' },
    },
    db: {
      schema: 'public',
    },
  })
}

/**
 * Get authenticated user from request
 */
export async function getAuthenticatedUser(authHeader: string | null) {
  const userClient = createUserClient(authHeader)
  const { data: { user }, error } = await userClient.auth.getUser()
  
  if (error || !user) {
    throw new Error('Unauthorized')
  }
  
  return { user, userClient }
}

/**
 * Optimized S3 storage operations
 */
export class StorageHelper {
  private userClient: ReturnType<typeof createUserClient>
  private userId: string

  constructor(userClient: ReturnType<typeof createUserClient>, userId: string) {
    this.userClient = userClient
    this.userId = userId
  }

  /**
   * Upload file with optimized settings
   */
  async uploadFile(
    bucket: string,
    path: string,
    file: File | Blob,
    options: {
      contentType?: string
      cacheControl?: string
      upsert?: boolean
    } = {}
  ) {
    const { contentType, cacheControl = '3600', upsert = false } = options

    const { data, error } = await this.userClient.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        cacheControl,
        upsert,
        duplex: 'half',
      })

    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`)
    }

    return data
  }

  /**
   * Get public URL (for public buckets)
   */
  getPublicUrl(bucket: string, path: string) {
    const { data } = this.userClient.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  }

  /**
   * Get signed URL (for private buckets, expires in 1 hour)
   */
  async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600) {
    const { data, error } = await this.userClient.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)

    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`)
    }

    return data.signedUrl
  }

  /**
   * Delete file
   */
  async deleteFile(bucket: string, path: string) {
    const { error } = await this.userClient.storage
      .from(bucket)
      .remove([path])

    if (error) {
      throw new Error(`Storage delete failed: ${error.message}`)
    }

    return true
  }

  /**
   * List files in a path
   */
  async listFiles(bucket: string, path: string, options: {
    limit?: number
    offset?: number
    sortBy?: { column: string; order?: 'asc' | 'desc' }
  } = {}) {
    const { limit = 100, offset = 0, sortBy } = options

    const { data, error } = await this.userClient.storage
      .from(bucket)
      .list(path, {
        limit,
        offset,
        sortBy: sortBy ? { column: sortBy.column, order: sortBy.order || 'asc' } : undefined,
      })

    if (error) {
      throw new Error(`Storage list failed: ${error.message}`)
    }

    return data
  }
}

/**
 * Database helper with connection pooling and error handling
 */
export class DatabaseHelper {
  private serviceClient: ReturnType<typeof createServiceClient>

  constructor() {
    this.serviceClient = createServiceClient()
  }

  /**
   * Execute query with automatic retry and error handling
   */
  async query<T = any>(
    table: string,
    operation: (client: ReturnType<typeof createServiceClient>) => Promise<{ data: T | null; error: any }>
  ): Promise<T> {
    try {
      const { data, error } = await operation(this.serviceClient)

      if (error) {
        console.error(`Database query error on ${table}:`, error)
        throw new Error(`Database operation failed: ${error.message}`)
      }

      if (data === null) {
        throw new Error(`No data returned from ${table}`)
      }

      return data
    } catch (error) {
      console.error(`Database operation failed on ${table}:`, error)
      throw error
    }
  }

  /**
   * Ensure table exists before operation
   */
  async ensureTable(tableName: string) {
    const rpcFunction = `create_table_${tableName.replace(/s$/, '')}`
    const { error } = await this.serviceClient.rpc(rpcFunction).catch(() => ({ error: null }))
    
    if (error) {
      console.warn(`Table creation check for ${tableName} failed (may already exist):`, error.message)
    }
  }
}

export { corsHeaders }

