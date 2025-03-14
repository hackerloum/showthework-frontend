/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'export',
    images: {
        unoptimized: true,
        domains: ['localhost']
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
    trailingSlash: true,
    pageExtensions: ['js', 'jsx', 'ts', 'tsx']
};

module.exports = nextConfig; 
