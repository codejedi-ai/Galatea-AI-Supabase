# Galatea AI - Supabase Configuration Documentation

**Last Updated:** January 5, 2025  
**Project ID:** `Galatea-ai`  
**Status:** ✅ Running

## 🌐 Connection URLs

### Local Development
- **API URL:** `http://127.0.0.1:54321`
- **REST API:** `http://127.0.0.1:54321/rest/v1`
- **GraphQL API:** `http://127.0.0.1:54321/graphql/v1`
- **Edge Functions:** `http://127.0.0.1:54321/functions/v1`
- **Studio (Dashboard):** `http://127.0.0.1:54323`
- **Database URL:** `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- **Storage (S3):** `http://127.0.0.1:54321/storage/v1/s3`
- **Mailpit (Email Testing):** `http://127.0.0.1:54324`

### Production
- **API URL:** `https://your-project-ref.supabase.co` (Update with your project)
- **REST API:** `https://your-project-ref.supabase.co/rest/v1`
- **GraphQL API:** `https://your-project-ref.supabase.co/graphql/v1`
- **Edge Functions:** `https://your-project-ref.supabase.co/functions/v1`

## 🔑 Authentication Keys

### Local Development Keys

**Anon Key (Public):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

**Service Role Key (Secret - Server Only):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
```

**Publishable Key:**
```
sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
```

**Secret Key:**
```
sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
```

**JWT Secret:**
```
super-secret-jwt-token-with-at-least-32-characters-long
```

### Production Keys
⚠️ **Replace with your production project keys from Supabase Dashboard**

## 📦 Storage Buckets

The following storage buckets are configured:

### 1. `avatars`
- **Purpose:** User avatar images
- **Public:** ✅ Yes
- **File Size Limit:** Default (50MB)
- **Allowed MIME Types:** All image types

### 2. `banners`
- **Purpose:** User banner images
- **Public:** ✅ Yes
- **File Size Limit:** 5MB (5,242,880 bytes)
- **Allowed MIME Types:** 
  - `image/jpeg`
  - `image/png`
  - `image/gif`
  - `image/webp`
- **Storage Path Pattern:** `{userId}/{filename}`
- **RLS Policies:**
  - ✅ Anyone can view banners
  - ✅ Users can upload their own banner
  - ✅ Users can update their own banner
  - ✅ Users can delete their own banner

### 3. `companion-images`
- **Purpose:** AI companion profile images
- **Public:** ✅ Yes
- **File Size Limit:** Default (50MB)
- **Allowed MIME Types:** All image types

### 4. `profile-pics`
- **Purpose:** User profile pictures
- **Public:** ✅ Yes
- **File Size Limit:** 5MB (5,242,880 bytes)
- **Allowed MIME Types:**
  - `image/jpeg`
  - `image/png`
  - `image/gif`
  - `image/webp`
- **Storage Path Pattern:** `{userId}/{filename}`

## 🗄️ Database Tables

Tables are created automatically via Edge Functions or migrations. The following tables are expected:

### User Tables
- `user_profiles` - User profile information
- `user_preferences` - User matching preferences
- `user_stats` - User engagement statistics
- `user_profile_pics` - Profile picture metadata
- `user_banners` - Banner image metadata

### Companion Tables
- `companions` - AI companion profiles
- `swipe_decisions` - User swipe history
- `matches` - User-companion matches
- `conversations` - Chat sessions
- `messages` - Individual messages

### Other Tables
- `memory_entries` - Companion memory entries (if applicable)

## ⚡ Edge Functions

All Edge Functions are available at: `http://127.0.0.1:54321/functions/v1/{function-name}`

### Database Operations

1. **get-companions** (GET)
   - Get all companions or by ID
   - Query params: `?id={companionId}&limit={limit}`

2. **get-user-profile** (GET)
   - Get user profile, preferences, or stats
   - Query params: `?type={profile|preferences|stats}`

3. **update-user-profile** (POST/PATCH)
   - Update profile, preferences, stats, or last active
   - Body: `{ updates: {...}, type: 'profile'|'preferences'|'stats'|'last_active' }`

