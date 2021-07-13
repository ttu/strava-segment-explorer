module.exports = {
  reactStrictMode: true,
  webpack5: false,
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on node modules
    if (!isServer) {
      config.node = {
        net: 'empty',
        tls: 'empty',
        fs: 'empty',
      };
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};
