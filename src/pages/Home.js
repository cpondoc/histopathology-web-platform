import React, { useState, useEffect, Component, useRef } from 'react';
import { withRouter } from "react-router";
import '../style/main.css';
import 'bootstrap/dist/css/bootstrap.css';
import classificationScreenshot from '../uploads/ClassificationPortalScreenshot.png'
import listScreenshot from '../uploads/CatalogPortalScreenshot.png'

class Home extends Component {

    // Setting the title of the page
    componentDidMount(){
        document.title = "Home | Histopathology Web Platform"
    }

    // Rendering results to the screen.
    render() {
        return (
            <>
            <div className="container">
            <h1 className="title"><b>Features</b></h1>
            <h4 className="title">Check out what our platform has to offer.</h4>
            <br />
            <br />
            <div class="row">
                    <div class="col-sm homePageDescriptor">
                        <h2><b>Get your ROIs classified quickly.</b></h2>
                        <h4>Use our pre-trained machine learning models to classify between sarcoma and carcinoma in under a minute.</h4>
                    </div>
                    <div class="col-sm">
                        <img src={classificationScreenshot} width="610"/>
                    </div>
            </div>
            <br />
            <br />
            <div class="row">
                <div class="col-sm">
                    <img src={listScreenshot} width="600"/>
                </div>
                <div class="col-sm homePageDescriptor">
                    <h2 id="rightSideText"><b>Catalog all of your inferences.</b></h2>
                    <h4 id="rightSideText">Create user accounts to view previously inferenced images, without spending more computation power.</h4>
                </div>
            </div>
            <br />
            <br />
            <br />
            <h4 className="title">Ready to get started? Click <a href="/sign-up">here</a> to sign up!</h4>
            <br />
            <br />
            </div>
            </>
          );
    }
}

export default withRouter(Home);