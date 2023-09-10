const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Import the path module

const app = express();

const bodyParser = require('body-parser');

const { exec } = require('child_process');
const fs = require('fs');

// Connect to MongoDB
mongoose.connect('mongodb+srv://anshikukreti26:130519Mk@vegetable-market-log.ixa5dvw.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("connection successfull")
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
  // ... (existing code for registration)
});

// Handle user login
app.get("/login", (req, res) => {
  res.render("login")
});

app.post('/login', async (req, res) => {
  // ... (existing code for login)
});

app.get("/about", (req, res) => {
  res.render("about")
});

app.get("/payment", (req, res) => {
  res.render("payment")
});

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

// Add a route to handle predictions
app.post('/predict', (req, res) => {
  // ... (existing code for predictions)
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
