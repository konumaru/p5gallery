/** @type {import('next').NextConfig} */

const nextConfig = {
    output: "export",
    env: {
        FAVICON_URL: process.env.NODE_ENV === 'production' ? '/favicon.svg' : '/next.svg',
    },
};

export default nextConfig;
