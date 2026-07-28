/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  webpack: (config) => {
    // wagmi's coinbaseWallet connector transitively pulls in
    // @coinbase/cdp-sdk, which optionally supports the x402 payment
    // protocol via packages we don't install and never call into.
    // Alias them to `false` so webpack emits an empty module instead of
    // failing to resolve them at build time.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@x402/evm/upto/client": false,
      "@x402/evm/exact/client": false,
      "@x402/evm": false,
      "@x402/svm/exact/client": false,
      "@x402/core/client": false,
    };
    return config;
  },
  async headers() {
    return [
      {
        // Farcaster + frame clients fetch the manifest cross-origin.
        source: "/.well-known/farcaster.json",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Content-Type", value: "application/json" },
        ],
      },
    ];
  },
};

export default nextConfig;
