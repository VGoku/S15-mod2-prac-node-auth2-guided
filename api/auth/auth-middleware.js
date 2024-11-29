// Importing the jsonwebtoken library
const jwt = require('jsonwebtoken') // npm install

// Importing the JWT_SECRET from the config file
const { JWT_SECRET } = require('../../config')

// AUTHENTICATION MIDDLEWARE
const restricted = (req, res, next) => {
  // Getting the token from the Authorization header
  const token = req.headers.authorization

  // If the token exists, verify it
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        // If there's an error verifying the token, send a 401 Unauthorized response
        next({ status: 401, message: "You can't touch this!" })
      } else {
        // If the token is valid, attach the decoded token to the request object
        req.decodedJwt = decodedToken
        console.log('decoded token', req.decodedJwt)

        // Proceed to the next middleware or route handler
        next()
      }
    })
  } else {
    // If there's no token, send a 401 Unauthorized response
    next({ status: 401, message: 'You shall not pass!' })
  }
}

// AUTHORIZATION MIDDLEWARE
const checkRole = role => (req, res, next) => {
  // Ensure the role property is present in the token's payload and matches the required role
  if (req.decodedJwt.role && req.decodedJwt.role === role) {
    // If the roles match, proceed to the next middleware or route handler
    next()
  } else {
    // If the roles don't match, send a 403 Forbidden response
    next({ status: 403, message: "You have no power here!" })
  }
}

// Exporting the authentication and authorization middleware functions
module.exports = {
  restricted,
  checkRole,
}
