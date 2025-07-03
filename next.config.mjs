/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  serverExternalPackages: ['@supabase/supabase-js'],
  // Ensure proper handling of client-side routing
  trailingSlash: false,
}

export default nextConfig
