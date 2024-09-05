const withTM = require('next-transpile-modules')([
  'rc-util',
  'rc-pagination',
  'antd',
  '@ant-design/icons',
  'rc-picker',
]);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_OPEN_WEATHER_MAP_API_KEY: process.env.NEXT_PUBLIC_OPEN_WEATHER_MAP_API_KEY,
  },
});

module.exports = nextConfig;