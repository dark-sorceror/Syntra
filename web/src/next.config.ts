import type { NextConfig } from "next";

const path = require("path");

const nextConfig: NextConfig = {
    reactStrictMode: true,
    output: "export",
    distDir: "./.next",
    outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
