/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_APP_FIREBASE_API_KEY: process.env.NEXT_APP_FIREBASE_API_KEY,
    NEXT_APP_FIREBASE_AUTH_DOMIAN: process.env.NEXT_APP_FIREBASE_AUTH_DOMIAN,
    NEXT_APP_FIREBASE_PROJECT_ID: process.env.NEXT_APP_FIREBASE_PROJECT_ID,
    NEXT_APP_FIREBASE_STORGAE_BUCKET:
      process.env.NEXT_APP_FIREBASE_STORGAE_BUCKET,
  },
};

module.exports = nextConfig;
