const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");

module.exports = {
    entry: path.resolve(__dirname, '../..', './src/renderer/app.js'),
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                // required to prevent errors from Svelte on Webpack 5+
                test: /node_modules\/svelte\/.*\.mjs$/,
                resolve: {
                    fullySpecified: false
                }
            }
        ],
    },
    resolve: {
        alias: {
            svelte: path.dirname(require.resolve('svelte/package.json')),
            pages: path.resolve(__dirname, '../../src/renderer/pages'),
            components: path.resolve(__dirname, '../../src/renderer/components')
        },
        extensions: ['.mjs', '.js', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main']
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Enime',
            template: path.resolve(__dirname, '../..', './public/index.html'),
        }),
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(process.env)
        })
    ],
    output: {
        path: path.resolve(__dirname, '../..', 'dist/renderer'),
        filename: 'bundle.js',
    },
};
