import "babel-polyfill";
import ComponentTree from "react-component-tree";
import Dashboard from "./components/dashboard/Dashboard.js"

/**
 * React
 */
import React from "react";
import { render } from "react-dom";
import { Router, browserHistory } from "react-router";

/**
 * Libraries
 */

/**
 * Modules
 */
import { routes } from "./routes";

/**
 * Stylesheets
 */
import "!style!css!sass!./styles/scss/index.scss";

render(
    <Router history={browserHistory} routes={routes} />,
    document.getElementById("app")
);
