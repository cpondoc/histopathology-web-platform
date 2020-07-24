import React, { useState, useEffect, Component, useRef } from 'react';
import '../style/main.css';
import { withRouter } from "react-router";
import 'react-medium-image-zoom/dist/styles.css'
import 'bootstrap/dist/css/bootstrap.css';

class SignUp extends React.Component {

    // Setting the title of the page
    componentDidMount(){
      document.title = "Sign Up | Histopathology Web Platform"
    }

    // Defining state variables and binding events
    constructor(props) {
      super(props);
      this.state = {username: '', password: '', fullName:  ''};
  
      this.handleUserNameChange = this.handleUserNameChange.bind(this);
      this.handlePassWordChange = this.handlePassWordChange.bind(this);
      this.handleFullNameChange = this.handleFullNameChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleUserNameChange(event) {
      this.setState({username: event.target.value});
    }

    handleFullNameChange(event) {
      this.setState({fullName: event.target.value});
    }

    handlePassWordChange(event) {
        this.setState({password: event.target.value});
    }
  
    handleSubmit(event) {
      
      // Create an object of formData 
    const formData = new FormData(); 
    
    // Update the formData object with the username and password
    formData.append("username", this.state.username); 
    formData.append("password", this.state.password);
    formData.append("fullName", this.state.fullName);

    // AJAX Request to Sign Up API in Flask
    fetch('/sign-up', {
        method: "POST",
        credentials: "include",
        body: formData,
        cache: "no-cache"
      })

    window.location.href = "/inference";

    // Preventing a default
    event.preventDefault();
    }
  
    render() {
      return (
        <div className="container">
            <h1 className="title"><b>Sign Up Form</b></h1>
            <h4 className="title">Fill out the form with a username and password</h4>
            <br />
            <br />
            <form onSubmit={this.handleSubmit}>
                <div class="form-group">
                    <label for="full-name">Full Name</label>
                    <input value={this.state.fullName} onChange={this.handleFullNameChange} type="text" class="form-control" id="full-name" aria-describedby="fullNameHelp" placeholder="Full Name" /> 
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input value={this.state.username} onChange={this.handleUserNameChange} type="email" class="form-control" id="username" aria-describedby="usernameHelp" placeholder="Email" /> 
                </div>
                <div class="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input value={this.state.password} onChange={this.handlePassWordChange} type="password" class="form-control" id="password" aria-describedby="passwordHelp" placeholder="Password" />
                    <small id="passwordHelp" class="form-text text-muted">Make your password something you will remember!</small>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
            <br />
            <br />
        </div>
      );
    }
  }
  
  export default withRouter(SignUp);