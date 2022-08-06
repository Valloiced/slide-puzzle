const path = require('path')
const HWP = require('html-webpack-plugin')

module.exports = {
    entry: {
        startup: path.resolve(__dirname, 'src/client/Startup/index.jsx'),
        landing: path.resolve(__dirname, 'src/client/Landing/index.jsx'),
        // profile: path.resolve(__dirname, 'src/client/User/Profile/index.jsx'),
        userPuzzles: path.resolve(__dirname, 'src/client/User/User Puzzles/index.jsx'),
        gameOptions: path.resolve(__dirname, 'src/client/Game/Game Options/index.jsx'),
        game: path.resolve(__dirname, 'src/client/Game/Game Play/index.jsx')
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
            },
            {
                test: /\.svg$/i,
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'react-svg-loader',
                        options: {
                            jsx: true
                        }
                    }
                ]
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
            title: "Explore",
            template: "./template/main.html",
            filename: "landing.html",
            chunks: ['landing']
        }),
        new HWP({
            title: "Puzzle Game",
            template: "./template/main.html",
            filename: "startup.html",
            chunks: ['startup']
        }),
        new HWP({
            title: "Your Puzzles",
            template: "./template/main.html",
            filename: "userPuzzles.html",
            chunks: ['userPuzzles']
        }),
        new HWP({
            title: "Game Options",
            template: "./template/main.html",
            filename: "gameOptions.html",
            chunks: ['gameOptions']
        }),
        new HWP({
            title: "Game",
            template: "./template/main.html",
            filename: "game.html",
            chunks: ['game']
        })
    ]
}