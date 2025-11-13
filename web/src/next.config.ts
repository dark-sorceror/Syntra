import type { NextConfig } from "next";

const path = require("path");

const nextConfig: NextConfig = {
    output: "export",
    distDir: "../out",
    outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