4. **get-conversations** (GET)
   - Get conversations with optional messages
   - Query params: `?id={conversationId}&messages={true|false}&limit={limit}&offset={offset}`

5. **send-message** (POST)
   - Send a message in a conversation
   - Body: `{ conversation_id, content, message_type, metadata }`

6. **get-matches** (GET)
   - Get user matches with optional details
   - Query params: `?id={matchId}&details={true|false}`

7. **process-swipe** (POST)
   - Process swipe decisions
   - Body: `{ companion_id, decision: 'like'|'pass'|'super_like' }`

### File Operations

8. **upload-avatar** (POST)
   - Upload user avatar images
   - FormData with `file` field
   - Returns: `{ success: true, url: string, path: string }`

9. **upload-profile-picture** (POST)
   - Upload profile pictures
   - FormData with `file` field
   - Returns: `{ success: true, url: string, key: string }`

10. **upload-banner** (POST)
    - Upload banner images
    - FormData with `file` field
    - Returns: `{ success: true, url: string, key: string }`

11. **get-profile-picture** (GET)
    - Get profile picture URL
    - Query params: `?cacheBust=true` (optional)
    - Returns: `{ success: true, url: string, key: string }` or `{ success: true, url: null }`

12. **get-banner** (GET)
    - Get banner URL
    - Query params: `?cacheBust=true` (optional)
    - Returns: `{ success: true, url: string, key: string }` or `{ success: true, url: null }`

13. **delete-profile-picture** (DELETE)
    - Delete profile picture
    - Returns: `{ success: true, message: string }`

14. **delete-banner** (DELETE)
    - Delete banner
    - Returns: `{ success: true, message: string }`

### Table Creation Functions

15. **create-table-user-banners** (POST)
    - Creates `user_banners` table if it doesn't exist

16. **create-table-user-profile-pics** (POST)
    - Creates `user_profile_pics` table if it doesn't exist

## 🔧 Configuration

### Project Settings
- **Project ID:** `Galatea-ai`
- **Database Port:** `54322`
- **API Port:** `54321`
- **Studio Port:** `54323`
- **Database Version:** PostgreSQL 17

### Storage Settings
- **File Size Limit:** 50MB (global)
- **S3 Access Key:** `625729a08b95bf1b7ff351a663f3a23c`
- **S3 Secret Key:** `850181e4652dd023b7a98c58ae0d2d34bd487ee0cc3254aed6eda37307425907`
- **S3 Region:** `local`

### Auth Settings
- **Site URL:** `http://127.0.0.1:3000`
- **JWT Expiry:** 3600 seconds (1 hour)
- **Signup Enabled:** ✅ Yes

### Edge Runtime Settings
- **Policy:** `oneshot`
- **Deno Version:** 1
- **Inspector Port:** 8083

## 📝 Migrations

Current migrations:
1. `20250105000000_ensure_storage_buckets.sql` - Creates avatars, companion-images, profile-pics buckets
2. `20250105000001_create_banners_bucket.sql` - Creates banners bucket with RLS policies

## 🚀 Quick Start Commands

### Start Supabase
```bash
cd Galatea-AI-Supabase
npx supabase start
```

### Stop Supabase
```bash
npx supabase stop
```

### Check Status
```bash
npx supabase status
```

### Start Edge Functions Server
```bash
npm run functions:serve
# OR
npx supabase functions serve --no-verify-jwt
```

### Reset Database
```bash
npx supabase db reset
```

### View Logs
```bash
npx supabase logs
```

## 📱 Client Configuration

### Environment Variables for Apps

Both apps should use these environment variables:

```env
# Supabase URLs
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_URL=http://127.0.0.1:54321

# Authentication Keys
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# Service Role Key (Server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
```

## 🔐 Security Notes

1. **Never commit** `.env.local` files with production keys
2. **Service Role Key** should only be used server-side (Edge Functions, API routes)
3. **Anon Key** is safe for client-side use
4. **RLS Policies** are enforced on all storage buckets
5. All database operations go through Edge Functions for security

## 📚 Additional Resources

- **Supabase Studio:** http://127.0.0.1:54323
- **Supabase Docs:** https://supabase.com/docs
- **Edge Functions Docs:** https://supabase.com/docs/guides/functions

