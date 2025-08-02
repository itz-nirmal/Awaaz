import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXTAUTH_URL:
      process.env.NEXTAUTH_URL || "https://awaaz-odoo-hack.vercel.app",
  },
};

export default nextConfig;
