module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        // Add the following lines to handle 'crypto' and 'fs' dependencies
        webpackConfig.resolve.fallback = {
          fs: require.resolve("browserify-fs"), // or 'empty' if you prefer an empty module
          crypto: require.resolve('crypto-browserify'),
          stream: require.resolve('stream-browserify'),
          path: require.resolve('path-browserify'),
          buffer: require.resolve('buffer/'),
          util: require.resolve("util/")
        };
  
        // Add the 'module' configuration for handling .wasm files
        webpackConfig.module.rules.push({
          test: /\.wasm$/,
          type: 'javascript/auto',
        });
  
        return webpackConfig;
      },
    },
  };
  