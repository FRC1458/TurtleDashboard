import React from "react";
import { Route, IndexRoute } from "react-router";

import App from "./components/App";

import Dashboard from "./components/dashboard/Dashboard";

export let routes = (
    <Route path="/" component={App}>
        <IndexRoute component={Dashboard} />
    </Route>
);