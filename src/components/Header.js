import React from 'react';
import '../style/main.css';
import logo from '../uploads/NCILogo.png'

function Header(props) {
  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <a className="navbar-brand" href="/"><img src={logo} height="40"/> Histopathology Web Platform</a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto"> 
             <li className="nav-item"> 
                    <a className="nav-link" href="/"> 
                      Home 
                    </a> 
              </li> 
              <li className="nav-item"> 
                  <a className="nav-link" href="/inference"> 
                    Inference 
                  </a> 
              </li> 
              <li className="nav-item"> 
                  <a className="nav-link" href="/results"> 
                    Results 
                  </a> 
              </li> 
              <li className="nav-item"> 
                  <a className="nav-link" href="/account"> 
                    Account 
                  </a> 
              </li> 
          </ul> 
        </div>
    </nav>
     <div className="jumbotron" id="frontHead">
        <h1><b>{props.headline}</b></h1>
        <h4>{props.description}</h4>
     </div>
   <br />
   </>
  );
}

export default Header;