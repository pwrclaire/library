import React, { Component } from 'react';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";

import RaisedButton from "material-ui/RaisedButton";
import axios from 'axios';

import { apiBaseUrl } from '../services/api';
import Books from './Books';

class Account extends Component {
  
  logout = () => {
    // Clear session
    axios.get(apiBaseUrl + "/logout")
      .then(response => {
        if(response.status === 200) {
          localStorage.removeItem('userId');
          this.props.history.push('/login');
        }
      })
      .catch(err => {
        alert(err);
      })
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
            <AppBar title="My Account"/> 
            <br/>
            <Books/>
            <br/>
            <RaisedButton onClick={() => this.logout()}>Log out</RaisedButton>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default Account;