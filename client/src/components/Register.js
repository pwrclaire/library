import React, { Component } from "react";
import axios from "axios";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import { apiBaseUrl } from '../services/api';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  handleRegister(event) {
    if(!this.state.username || !this.state.password) {
      alert("Username or password cannot be empty");
      return;
    }
    //To be done:check for empty values before hitting submit
    const self = this;
    var payload = {
      username: this.state.username,
      password: this.state.password
    };
    axios
      .post(apiBaseUrl + "/user/register", payload)
      .then(function(response) {
        if (response.status === 200) {
          alert("Registration was successful. Please login.")
          self.props.history.push("/login");
        }
      })
      .catch((error) => {
        alert("Username taken. Please choose a different one.");
      });
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <AppBar title="Register" />
            <TextField
              hintText="Enter your username"
              floatingLabelText="User Name"
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
                  this.handleRegister(event)
                }
              }}
            />
            <br />
            <RaisedButton
              label="Submit"
              primary={true}
              style={style}
              onClick={event => this.handleRegister(event)}
            />
            <h4>Have an account? <a href="/login">Login</a></h4>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

const style = {
  margin: 15
};
export default Register;
