/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
      config.module.rules.push({
        test: /mapbox-gl.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      });
      return config;
    },
  };
  
  export default nextConfig;