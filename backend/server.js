const express = require('express');
const mongoose = require('mongoose');

const path=require("node:path/posix")
const app = express();

const bodyParser = require('body-parser');

const { exec } = require('child_process');
const fs = require('fs');


// Connect to MongoDB
mongoose.connect('mongodb+srv://anshikukreti26:130519Mk@vegetable-market-log.ixa5dvw.mongodb.net/?retryWrites=true&w=majority', {
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



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.use(bodyParser.json()); // Parse JSON request body

// Serve your HTML files
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Add a route to handle predictions
app.post('/predict', (req, res) => {
  try {
    const vegetable_name = req.body.vegetable;

    // Use the child_process module to run the Python script
    const pythonScript = 'MachineLearning.py'; // Modify this to your Python script name
    const command = `python ${pythonScript} "${vegetable_name}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error}`);
        res.status(500).json({ error: 'An error occurred during prediction.' });
      } else {
        const predicted_price = parseFloat(stdout.trim());
        res.json({ predictedPrice: predicted_price });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during prediction.' });
  }
});

app.use(bodyParser.json()); // Parse JSON request body

// Serve your HTML files
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Add a route to fetch vegetable names from dataset.json
app.get('/vegetables', (req, res) => {
  fs.readFile('dataset.json', 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading dataset.json: ${err}`);
      res.status(500).json({ error: 'An error occurred while fetching vegetable names.' });
    } else {
      const vegetables = JSON.parse(data).map(entry => ({ name: entry.Commodity }));
      res.json({ vegetables });
    }
  });
});
