// Importing required dependencies
const path = require('path') // Node.js module to work with file and directory paths
const express = require('express') // Express framework for building web applications
const cors = require('cors') // Middleware for enabling Cross-Origin Resource Sharing (CORS)

const authRouter = require('./auth/auth-router.js') // Importing router for authentication-related routes
const usersRouter = require('./users/users-router.js') // Importing router for users-related routes

// Initialize the Express server
const server = express()

// Middleware setup
server.use(express.static(path.join(__dirname, '../client'))) // Serve static files (e.g., HTML, CSS, JS) from the 'client' folder
server.use(express.json()) // Middleware to parse JSON bodies in incoming requests
server.use(cors()) // Enable CORS, allowing cross-origin requests

// Routing setup
server.use('/api/auth', authRouter) // Handle routes related to authentication under '/api/auth'
server.use('/api/users', usersRouter) // Handle routes related to users under '/api/users'

// Route for serving the index.html file at the root URL ('/')
server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html')) // Serve the 'index.html' file from the client directory
})

// Error handling middleware
server.use((err, req, res, next) => { // eslint-disable-line
  // If an error occurs, respond with a status code and JSON object containing error details
  res.status(err.status || 500).json({
    message: err.message, // The error message
    stack: err.stack, // The stack trace of the error (for debugging)
  })
})

// Export the server module for use in other parts of the application
module.exports = server
