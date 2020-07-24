import React, { useState, useEffect, Component, useRef } from 'react';
import '../style/main.css';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import 'bootstrap/dist/css/bootstrap.css';

class Inference extends Component { 

  state = { 

    // Initially, no file is selected 
    selectedFile: null,
    image: null,
    strength: null,
    prediction: null,
    confidence_level: null,
    network: "VGG-16"
  }; 
  
  // On file select (from the pop up) 
  onFileChange = event => { 
    
    // Update the state 
    this.setState({ 
      selectedFile: event.target.files[0], 
      image: URL.createObjectURL(event.target.files[0]) }); 
    
  }; 

  // On network change
  onNetworkChange = event => {

    // Update the state 
    this.setState({ 
      network: event.target.value}); 

  };
  
  // On file upload (click the upload button) 
  onFileUpload = () => { 
    
    // Create an object of formData 
    const formData = new FormData(); 
    
    // Update the formData object with the file
    formData.append( 
      "myFile", 
      this.state.selectedFile, 
      this.state.selectedFile.name
    ); 

    // Update formData object with image url
    formData.append("image_url", this.state.image);

    // Updating formData with the name of the network
    formData.append("pretrained_model", this.state.network);
    
    // Check message
    console.log("Test Message");

    // Details of the uploaded file 
    console.log(this.state.image); 

    // Sending data to the backend API
    fetch('/file', {
      method: "POST",
      credentials: "include",
      body: formData,
      cache: "no-cache"
    }).then(response => response.json())
    .then(data => {
      console.log(data)
      if (data)
      {
        console.log(data['confidence'])
        this.setState({
          strength: data['confidence'],
          prediction: data['guess'],
          confidence_level: data['number']
        })
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  }; 
  
  fileData = () => { 
    
    // Image has been uploaded but prediction hasn't been made
    if (this.state.selectedFile && this.state.strength === null) { 
      return ( 
        <>
          <br />
          <br />
          <h3><b>File Details:</b></h3> 
          <hr />
          <div className ="row">
            <div className ="col-sm">
              <p><b>File Name:</b> {this.state.selectedFile.name}</p> 
              <p><b>Last Modified:{" "}</b>{this.state.selectedFile.lastModifiedDate.toDateString()}</p> 
            </div>
            <div className ="col-sm">
              <p><b>File Type:</b> {this.state.selectedFile.type}</p> 
            </div>
          </div>
          <br />
          <div className="text-center">
            <Zoom>
              <img
                alt={this.state.selectedFile.name}
                src={this.state.image}
                width="800"
              />
          </Zoom>
          </div>
        </>
      ); 
    } 

    // Prediction has been made, so results can be shown
    else if (this.state.selectedFile && this.state.strength !== null) {
      return (
        <>
        <br />
        <br />
        <h3><b>Results</b></h3>
        <hr />
        <div className="row">
          <div className="col-sm">
              <p><b>Prediction:</b> {this.state.prediction}</p>
              <p><b>Network:</b> {this.state.network}</p>
          </div>
          <div className="col-sm">
            <p><b>Confidence:</b> {this.state.confidence_level}</p>
            <p><b>Strength:</b> {this.state.strength}</p>
          </div>
        </div>
        <br />
        <div className="text-center">
          <Zoom>
            <img
              alt={this.state.selectedFile.name}
              src={this.state.image}
              width="800"
            />
          </Zoom>
        </div>
        <br />
        <br />
        </>
      )
    }
    else { 
      return ( 
          <>
          </> 
      ); 
    } 
  }; 

  // What the user sees
  render() { 
    
    return ( 
      <div className="container">
            <h1 className="title"><b>Classification Portal</b></h1>
            <h4 className="title">Get your images scanned in and classified.</h4>
          <br/>
          <div className="jumbotron">
              <h2><b>Upload Image</b></h2>
              <br />
              <h4>Upload an image of your H&E stained ROI and we will classify it as either sarcoma or carcinoma.</h4>
              <p><em>Accepted File Extensions: .jpg, .png, .jpeg, .gif</em></p>
              <br />
              <div class="form-group">
                <input type="file" onChange={this.onFileChange} /> 
              </div>
              <div class="form-group">
                <br />
                <label for="exampleFormControlSelect1"><b>Pre-Trained Model:</b></label>
                <select onChange={this.onNetworkChange} class="form-control" id="model_name" name="model_name">
                  <option>VGG-16</option>
                  <option>Xception</option>
                  <option>InceptionV3</option>
                  <option>VGG-19</option>
                  <option>DenseNet</option>
                </select>
              </div>
              <br />
              <div class="form-group">
                <button type="button" class="btn btn-danger" onClick={this.onFileUpload}> Upload! </button> 
              </div>
              {this.fileData()} 
          </div> 
          <br />
      </div> 
    ); 
  } 
} 

export default Inference;