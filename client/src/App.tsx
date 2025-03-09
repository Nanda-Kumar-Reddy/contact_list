import { Component } from "react";
import React, { useState, useEffect, useRef } from "react";
import { BiHomeAlt } from "react-icons/bi";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import home from "../src/pages/home";
import "./App.css";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={home} />
          <Redirect to="not-found" />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
