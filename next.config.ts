import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXTAUTH_URL:
      process.env.NEXTAUTH_URL || "https://awaaz-odoo-hack.vercel.app",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        port: "",
        pathname: "/gh/devicons/devicon/**",
      },
    ],
  },
};

export default nextConfig;
