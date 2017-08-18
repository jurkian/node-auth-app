// Packages
let express = require('express');
let app = express();

let bodyParser = require('body-parser');
let morgan = require('morgan');

let jwt = require('jsonwebtoken');
let config = require('./config');
let User = require('./app/models/user');

// Setup
let port = process.env.PORT || 8080;
app.set('superSecret', config.secret);

// Use body parses to get info from POST and other parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use morgan to log requests to the console
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
   res.send(`Hello! The API is at http://localhost:${port}/api`);
})

// API routes
// ...

app.listen(port);
console.log(`Magic happens at http://localhost:${port}`);