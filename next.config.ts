import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El endpoint del PDF lee fuentes y logo del disco en runtime:
  // hay que incluirlos explícitamente en el bundle serverless.
  outputFileTracingIncludes: {
    "/api/cv-pdf": ["./public/fonts/**", "./public/brand/**"],
  },
  poweredByHeader: false,
};

export default nextConfig;
