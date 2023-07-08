import { resolve } from 'node:path'
import { VueLoaderPlugin } from 'vue-loader'
import TerserPlugin from 'terser-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default {
    mode: 'development',
    entry: {
        main: resolve(import.meta.dirname, `www/main.js`),
        userscript: resolve(import.meta.dirname, `www/userscript.js`),
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader'],
            },
            {
                test: /\.jsx?$/i,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                        ],
                        plugins: [
                            '@emotion',
                            '@vue/babel-plugin-jsx',
                        ],
                    },
                }],
                exclude: /node_modules/,
            },
            {
                resourceQuery: /raw/,
                type: 'asset/source',
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: resolve(import.meta.dirname, 'www/index.html'),
            chunks: ['main'],
            hash: true,
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(import.meta.dirname, 'www'),
        },
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: false,
            })
        ],
    },
    performance: {
        maxEntrypointSize: 2 * 1024 * 1024,
        maxAssetSize: 2 * 1024 * 1024,
    },
}