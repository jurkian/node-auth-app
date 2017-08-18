// Packages
let express = require('express');
let app = express();

let bodyParser = require('body-parser');
let morgan = require('morgan');

let jwt = require('jsonwebtoken');
let config = require('./config');
let Users = require('./app/models/users');

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
let apiRoutes = express.Router();

// Route: authenticate a user
apiRoutes.post('/authenticate', (req, res) => {
   
   if (Users.name !== req.body.name) {
      res.json({
         success: false,
         message: 'Authentication failed. User not found.'
      });

   } else {
      
      // Check if password matches
      if (Users.password !== req.body.password) {
         res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
         });

      } else {

         // User is found and password is right
         // Create a token
         let token = jwt.sign(Users, app.get('superSecret'), {
            expiresIn: '1 day'
         });

         // Return informations, including token as JSON
         res.json({
            success: true,
            message: 'Here is your token!',
            token
         })
      }
   }
});

// Route middleware to verify a token
apiRoutes.use((req, res, next) => {

   // Check header, url parameters or post parameters for token
   let token = req.body.token || req.query.token || req.headers['x-access-token'];

   // Decode token
   if (token) {

      // Verify secret
      jwt.verify(token, app.get('superSecret'), (err, decoded) => {
         if (err) {
            return res.json({
               success: false,
               message: 'Failed to authenticate token.'
            });

         } else {
            // If everything is fine, save to request for later use in other routes
            req.decoded = decoded;
            next();
         }
      });

   } else {
      // If there is no token, return error
      return res.status(403).send({
         success: false,
         message: 'No token provided.'
      });
   }
});

// Route: random message
apiRoutes.get('/', (req, res) => {
   res.json({ message: 'Welcome to the coolest API on earth!' });
});

// Route: return all users
apiRoutes.get('/users', (req, res) => {
   res.json(Users);
});

// Apply the routes to our app with prefix /api
app.use('/api', apiRoutes);

app.listen(port);
console.log(`Magic happens at http://localhost:${port}`);