const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        main: path.resolve(__dirname, 'src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },

    devServer: {
        static: [
            path.resolve(__dirname, 'dist'),
            'assets'
        ],
        compress: true,
        port: 8080
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'THREEJS',
            filename: 'index.html',
            template: path.resolve(__dirname, 'index.html')
        }),

        new CopyWebpackPlugin({
            patterns: [
                {from: path.resolve(__dirname, './assets/atlas.png'), to: path.resolve(__dirname, './src/atlas.png')},
            ]
        })

    ]
}