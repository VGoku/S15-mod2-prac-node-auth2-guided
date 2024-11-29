const db = require("../../database/db-config"); // Import the database configuration file

module.exports = {
  add, // Function to add a new user
  find, // Function to find all users
  findBy, // Function to find users based on a filter
  findById, // Function to find a user by their ID
};

// Function to retrieve all users along with their roles
function find() {
  return db("users as u") // Start querying the 'users' table, aliasing it as 'u'
    .join("roles as r", "u.role", "=", "r.id") // Join the 'roles' table on the 'role' field in 'users' matching the 'id' in 'roles'
    .select("u.id", "u.username", "r.name as role"); // Select user 'id', 'username', and the 'role' name (from 'roles')
}

// Function to retrieve users based on a filter (e.g., username or password)
function findBy(filter) {
  return db("users as u") // Query the 'users' table
    .join("roles as r", "u.role", "=", "r.id") // Join with the 'roles' table on the 'role' field
    .select("u.id", "u.username", "r.name as role", "u.password") // Select 'id', 'username', 'role', and 'password'
    .where(filter); // Apply the filter (e.g., `{ username: 'user1' }`)
}

// Function to add a new user to the database
async function add(user) {
  // Insert the new user into the 'users' table and get the inserted id
  const [id] = await db("users").insert(user); 
  return findById(id); // After inserting, return the user by ID (with their role)
}

// Function to find a user by their ID
function findById(id) {
  return db("users as u") // Query the 'users' table
    .join("roles as r", "u.role", "=", "r.id") // Join with the 'roles' table on the 'role' field
    .select("u.id", "u.username", "r.name as role") // Select 'id', 'username', and 'role'
    .where("u.id", id) // Filter by the user's ID
    .first(); // Return the first match (since IDs are unique)
}
