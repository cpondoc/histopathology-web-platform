import React, { useState, useEffect, Component, useRef } from 'react';
import '../style/main.css';
import 'bootstrap/dist/css/bootstrap.css';

class Results extends Component {

    // State variables
    state = {
        
        // Image names
        imageNames: null,

        // Directory of all the images
        imageAction: null
    }

    // Fetching the API call
    async componentDidMount() {

        // Setting the title of the document
        document.title = "Results | Histopathology Web Platform"

        // Path to API request
        const url = '/images';

        // Fetching the API request
        const response = await fetch(url);
        const data = await response.json();

        // Looking at the data and formatting
        const imageList = Object.keys(data).map((image) =>
            <tr>
                <th scope="row"><a href={"/view/" + data[image]['filename']}>{data[image]['filename']}</a></th>
                <td>{data[image]['guess']}</td>
                <td>{data[image]['confidence']}</td>
                <td>{data[image]['number']}</td>
            </tr>
        );

        // Setting state data
        this.setState({ imageNames: Object.keys(data), imageAction: imageList});
    }
    
    // Rendering the Results
    render() {
        return (
            <div className="container">
            <h1 className="title"><b>Catalog of ROIs</b></h1>
            <h4 className="title">All of the images inferenced.</h4>
            <br />
            <table class="table">
                <thead class="thead-light">
                    <tr>
                    <th scope="col">Image Name</th>
                    <th scope="col">Prediction</th>
                    <th scope="col">Strength of Prediction</th>
                    <th scope="col">Quantitative Value</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.imageAction ? (this.state.imageAction) : (<div></div>) }
                </tbody>
            </table>
            <br />
          </div>
          );
    }
}

export default Results;