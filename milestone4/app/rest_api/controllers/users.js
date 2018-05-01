const jwt = require("jsonwebtoken");
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');     

// use this library to interface with SQLite databases: https://github.com/mapbox/node-sqlite3
const db = new sqlite3.Database('rest_api/database/users.db');


function getToken(username)
{
  const token = jwt.sign(
  {
    username: username
  }, "secret key lel", { expiresIn: "1h" } );
  return token;
}

// GET a list of all usernames
//
// To test, open this URL in your browser:
//   http://localhost:3000/users
exports.getAllUsers = (req, res) => 
{
  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all('SELECT username FROM users', (err, rows) => {
    const allUsernames = rows.map(e => e.username);
    console.log(allUsernames);
    res.send(allUsernames);
  });

}

exports.signup = (req, res) =>
{
  console.log('signup');

  const username = req.body.username;
  const email = req.body.email;
  
  db.all(
    'SELECT * FROM users WHERE username=$username OR email=$email',
    {
      $username: username,
      $email: email
    },
    // callback function to run when the query finishes:
    (err, rows) => 
    {
      if (err)
      {
        console.log(err);
        res.status(500).json( {error: err} );
      }
      else
      {
        console.log('Username and/or email already exists: ',rows.length != 0);
        if (rows.length == 0) //valid username and email
        {
          //attempt to hash password
          bcrypt.hash(req.body.password, 10, (err, hash) =>
          {
            if (!err) //successful hash; store hashed password
            {
              const password = hash;
              db.run(
                "INSERT INTO users (username, password, email) \
                 VALUES ($username, $password, $email)",
                {
                  $username: req.body.username,
                  $password: password,
                  $email: req.body.email,
                },
                // callback function to run when the query finishes:
                (err) => 
                {
                  if (err) 
                  {
                    console.log(err);
                    res.status(500).json( {error: err} );
                  } 
                  else 
                  {
                    const token = getToken(username);
                    res.status(201).json( {message: "user created", token: token} );
                  }
                }
              );  

            } //end of !err
            else
            {
              return res.status(500).json( {error: err} );
            }
          }); //end of hash
        }
        else //username or email taken
        {
          res.status(409).json( {error: 'username and/or email already exists'} );
        }
      }
    }
  ); //end of db.all()
}// end of sign up


exports.login = (req, res) =>
{
  console.log('login');

  const username = req.body.username;
  const password = req.body.password;

  db.all(
    'SELECT * FROM users WHERE username=$username',
    {
      $username: username
    },
    // callback function to run when the query finishes:
    (err, rows) => 
    {
      if (err)
      {
        console.log(err);
        res.status(500).json( {error: err} );
      }
      else
      {
        if (rows != 0) //found user
        {
          //check if password is correct
          bcrypt.compare(password, rows[0].password, (err, result) =>
          {
            if (err || !result)
            {
              console.log("Incorrect password")
              res.status(401).json( {error: "incorrect password"} );
            }
            if (result)
            {
              console.log("Log in successful");
              const token = getToken(username);
              res.status(200).json( {message: "Logged in", token: token} );
            }

          });
        }
        else //user not found; doesn't exist or incorrect username
        {
          res.status(404).json( {error: '\"'+username+'\" does not exist'} );
        }
      }
    } //end of (err, row) callback
  ); //end of db.all()
} //end of login


exports.getUserInfo = (req, res) =>
{
  console.log("getUserInfo");
  const username = req.params.username;
  console.log('request for: '+username+'; token valid for: '+req.userData.username);

  //Check to make sure that token actually corersponds to the requested 
  //username. If logged previously as another and token is still valid,
  //check to make sure that data on token matches the request's username
  //Essentially, you should only be able to view own your account.
  if (req.userData.username === req.params.username)
  {
    db.all(
      'SELECT * FROM users WHERE username=$username',
      {
        $username: username
      },
      // callback function to run when the query finishes:
      (err, rows) => 
      {
        if (rows.length > 0) 
        {
          console.log(rows[0]);
          console.log('---');
          res.status(200).json(rows[0]);
        } 
        else 
        {
          res.status(404).json( {error: '\"'+username+'\" does not exist'} );
        }
      });
  }
  else
  {
    console.log('Token and requested username does not match\n---')
    res.status(401).json( {error: 'please log in again'} );
  }
}



exports.getAllProfiles = (req, res) =>
{
  console.log("GET ALL PROFILES");
  const username = req.params.username;

  console.log('request for: '+username+'; token valid for: '+req.userData.username);
  if (req.userData.username === req.params.username)
  {
    db.all(
      'SELECT firstname, lastname, isDefault FROM users, profiles WHERE username=$username AND profiles.userid = users.userid',
      {
        $username: username
      },
      // callback function to run when the query finishes:
      (err, rows) => {
        console.log(rows);
        console.log('---');
        if (rows.length > 0) 
        {
          res.status(200).json(rows);
        }
        else 
        {
          res.status(404).json( {error: '\"'+username+'\" does not exist'} );
        }
      });
  }
  else
  {
    console.log('Token and requested username does not match\n---')
    res.status(401).json( {error: 'please log in again'} );
  }


}

// GET profile data for a user
//
// To test, open these URLs in your browser:
//   http://localhost:3000/users/Philip
//   http://localhost:3000/users/Carol
//   http://localhost:3000/users/invalidusername
exports.getProfile = (req, res) =>
{
  console.log("GET PROFILE")
  const username = req.params.username;
  const profilename = req.params.profilename;

  console.log('request for: '+username+'; token valid for: '+req.userData.username);
  if (req.userData.username === req.params.username)
  {
    db.all(
      'SELECT firstname, lastname, isDefault FROM users, \
       profiles WHERE firstname=$profilename AND profiles.userId = users.userId',
      {
        $profilename: profilename
      },
      // callback function to run when the query finishes:
      (err, rows) => 
      {
        if (err)
        {
          console.log(err);
          res.status(500).json( {error: err} );
        }
        else
        {
          console.log(rows+'\n---');
          (rows.length > 0)? res.status(200).json(rows[0]) :
                             res.status(404).json( 
                              {error: '\"'+profilename+'\" does not exist'} )
        }
      });
  }
  else
  {
    console.log('Token and requested username does not match\n---')
    res.status(401).json( {error: 'please log in again'} );
  }

};


exports.testauth = (req, res, next) =>
{
  console.log("in test auth function")
  console.log(req.userData);
  res.send(req.userData);
}
