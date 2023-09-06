const express = require('express');
const mongoose = require('mongoose');

const path=require("node:path/posix")
const app = express();

const bodyParser = require('body-parser');

const joblib = require('joblib');
const model = joblib.load('trained_model.joblib');

const bodyParser = require('body-parser');

// Connect to MongoDB
mongoose.connect('mongodb+srv://Anushka:Msniprisha30**@cluster0.g4ywyno.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
 
}).then(()=>{
  console.log("connection successfull")
}).catch((e)=>{
  console.log("no connection")
});



// Create User Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Handle user registration
const static_path=path.join(__dirname,"/public");
const template_path=path.join(__dirname,"/templates/views")
app.use(express.static(static_path))
app.set("view engine","hbs")
app.set("views",template_path)
app.get("/",(req,res)=>{
  res.render("login")
})
app.get("/register",(req,res)=>{
  res.render("register")
})
app.post('/register', async (req, res) => {
 
  const user = await User.findOne({ email:req.body.email });
  if (user) {
    return res.status(404).send("User already there");
  }
  
  const newUser = new User({email: req.body.email, password:req.body.password });
  await newUser.save();

  res.status(201).send("Record added successfully");
});

// Handle user login
app.get("/login",(req,res)=>{
  res.render("login")
})
app.post('/login', async (req, res) => {
 
 try{
  const email=req.body.email;
  const password=req.body.password;

  console.log(`${email}`);
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send("User not found");
  }

  if (user.password !== password) {
    return res.status(401).send("Incorrect password");
  }
  console.log("successfully login")
  res.render("home");
 }
 catch(err)
 {
  res.status(400).send("invalid email");
 }
});

app.get("/about",(req,res)=>{
  res.render("about")
})
app.get("/payment",(req,res)=>{
  res.render("payment")
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.use(bodyParser.json()); // Parse JSON request body

// Create a route for predictions
app.post('/predict', (req, res) => {
  try {
    const vegetable_name = req.body.vegetable; // Get vegetable name from request body
    // Load dataset and prepare input data for prediction
    const data = require('./dataset.json'); // Load dataset (assuming it's in JSON format)
    const input_data = data.find(item => item.Commodity === vegetable_name);
    if (!input_data) {
      return res.status(404).json({ error: 'Vegetable not found in dataset' });
    }
    // Create an empty object for input features
    const input_features = {};
    // Add the dynamic key-value pair to input_features
    input_features['Commodity_' + vegetable_name] = 1; 
    // Make predictions using the loaded model
    const predicted_price = model.predict([input_features]); 
    // Return the predicted price as a JSON response
    res.json({ predictedPrice: predicted_price[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during prediction.' });
  }
});

