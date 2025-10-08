/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    images: {
        unoptimized: true, // fixes image optimization for static export
    },
};

export default nextConfig;
