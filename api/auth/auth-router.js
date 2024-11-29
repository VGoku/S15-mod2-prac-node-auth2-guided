const bcrypt = require('bcryptjs'); // bcrypt is used for hashing passwords
const jwt = require('jsonwebtoken'); // jsonwebtoken is used for generating JWT tokens
const router = require('express').Router(); // express router for handling routes
const User = require('../users/users-model.js'); // User model for interacting with the database

// Destructuring BCRYPT_ROUNDS and JWT_SECRET from the config file
const { BCRYPT_ROUNDS, JWT_SECRET } = require('../../config');

// Register route to handle user registration
router.post('/register', (req, res, next) => {
  let user = req.body; // Get the user data from the request body

  // bcrypt the password before saving it to the database
  const hash = bcrypt.hashSync(user.password, BCRYPT_ROUNDS);

  // Never store plain text password in the database, replace with hashed password
  user.password = hash;

  // Add the new user to the database
  User.add(user)
    .then(saved => {
      // Respond with a success message if the user is saved
      res.status(201).json({ message: `Great to have you, ${saved.username}` });
    })
    .catch(next); // If an error occurs, pass it to the custom error handler
});

// Login route to authenticate users
router.post('/login', (req, res, next) => {
  let { username, password } = req.body; // Extract username and password from the request body

  // Find the user by their username in the database
  User.findBy({ username })
    .then(([user]) => {
      // Check if the user exists and if the password is correct
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user); // Generate a JWT token for the user

        // Send the token to the client as part of the response
        res.status(200).json({
          message: `Welcome back ${user.username}, have a token...`,
          token, // Attach the token to the response
        });
      } else {
        // If credentials are invalid, send an error message
        next({ status: 401, message: 'Invalid Credentials' });
      }
    })
    .catch(next); // Pass any errors to the error handler
});

// Function to generate JWT token
function generateToken(user) {
  const payload = {
    subject: user.id, // User ID as the subject of the token
    username: user.username, // Username as part of the payload
    role: user.role, // User role (could be 'admin', 'user', etc.)
  };
  const options = {
    expiresIn: '1d', // Set the token to expire in 1 day
  };
  // Generate and return the token
  return jwt.sign(payload, JWT_SECRET, options);
}

module.exports = router; // Export the router for use in other files
