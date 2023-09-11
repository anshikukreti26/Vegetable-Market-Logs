const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const pickle = require('pickle'); // Import the pickle module

// Connect to MongoDB
mongoose.connect('mongodb+srv://anshikukreti26:130519Mk@vegetable-market-log.ixa5dvw.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connection successful");
}).catch((e) => {
  console.log("No connection");
});

// Create User Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define paths for static resources
const staticPath = path.join(__dirname, "/public");
const templatePath = path.join(__dirname, "/templates/views");

// Serve static files and set the view engine
app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", templatePath);

// Define your routes
// ... (existing routes)

// Start the server
app.listen(3005, () => {
  console.log('Server is running on port 3005');
});

// Middleware for serving static files and JSON body parsing
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// Serve your HTML files
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Load the trained machine learning model
let model;
fs.readFile('trained_model.pkl', (err, data) => {
  if (err) {
    console.error(`Error reading trained_model.pkl: ${err}`);
  } else {
    model = pickle.loads(data);
    console.log('Machine learning model loaded');
  }
});

// Add a route to handle predictions based on user input
app.post('/predict', (req, res) => {
  // Get the vegetable name from the request body
  const vegetableName = req.body.vegetableName;

  // Ensure that the model is loaded
  if (!model) {
    return res.status(500).json({ error: 'Machine learning model not loaded.' });
  }

  // Predict the price using the loaded model
  const predictedPrice = predictPrice(vegetableName);

  // Send the predicted price as a response
  res.json({ predictedPrice });
});

// Function to predict price for a given vegetable name
function predictPrice(vegetableName) {
  if (!model) {
    console.error('Machine learning model not loaded.');
    return null;
  }

  // Create a DataFrame with the same columns as X_encoded
  const input_data_encoded = {
    // Set the appropriate key for the vegetable name to 1
    [`Commodity_${vegetableName}`]: 1,
  };

  // Predict the price
  const predictedPrice = model.predict(input_data_encoded);

  return predictedPrice[0];
}
