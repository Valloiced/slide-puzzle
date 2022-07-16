const path = require('path')
const HWP = require('html-webpack-plugin')

module.exports = {
    entry: {
        startup: path.resolve(__dirname, 'src/frontend/startup/index.jsx'),
        main: path.resolve(__dirname, 'src/frontend/main/index.jsx')
    }, 
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundles/[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(jpe?g|png)$/i,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[hash].[ext]'
                }
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    devServer: {
        port: 3001,
        open: true,
        proxy: {
            '/': 'http://localhost:3000'
        }
    },
    plugins: [
        new HWP({
            template: "./template/main.html",
            filename: "main.html",
            chunks: ['main']
        }),
        new HWP({
            template: "./template/main.html",
            filename: "startup.html",
            chunks: ['startup']
        })
    ]
}