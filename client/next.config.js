/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
      },
      webpack: (config) => {
        config.watchOptions.poll = 300;
        return config;
      },
};

module.exports = nextConfig;
