# Important Import Statements
import time
import os
from flask import Flask, flash, request, redirect, url_for, send_from_directory, render_template, jsonify, make_response, session
from werkzeug.utils import secure_filename
from tensorflow import keras
from tensorflow.keras.models import *
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.preprocessing.image import ImageDataGenerator, array_to_img, img_to_array, load_img
from PIL import Image
from models import *
import pyrebase
import json

""" Global Variables """

# Defining for uploads
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

# Creating the app
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = "Secret Key"
userID = ""
fullName = ""

# Config for firebase
config = {
    "apiKey": "AIzaSyBLPbIfTzRDEu8iUdlr-ljLQ3PGwK56yoE",
    "authDomain": "histowebinfer.firebaseapp.com",
    "databaseURL": "https://histowebinfer.firebaseio.com",
    "projectId": "histowebinfer",
    "storageBucket": "histowebinfer.appspot.com",
    "messagingSenderId": "998137399054",
    "appId": "1:998137399054:web:50b6134d7f3fa6ada6395f",
    "measurementId": "G-D3J60RNN02"
}

# Initializing the database
firebase = pyrebase.initialize_app(config)
db = firebase.database()
auth = firebase.auth()
storage = firebase.storage()

""" Necessary Check Functions """

# Checking if the file is allowed
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

""" Routes """

# Route to get account info
@app.route('/account-info')
def get_account():

    # Setting to global user ID and full name variables
    global userID
    global fullName

    # Getting user email
    user_email = auth.get_account_info(userID)['users'][0]['email']
    return {'time' : time.time(), 'email' : user_email, 'name' : fullName}

# Dummy API call
@app.route('/time')
def get_current_time():
    return {'time' : time.time()}

# Get all the data from already uploaded images
@app.route('/images')
def get_images():

    # Gets the user's session ID
    global userID

    # Keys of incorrect values
    incorrect = []

    # Getting images from the database
    images = db.child("images").get()

    # Getting the ordered dictionary
    images_dict = images.val()

    print("Before Edit")
    print(json.dumps(images_dict))

    # Parsing through all possibilities
    for key, value in images_dict.items():

        # Checking the value
        print("User ID")
        print(auth.get_account_info(userID)['users'][0]['localId'])
        print("Type of User ID")
        print(type(auth.get_account_info(userID)['users'][0]['localId']))
        print("Value ID")
        print(value['userID'])
        print("Type of Value ID")
        print(type(value['userID']))

        if (value['userID'] != auth.get_account_info(userID)['users'][0]['localId']):
            incorrect.append(key)

    for key in incorrect:
        images_dict.pop(key)

    print("Incorrect Keys")
    print(incorrect)

    print("After Edit")
    print(json.dumps(images_dict))


    print(type(images_dict))
    print(type(images.val()))
    print(json.dumps(images_dict))


    return(json.dumps(images_dict))

# Sign Up form!
@app.route('/sign-up', methods=['GET', 'POST'])
def create_user():

    # Getting the data from the sign up form
    if request.method == 'POST':

        # Using the global User ID and full name variables
        global userID
        global fullName

        # Getting the email, password, and full name of the user
        email = (request.form['username'])
        password = (request.form['password'])
        fullName = (request.form['fullName'])

        # Creating the user, signing in, and refreshing the token
        auth.create_user_with_email_and_password(email, password)
        user = auth.sign_in_with_email_and_password(email, password)
        user = auth.refresh(user['refreshToken'])

        # Setting a Global User ID
        userID = user['idToken']

        # Ensuring User ID is working
        print(userID)

        # Creating a user instance
        newUser = {
            'email': auth.get_account_info(userID)['users'][0]['email'],
            'localId': auth.get_account_info(userID)['users'][0]['localId'],
            'name': fullName
        }

        # Pushing to database
        db.child("users").push(newUser)

        return {
            'number' : 0,
            'guess' : 'Carcinoma',
            'confidence' : 'Weak'
        }
        #return redirect(url_for('get_account'))


# Get the url for images
@app.route('/storage')
def get_urls():
    images = db.child("images").get()

# Unfreezing layers for DL training
# Defining Pre-Trained Models
def unfreeze_layers(model_name, conv_base):
    
    # Unfreezing all
    conv_base.trainable = True
    
    # Case for VGG-16
    if (model_name == "VGG-16" or model_name == "VGG-19"):
        set_trainable = False
        for layer in conv_base.layers:
            if layer.name == 'block5_conv1':
                set_trainable = True
            if set_trainable:
                layer.trainable = True
            else:
                layer.trainable = False
    
    # Case for Xception            
    elif (model_name == "Xception"):
        for layer in conv_base.layers[:10]:
            layer.trainable = False
    
    # Case for InceptionV3
    elif (model_name == "InceptionV3"):
        for layer in conv_base.layers[:249]:
            layer.trainable = False
    
    # Case for DenseNet
    elif (model_name == "DenseNet"):
        for layer in conv_base.layers[:15]:
            layer.trainable = False

# Grabbing image from React + classifying
@app.route('/file', methods=['GET', 'POST'])
def upload_file():

    # Getting the request from the exterior API
    if request.method == 'POST':
        
        # Grabbing user id to save global data
        global userID

        print("Start Data:")
        print(request.form['image_url'])
        print("End Data")
        """ Making Prediction """

        # Model name
        model_name = request.form['pretrained_model']

        # Convolutional base
        conv_base = return_pretrained(model_name)

        # Build model
        model = build_model(conv_base)

        # Unfreeze Layers
        unfreeze_layers("", conv_base)

        # Load Model
        model = load_model("weights/" + model_name + ".h5")

        # Check message for success
        print("Loaded model weights for: " + model_name)

        # Checking for the correct file
        if 'myFile' not in request.files:
            flash('No file part')
            return redirect(request.url)

        # Saving the file
        file = request.files['myFile']

        # Checking if the file name is blank
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)

        # Getting the file name
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], "test-wsi.jpg"))


        # Checking filename for storage
        print(request.files)
        print(file)
        print(filename)

        # Attempting test image
        test_image = image.load_img(file, target_size=(425, 256))

        # Casting the image into an array
        test_image = image.img_to_array(test_image)
        
        # Expanding the dimensions of the image
        test_image = np.expand_dims(test_image, axis = 0)
        
        # Dividing by 255
        test_image = test_image / 255
                
        # Predicting the type of the test image
        result = model.predict(test_image)

        # Checking what the network guesses
        if (result[0] <= .5):
            guess = "Carcinoma"
            if (result[0] < .25):
                confidence_level = "Strong"
            else:
                confidence_level = "Weak"
        else:
            guess = "Sarcoma"
            if (result[0] > .75):
                confidence_level = "Strong"
            else:
                confidence_level = "Weak"

        # Saving image to cloudstore
        storage.child("images/" + filename).put("uploads/test-wsi.jpg")
        image_url = storage.child("images/" + filename).get_url(1)

        # Preparing data for database
        data = {
            'filename': filename,
            'number' : float(result[0]),
            'guess' : guess,
            'confidence' : confidence_level,
            'url': image_url,
            'network': model_name,
            'userID': auth.get_account_info(userID)['users'][0]['localId']
        }

        # Pushing data to database
        db.child("images").push(data)

        # Returning image from fetch request
        return {
            'number' : float(result[0]),
            'guess' : guess,
            'confidence' : confidence_level
        }

    # Null return statement
    return {
        'number' : 0,
        'guess' : 'Carcinoma',
        'confidence' : 'Weak'
    }