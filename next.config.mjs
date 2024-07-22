/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                port: ""
            },
            {
                protocol: "https",
                hostname: "rave-hq.vercel.app",
                port: ""
            }
        ]
    }
};

export default nextConfig;