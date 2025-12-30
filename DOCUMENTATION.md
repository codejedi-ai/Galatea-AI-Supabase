# Galatea AI - Supabase Backend Documentation

**Last Updated:** January 5, 2025  
**Status:** ✅ All services running

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Connection Status](#connection-status)
3. [Configuration Details](#configuration-details)
4. [Edge Functions](#edge-functions)
5. [Database Schema](#database-schema)
6. [Storage Buckets](#storage-buckets)
7. [Migration History](#migration-history)
8. [Client Integration](#client-integration)
9. [Development Guide](#development-guide)
10. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

### Core Principles

1. **All Data Operations Through Edge Functions**
   - ❌ **NEVER** access the database directly from client applications
   - ❌ **NEVER** access storage buckets directly from client applications
   - ✅ **ALWAYS** use Edge Functions for all database and storage operations
   - ✅ Edge Functions handle authentication, validation, and business logic

2. **Automatic Resource Creation**
   - On first launch, an initialization function creates all required tables and resources
   - No manual migrations needed for new Supabase instances
   - Tables are created automatically when Edge Functions are called

3. **Centralized Logic**
   - All business logic lives in Edge Functions
   - Consistent error handling and validation
   - Single source of truth for data operations

### Shared Backend Architecture

This Supabase instance serves **multiple frontend applications**:

1. **Galatea-AI-Main** (Next.js) - Main application
2. **v0-Galatea-AI-character-factory** (Next.js) - Character factory
3. **Digital-Galatea** (Python Flask) - AI service (optional)

All applications connect to the same Supabase instance via environment variables.

---

## ✅ Connection Status

### Both Apps Connected

**Galatea-AI-Main:**
- ✅ Fully connected and using Edge Functions
- ✅ All database operations via Edge Functions
- ✅ All file operations via Edge Functions
- ✅ Edge Functions client library: `lib/edge-functions.ts`

**v0-Galatea-AI-character-factory:**
- ✅ Fully connected and using Edge Functions
- ✅ Profile operations via Edge Functions
- ✅ Edge Functions client library: `lib/edge-functions.ts`

### Current Status

- ✅ Supabase instance running
- ✅ Edge Functions server running
- ✅ All 23 Edge Functions available
- ✅ Storage buckets created
- ✅ Database tables created
- ✅ RLS policies enabled

---

## 🔧 Configuration Details

### Local Development URLs

- **API URL:** `http://127.0.0.1:54321`
- **REST API:** `http://127.0.0.1:54321/rest/v1`
- **GraphQL API:** `http://127.0.0.1:54321/graphql/v1`
- **Edge Functions:** `http://127.0.0.1:54321/functions/v1`
- **Studio (Dashboard):** `http://127.0.0.1:54323`
- **Database URL:** `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- **Storage (S3):** `http://127.0.0.1:54321/storage/v1/s3`
- **Mailpit (Email Testing):** `http://127.0.0.1:54324`

### Authentication Keys (Local Development)

**Anon Key (Public):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

**Service Role Key (Secret - Server Only):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
```

### Environment Variables for Edge Functions

**Local Development:**
```bash
export BANNER_BUCKET=banners
export STORAGE_BUCKET=profile-pics
```

**Production:**
Set in Supabase Dashboard → Edge Functions → Settings:
- `BANNER_BUCKET` = `banners`
- `STORAGE_BUCKET` = `profile-pics`

Or via CLI:
```bash
supabase secrets set BANNER_BUCKET=banners
supabase secrets set STORAGE_BUCKET=profile-pics
```

### Client Application Environment Variables

Both apps should use these in `.env.local`:

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

---

## ⚡ Edge Functions

All Edge Functions are available at: `http://127.0.0.1:54321/functions/v1/{function-name}`

### Initialization

**`initialize`** (POST)
- Creates all database tables
- Creates all storage buckets
- Sets up RLS policies
- Creates database functions and triggers
- **Call this once when setting up a new Supabase instance**

### Database Operations (15 functions)

1. **`get-companions`** (GET) - Get all companions or by ID
2. **`create-companion`** (POST) - Create a new companion
3. **`update-companion`** (POST) - Update companion details
4. **`delete-companion`** (POST) - Delete (deactivate) companion
5. **`get-recommended-companions`** (GET) - Get personalized recommendations
6. **`get-user-profile`** (GET) - Get user profile/preferences/stats
7. **`update-user-profile`** (POST) - Update profile/preferences/stats/last_active
8. **`ensure-user-profile`** (POST) - Ensure user profile exists
9. **`get-conversations`** (GET) - Get conversations with optional messages
10. **`send-message`** (POST) - Send a message in a conversation
11. **`mark-messages-read`** (POST) - Mark messages as read
12. **`update-conversation-status`** (POST) - Update conversation status
13. **`get-matches`** (GET) - Get user matches
14. **`deactivate-match`** (POST) - Deactivate a match
15. **`process-swipe`** (POST) - Process swipe decisions

### File Operations (8 functions)

16. **`upload-avatar`** (POST) - Upload user avatar
17. **`upload-profile-picture`** (POST) - Upload profile picture
18. **`upload-banner`** (POST) - Upload banner
19. **`get-profile-picture`** (GET) - Get profile picture URL
20. **`get-banner`** (GET) - Get banner URL
21. **`delete-profile-picture`** (DELETE) - Delete profile picture
22. **`delete-banner`** (DELETE) - Delete banner

### Table Creation Functions

23. **`create-table-user-banners`** (POST) - Creates `user_banners` table
24. **`create-table-user-profile-pics`** (POST) - Creates `user_profile_pics` table

---

## 🗄️ Database Schema

### User Tables

- **`user_profiles`** - User profile information
- **`user_preferences`** - User matching preferences
- **`user_stats`** - User engagement statistics
- **`user_profile_pics`** - Profile picture metadata
- **`user_banners`** - Banner image metadata

### Companion Tables

- **`companions`** - AI companion profiles
- **`swipe_decisions`** - User swipe history
- **`matches`** - User-companion matches
- **`conversations`** - Chat sessions
- **`messages`** - Individual messages

### Other Tables

- **`memory_entries`** - Companion memory entries (if applicable)

All tables have:
- Row Level Security (RLS) enabled
- Proper indexes for performance
- Foreign key constraints
- Timestamps (created_at, updated_at)

---

## 📦 Storage Buckets

### 1. `avatars`
- **Purpose:** User avatar images
- **Public:** ✅ Yes
- **File Size Limit:** Default (50MB)
- **Allowed MIME Types:** All image types

### 2. `banners`
- **Purpose:** User banner images
- **Public:** ✅ Yes
- **File Size Limit:** 5MB (5,242,880 bytes)
- **Allowed MIME Types:** `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- **RLS Policies:** Users can upload/update/delete their own banners

### 3. `companion-images`
- **Purpose:** AI companion profile images
- **Public:** ✅ Yes
- **File Size Limit:** Default (50MB)
- **Allowed MIME Types:** All image types

### 4. `profile-pics`
- **Purpose:** User profile pictures
- **Public:** ✅ Yes
- **File Size Limit:** 5MB (5,242,880 bytes)
- **Allowed MIME Types:** `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- **RLS Policies:** Users can upload/update/delete their own profile pictures

---

## 📝 Migration History

### Migrations Applied

1. **`20250105000000_ensure_storage_buckets.sql`**
   - Creates `avatars`, `companion-images`, and `profile-pics` buckets

2. **`20250105000001_create_banners_bucket.sql`**
   - Creates `banners` bucket with RLS policies

3. **`20250105000002_initial_schema.sql`**
   - Creates all database tables
   - Sets up indexes
   - Configures RLS policies
   - Creates triggers and constraints

### Running Migrations

```bash
cd Galatea-AI-Supabase
npx supabase db reset
```

This will:
- Drop all existing data
- Run all migrations in order
- Create all storage buckets
- Set up all tables and policies

---

## 🔗 Client Integration

### Using Edge Functions from Applications

Applications should use the Edge Functions client library:

```typescript
import { edgeFunctions } from '@/lib/edge-functions'

// Get companions
const companions = await edgeFunctions.getCompanions()

// Get user profile
const profile = await edgeFunctions.getUserProfile()

// Update profile
await edgeFunctions.updateUserProfile({ display_name: 'New Name' })

// Upload avatar
const url = await edgeFunctions.uploadAvatar(file)

// Send message
await edgeFunctions.sendMessage(conversationId, 'Hello!')

// Initialize (first time setup)
await edgeFunctions.initialize()
```

### Direct Edge Function Calls

If needed, you can call Edge Functions directly:

```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const token = await getAuthToken()

const response = await fetch(`${supabaseUrl}/functions/v1/get-companions`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
})

const result = await response.json()
```

---

## 🛠️ Development Guide

### First-Time Setup

#### Option 1: Run Migrations (Recommended)

```bash
# Start Supabase
cd Galatea-AI-Supabase
npx supabase start

# Run migrations (creates all tables and buckets)
npx supabase db reset
```

#### Option 2: Use Initialize Edge Function

```bash
# Start Supabase
cd Galatea-AI-Supabase
npx supabase start

# Start Edge Functions server
npx supabase functions serve --no-verify-jwt

# In another terminal, call the initialization function
curl -X POST http://127.0.0.1:54321/functions/v1/initialize \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

### Daily Development

**Start Supabase:**
```bash
cd Galatea-AI-Supabase
npx supabase start
```

**Start Edge Functions Server (in separate terminal):**
```bash
cd Galatea-AI-Supabase
npm run functions:serve
# OR
npx supabase functions serve --no-verify-jwt
```

**Check Status:**
```bash
npx supabase status
```

**View Database:**
```bash
open http://127.0.0.1:54323
```

**View Logs:**
```bash
npx supabase logs
```

**Stop Supabase:**
```bash
npx supabase stop
```

### Available Scripts

```bash
# Start Supabase
npm run start

# Stop Supabase
npm run stop

# Check Status
npm run status

# Reset Database
npm run reset

# Push Migrations
npm run migrate

# View Logs
npm run logs

# Open Studio
npm run studio

# Serve Edge Functions
npm run functions:serve

# Deploy All Functions
npm run functions:deploy:all
```

---

## 🐛 Troubleshooting

### Edge Functions Not Working

1. **Check if Edge Functions server is running:**
   ```bash
   npm run functions:serve
   ```

2. **Check Edge Functions logs:**
   ```bash
   npx supabase functions logs
   ```

3. **Verify environment variables are set:**
   ```bash
   echo $BANNER_BUCKET
   echo $STORAGE_BUCKET
   ```

### Tables Not Found

1. **Call the initialization function:**
   ```bash
   curl -X POST http://127.0.0.1:54321/functions/v1/initialize \
     -H "Authorization: Bearer YOUR_ANON_KEY"
   ```

2. **Or run migrations:**
   ```bash
   npx supabase db reset
   ```

### Storage Buckets Not Found

1. **Check if buckets exist in Supabase Studio:**
   - Open http://127.0.0.1:54323
   - Go to Storage section
   - Verify buckets exist

2. **Call the initialization function or run migrations**

### Service Temporarily Unavailable (503)

- **Cause:** Edge Functions server is not running
- **Fix:** Start Edge Functions server:
  ```bash
  npm run functions:serve
  ```

### Unauthorized Errors

- **Cause:** Missing or invalid JWT token
- **Fix:** Ensure user is authenticated and token is included in request headers

### Bucket Not Found

- **Cause:** Bucket doesn't exist or wrong bucket name
- **Fix:** Run migrations or call initialization function

---

## 🔐 Security Notes

1. **Never commit** `.env.local` files with production keys
2. **Service Role Key** should only be used server-side (Edge Functions, API routes)
3. **Anon Key** is safe for client-side use
4. **RLS Policies** are enforced on all storage buckets
5. All database operations go through Edge Functions for security
6. Edge Functions validate all user input
7. File uploads are validated for type and size

---

## 📚 Additional Resources

- **Supabase Studio:** http://127.0.0.1:54323
- **Supabase Docs:** https://supabase.com/docs
- **Edge Functions Docs:** https://supabase.com/docs/guides/functions
- **Configuration Details:** See `SUPABASE_CONFIGURATION.md`
- **Edge Functions Environment:** See `EDGE_FUNCTIONS_ENV.md`

---

## 📊 Summary

- **Total Edge Functions:** 24
- **Database Operations:** 15 functions
- **File Operations:** 8 functions
- **Table Creation:** 2 functions
- **Initialization:** 1 function

- **Storage Buckets:** 4 (avatars, banners, companion-images, profile-pics)
- **Database Tables:** 11+ (user_profiles, companions, conversations, etc.)

- **Connected Applications:** 2 (Galatea-AI-Main, v0-Galatea-AI-character-factory)

---

**Remember:** All data operations must go through Edge Functions. Never access the database or storage directly from client applications!

