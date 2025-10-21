/**
 * Environment Variable Verification Script
 * Run this during build to verify all required environment variables are present
 */

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

const recommendedEnvVars = [
  'VITE_API_URL',
  'VITE_ENV',
  'VITE_ENABLE_DEBUG',
  'VITE_ENABLE_ANALYTICS',
  'VITE_IDLE_TIMEOUT',
  'VITE_IDLE_WARNING_TIME',
];

console.log('🔍 Verifying Environment Variables...\n');

let hasErrors = false;
let hasWarnings = false;

// Check required variables
console.log('📋 Required Variables:');
requiredEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value) {
    console.error(`❌ MISSING: ${varName}`);
    hasErrors = true;
  } else {
    // Show partial value for security (first 10 chars)
    const display = value.length > 10 ? `${value.substring(0, 10)}...` : value;
    console.log(`✅ ${varName}: ${display}`);
  }
});

console.log('\n📋 Recommended Variables:');
recommendedEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value) {
    console.warn(`⚠️  NOT SET: ${varName} (using default)`);
    hasWarnings = true;
  } else {
    console.log(`✅ ${varName}: ${value}`);
  }
});

console.log('\n' + '='.repeat(60));

if (hasErrors) {
  console.error('\n❌ BUILD WILL FAIL: Required environment variables are missing!');
  console.error('\nPlease set these variables in:');
  console.error('  - Vercel: Project Settings → Environment Variables');
  console.error('  - Local: .env.local file');
  process.exit(1);
}

if (hasWarnings) {
  console.warn('\n⚠️  Some optional variables are not set. Using defaults.');
  console.warn('Consider setting them for better production configuration.');
}

console.log('\n✅ All required environment variables are present!');
console.log('Proceeding with build...\n');
