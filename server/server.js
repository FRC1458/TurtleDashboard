/**
 * (Testing only) Start test java server
 */
//import "./java/testJavaServer";


/**
 * Libraries
 */
import express from "express";
import http from "http";
import webpack from "webpack";
import path from "path";
import "colors";

import config from "../webpack.config.dev";

import {setupAPI} from "./api.js";

/**
 * Routing setup
 */
const app = express();
const server = http.Server(app);
const compiler = webpack(config);


/**
 * Start server on port 3000
 */
server.listen(3000, (error) => {
    if (error) {
        console.error("Startup Error", {error});
    } else {
        console.log("App started at http://localhost:3000".green);
    }
});


/**
 * Setup for React + Hot Reloading
 */
app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(require("webpack-hot-middleware")(compiler));


/**
 * API Setup
 */

setupAPI(server);


/**
 * Asset files and web pages
 */
app.use(express.static("public"));

app.get("*", (req, res) => {
    res.sendFile(path.join( __dirname, "../src/index.html"));
});