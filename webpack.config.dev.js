import webpack from "webpack";
import path from "path";
import ExtractTextPlugin from "extract-text-webpack-plugin";

export default {
    debug: true,
    devtool: "source-map",
    noInfo: false,
    entry: [
        "eventsource-polyfill",
        "webpack-hot-middleware/client?reload=true",
        path.resolve(__dirname, "src/index")
    ],
    target: "web",
    output: {
        path: __dirname + "/dist",
        publicPath: "/",
        filename: "bundle.js"
    },
    devServer: {
        contentBase: path.resolve(__dirname, "src")
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
        //new ExtractTextPlugin(__dirname + "/dist/style.css", {
        //    allChunks: true
        //})
    ],
    module: {
        loaders: [
            {test: /\.js$/, include: path.join(__dirname, "src"), loaders: ["babel"]},
            {test: /(\.css)$/, loaders: ["style", "css?sourceMap"]},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
            {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url?limit=10000&mimetype=application/font-woff"},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"},
            {
                test: /\.scss$/,
                loader: ["style", "css", "sass"]
            }
        ]
    }
};
