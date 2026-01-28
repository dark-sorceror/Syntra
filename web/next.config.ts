import type { NextConfig } from "next";

const path = require("path");

const nextConfig: NextConfig = {
    reactStrictMode: true,
    output: "export",
    distDir: "./.next",
    outputFileTracingRoot: path.join(__dirname),
    productionBrowserSourceMaps: false,
    devIndicators: false,
};

export default nextConfig;
