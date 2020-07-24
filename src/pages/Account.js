import React, { useState, useEffect, Component, useRef } from 'react';
import { withRouter } from "react-router";
import '../style/main.css';
import 'bootstrap/dist/css/bootstrap.css';
import logo from '../uploads/userLogo.png'

class Account extends Component {

    // Holding variables for email and password
    state = { 
        email: null,
        password: null
      }; 

    // Getting the id from the image, fetching API call.
    async componentDidMount() {

        // Setting the title of the document
        document.title = "Account | Histopathology Web Platform"

        // Making API request to Flask backend
        const url = '/account-info';

        // Making fetch request, awaiting data, getting the updated state
        const response = await fetch(url);
        const data = await response.json();
        const imageList = Object.keys(data);
        this.setState({ email: data['email'], name: data['name']});
    }


    // Rendering results to the screen.
    render() {
        return (
          <div className="container">
              <h1 className="title"><b>Welcome Back!</b></h1>
              <h4 className="title">Check out your user settings.</h4>
              <br />
              <div class="row">
                  <div class="col"></div>
                  <div class="col sm-8">
                  <div class="card" id="user-card">
                    <div class="card-body">
                        <br />
                        <img src={logo} alt="User image" height="100"/>
                        <br />
                        <br />
                        <h5><b>Name: </b>{this.state.name}</h5>
                        <h5><b>Email: </b>{this.state.email}</h5>
                        <br />
                    </div>
                  </div>
                  </div>
                  <div class="col"></div>
              </div>
            <br />
            <br />
          </div>
          );
    }
}

export default withRouter(Account);