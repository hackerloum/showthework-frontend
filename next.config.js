/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost'],
        unoptimized: true,
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT,
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.(png|jpg|gif|svg)$/i,
            type: 'asset/resource'
        });
        return config;
    },
    // Add output configuration for static exports
    output: 'export',
    // Disable server-side features when exporting
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
    pageExtensions: ['js', 'jsx', 'ts', 'tsx']
};

module.exports = nextConfig; 
