const router = require("express").Router(); // Import Express router to define API routes
const User = require("./users-model.js"); // Import the User model to interact with the database
const { restricted, checkRole } = require('../auth/auth-middleware'); // Import middlewares for security checks

// Route to get all users, accessible only by admin users
router.get("/", restricted, checkRole("admin"), (req, res, next) => {
  // 'restricted' middleware ensures the user is authenticated
  // 'checkRole("admin")' middleware ensures the user has an 'admin' role

  User.find() // Fetch all users from the database using the 'find' method from the User model
    .then(users => {
      res.json(users); // Return the list of users in the response
    })
    .catch(next); // Pass any errors to the custom error handler (defined in server.js)
});

// Export the router to be used in the main server file
module.exports = router;
