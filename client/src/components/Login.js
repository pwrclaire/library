import React, { Component } from "react";
import axios from 'axios';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import { apiBaseUrl } from '../services/api';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      buttonLabel:'Register',
      isLogin:true
    };
  }


  handleLogin(event) {
    var self = this;
    var payload = {
      username: this.state.username,
      password: this.state.password
    };
    axios
      .post(apiBaseUrl + "/login", payload)
      .then(function(response) {
        if (response.status === 200) {
          localStorage.setItem('userId', response.data.token);
          self.props.history.push('/account');
        } else if (response.status === 401) {
          alert("username password do not match");
        } else {
          alert("Username does not exist");
        }
      })
      .catch(function(error) {
        alert("Username and password does not match");
      });
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <AppBar title="Login" />
            <TextField
              hintText="Enter your Username"
              floatingLabelText="Username"
              onChange={(event, newValue) =>
                this.setState({ username: newValue })
              }
            />
            <br />
            <TextField
              type="password"
              hintText="Enter your Password"
              floatingLabelText="Password"
              onChange={(event, newValue) =>
                this.setState({ password: newValue })
              }
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.handleLogin(event)
                }
              }}
            />
            <br />
            <RaisedButton
              label="Submit"
              primary={true}
              onClick={event => this.handleLogin(event)}
            />
            <br/>
            <h5>Don't Have An Account? <a href="/register">Click here to register.</a></h5>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default Login;
