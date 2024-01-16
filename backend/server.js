const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Import the path module
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

// Connect to MongoDB
mongoose.connect('mongodb+srv://@vegetable-market-log.ixa5dvw.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("connection successful")
}).catch((e) => {
  console.log("no connection")
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

// Handle user registration
app.get("/", (req, res) => {
  res.render("login")
});

app.get("/register", (req, res) => {
  res.render("register")
});

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
app.get("/login", (req, res) => {
  res.render("login")
});

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

app.get("/about", (req, res) => {
  res.render("about")
});

app.get("/payment", (req, res) => {
  res.render("payment")
});

// Middleware for serving static files and JSON body parsing
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// Serve your HTML files
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Add a route to handle predictions
app.post('/predict', (req, res) => {
  // Read the trained model from JSON
  fs.readFile('trained_model.json', 'utf8', (err, modelData) => {
    if (err) {
      console.error(`Error reading trained_model.json: ${err}`);
      res.status(500).json({ error: 'An error occurred while loading the model.' });
    } else {
      const model = JSON.parse(modelData);
      
      // Prepare input data for prediction
      const inputVegetable = req.body.vegetableName;
      const inputColumns = model.columns;
      const inputData = {};
      for (const column of inputColumns) {
        inputData[column] = column === `Commodity_${inputVegetable}` ? 1 : 0;
      }
      
      // Predict the price
      const predictedPrice = model.intercept_ + model.coef_.reduce((acc, coef, i) => acc + coef * inputData[inputColumns[i]], 0);
      
      res.json({ predictedPrice });
    }
  });
});

// Add a route to fetch vegetable names from dataset.json
app.get('/vegetables', (req, res) => {
  fs.readFile('dataset.json', 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading dataset.json: ${err}`);
      res.status(500).json({ error: 'An error occurred while fetching vegetable names.' });
    } else {
      const vegetables = JSON.parse(data).map(entry => ({ name: entry.Commodity }));
      console.log(vegetables);
      res.json({ vegetables });
    }
  });
});

// Start the server
app.listen(3005, () => {
  console.log('Server is running on port 3005');
});
