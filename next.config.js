/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    ignoreBuildErrors: true,
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        if (!isServer) {
            config.plugins.push(
                new webpack.ProvidePlugin({
                    global: "global"
                })
            )

            config.resolve.fallback = {
                fs: false,
                stream: false,
                crypto: false,
                os: false,
                readline: false,
                ejs: false,
                assert: require.resolve("assert"),
                events: require.resolve("events"),
                path: false
            }

            return config
        }

        return config
    }
}

module.exports = nextConfig
