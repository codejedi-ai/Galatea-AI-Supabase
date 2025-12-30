#!/usr/bin/env node

/**
 * Parse config.md and output environment variables
 * Usage: node parse-config.js > .env.local
 */

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.md');

if (!fs.existsSync(configPath)) {
  console.error('config.md not found');
  process.exit(1);
}

const configContent = fs.readFileSync(configPath, 'utf-8');

// Extract values from config.md
const extractValue = (pattern) => {
  const match = configContent.match(pattern);
  return match ? match[1].trim() : null;
};

// Extract Project URL
const projectUrl = extractValue(/Project URL\s+\|\s+([^\s]+)/) || 'http://127.0.0.1:54321';
const restUrl = extractValue(/REST\s+\|\s+([^\s]+)/) || `${projectUrl}/rest/v1`;
const graphqlUrl = extractValue(/GraphQL\s+\|\s+([^\s]+)/) || `${projectUrl}/graphql/v1`;
const functionsUrl = extractValue(/Edge Functions\s+\|\s+([^\s]+)/) || `${projectUrl}/functions/v1`;

// Extract Database URL
const dbUrl = extractValue(/Database URL\s+\|\s+([^\s]+)/) || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

// Extract Authentication Keys
const publishableKey = extractValue(/Publishable\s+\|\s+([^\s]+)/) || '';
const secretKey = extractValue(/Secret\s+\|\s+([^\s]+)/) || '';

// Extract Storage
const storageUrl = extractValue(/Storage URL\s+\|\s+([^\s]+)/) || `${projectUrl}/storage/v1/s3`;
const accessKey = extractValue(/Access Key\s+\|\s+([^\s]+)/) || '';
const secretAccessKey = extractValue(/Secret Key\s+\|\s+([^\s]+)/) || '';
const region = extractValue(/Region\s+\|\s+([^\s]+)/) || 'local';

// Extract Studio URL
const studioUrl = extractValue(/Studio\s+\|\s+([^\s]+)/) || 'http://127.0.0.1:54323';

// Default keys for local development (if not found in config)
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

// Output environment variables
console.log(`# Auto-generated from config.md
# Generated: ${new Date().toISOString()}

# Supabase URLs
NEXT_PUBLIC_SUPABASE_URL=${projectUrl}
SUPABASE_URL=${projectUrl}
SUPABASE_REST_URL=${restUrl}
SUPABASE_GRAPHQL_URL=${graphqlUrl}
SUPABASE_FUNCTIONS_URL=${functionsUrl}
SUPABASE_STUDIO_URL=${studioUrl}

# Database
SUPABASE_DB_URL=${dbUrl}

# Authentication Keys
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}
SUPABASE_ANON_KEY=${anonKey}
SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}
SUPABASE_PUBLISHABLE_KEY=${publishableKey}
SUPABASE_SECRET_KEY=${secretKey}

# Storage (S3)
SUPABASE_STORAGE_URL=${storageUrl}
SUPABASE_S3_ACCESS_KEY=${accessKey}
SUPABASE_S3_SECRET_KEY=${secretAccessKey}
SUPABASE_S3_REGION=${region}
`);

