import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import "./App.css";
import List from "./List";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={List} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
