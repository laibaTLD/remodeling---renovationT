import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

function buildImageRemotePatterns(): RemotePattern[] {
  const patterns: RemotePattern[] = [
    { protocol: "http", hostname: "localhost", port: "5000", pathname: "/api/uploads/**" },
    { protocol: "http", hostname: "127.0.0.1", port: "5000", pathname: "/api/uploads/**" },
    { protocol: "https", hostname: "sitifystudio.com", pathname: "/api/uploads/**" },
  ];

  const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!raw || raw.startsWith("/")) return patterns;

  try {
    const u = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    patterns.push({
      protocol: u.protocol.replace(":", "") as "http" | "https",
      hostname: u.hostname,
      ...(u.port ? { port: u.port } : {}),
      pathname: "/api/uploads/**",
    });
  } catch {
    /* ignore invalid env */
  }

  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    qualities: [75, 90, 95, 100],
    remotePatterns: buildImageRemotePatterns(),
  },
  async rewrites() {
    const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
    const remoteApi =
      raw && raw.startsWith('http')
        ? raw.replace(/\/$/, '')
        : null;
    const apiOrigin = remoteApi ?? 'http://localhost:5000/api';

    return [
      {
        source: '/api/:path*',
        destination: `${apiOrigin}/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${apiOrigin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;