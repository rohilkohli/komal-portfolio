import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'http://10.69.80.168:3000',
    '10.69.80.168',
    'http://localhost:3000',
    'localhost',
  ],
};

export default nextConfig;
