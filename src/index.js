// React
import React from 'react';
import ReactDOM from 'react-dom';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch, useParams } from "react-router-dom";

// Style
import 'bootstrap/dist/css/bootstrap.css';

// Pages
import Inference from './pages/Inference';
import Results from './pages/Results';
import ViewImage from './pages/ViewImage';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Account from './pages/Account';

// Components
import Header from './components/Header';
import About from './components/About';
import Footer from './components/Footer';

// Rendering the DOM
ReactDOM.render(
  <React.StrictMode>
    <Router>
        <Switch>
        <Route path="/view/:id">
            <Header headline="View ROI" description="View a previously inferenced ROI."/>
            <ViewImage />
            <About />
            <Footer />
          </Route>
          <Route path="/results">
            <Header headline="Results" description="View previous images inferenced."/>
            <Results />
            <About />
            <Footer />
          </Route>
          <Route path="/inference">
            <Header headline="Inference" description="Get your Region of Interest (ROI) images of sarcoma and carcinoma tumors classified using our machine learning pipelines."/>
            <Inference />
            <About />
            <Footer />
          </Route>
          <Route path="/account">
            <Header headline="Account Information" description="View your account info."/>
            <Account />
            <About />
            <Footer />
          </Route>
          <Route path="/sign-up">
            <Header headline="Sign Up" description="Create a new user account."/>
            <SignUp />
            <About />
            <Footer />
          </Route>
          <Route path="">
            <Header headline="Histopathology Web Platform" description="A user-friendly and efficient platform for Region-Of-Interest inferencing."/>
            <Home />
            <About />
            <Footer />
          </Route>
        </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);