const express = require("express");
const app = express();

// Variables for linking to route files
const userRoutes = require("./rest_api/routes/users");

app.use(express.static('static_files'));

// Header (don't worry about this)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes to handle requests
// This is all that really matters
// In Guo's server.js file, he gets list of all users and individual user by doing this:
// app.get('/users', (req, res) => { ... });
// app.get('/users/:userid', (req, res) => { ... });
//
// I'm doing the same thing with the code here, except that I send everything with /users 
// to a route file that handles it. The code will be in rest_api/routes/users.js
app.use("/users", userRoutes);


// For error handling (don't worry about this)
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// For error handling (don't worry about this)
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});


// To learn more about server routing:
// Express - Hello world: http://expressjs.com/en/starter/hello-world.html
// Express - basic routing: http://expressjs.com/en/starter/basic-routing.html
// Express - routing: https://expressjs.com/en/guide/routing.html


module.exports = app;
