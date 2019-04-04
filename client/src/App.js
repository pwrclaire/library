import React, { Component } from "react";
import { Router, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Account from "./components/Account";
import { PrivateRoute } from "./services/privateRoute";
import { history } from "./services/history";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Router history={history}>
        <div className="App">
          <PrivateRoute  path="/account" component={Account} />
          <Route exact path="/" component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </div>
      </Router>
    );
  }
}

export default App;
