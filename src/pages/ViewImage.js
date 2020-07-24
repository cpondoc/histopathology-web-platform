import React, { useState, useEffect, Component, useRef } from 'react';
import { withRouter } from "react-router";
import '../style/main.css';
import 'bootstrap/dist/css/bootstrap.css';
import Zoom from 'react-medium-image-zoom'

class ViewImage extends Component {

    // Sets the image variable
    state = {
        filename: null,
        confidence: null,
        guess: null,
        number: null,
        imageUrl: null,
        network: null
    }

    // Getting the id from the image, fetching API call.
    async componentDidMount() {

        // Getting the id from the image
        const id = this.props.match.params.id;
        console.log(id);

        // Making API request to Flask backend
        const url = '/images';
        const response = await fetch(url);
        const data = await response.json();
        const imageList = Object.keys(data);

        // Looping through images to save the right one
        var i;
        for (i = 0; i < imageList.length; i++) {
            if (data[imageList[i]]['filename'] === id) {
                this.setState({filename: data[imageList[i]]['filename'], 
                confidence: data[imageList[i]]['confidence'], 
                guess: data[imageList[i]]['guess'], 
                number: data[imageList[i]]['number'],
                imageUrl: data[imageList[i]]['url'],
                network: data[imageList[i]]['network']
            }
                );
            }
        }
    }


    // Rendering results to the screen.
    render() {
        return (
            <div className="container">
            <h1 className="title"><b>View Image</b></h1>
            <h4 className="title">Look at a specific ROI.</h4>
            <br />
            <br />
            {this.state.filename ? (<div><h3><b>Results for {this.state.filename}</b></h3>
                <hr />
                <div className="row">
                <div className="col-sm">
                    <p><b>Prediction:</b> {this.state.guess}</p>
                    <p><b>Network:</b> {this.state.network}</p>
                </div>
                <div className="col-sm">
                    <p><b>Confidence:</b> {this.state.confidence}</p>
                    <p><b>Strength:</b> {this.state.number}</p>
                </div>
                </div>
                <br />
                <div className="text-center">
                <Zoom>
                    <img alt={this.state.filename} src={this.state.imageUrl} width="800" />
                </Zoom>
                </div></div>) : (<div></div>) }
            <br />
            <br />
          </div>
          );
    }
}

export default withRouter(ViewImage);