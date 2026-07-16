import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Admin image uploads (mugshots/tattoos) go through server actions as
  // multipart form data, which defaults to a 1mb body limit.
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
