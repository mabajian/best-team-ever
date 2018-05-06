const jwt = require("jsonwebtoken");
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');     

// use this library to interface with SQLite databases: https://github.com/mapbox/node-sqlite3
const db = new sqlite3.Database('rest_api/database/users.db');


/**
 * Helper function for generating JWT token based on useranme
 *
 * @param {username} username to put in token; used for authentication; REQUIRED
 * @param {account_id} id to put in token; used for finding account; REQUIRED
 * @param {profile_id} used for finding profile; OPTIONAL
 * @param {password} used for resetting password; OPTIONAL
 *
 * @return JWT token
 */
function getToken(username, account_id, profile_id, password)
{
  const token = { username: username, account_id: account_id };
  
  // add profile_id and/or password to token if not undefined
  (profile_id == undefined)? {} : token.profile_id = profile_id;
  (password == undefined)? {} : token.password = password;


  return jwt.sign(token, "secret key lel", { expiresIn: "1h" } );
}

/**
 * GET list of all of user's profile. Must be logged in.
 * If logged in, find the with requested name. 
 *
 * Route signature: GET /profiles
 * Example call: localhost:3000/profiles
 * Expected: token
 *
 * @return 1) error 500 if error occured while searching for profile. Otherwise
 *         2) array of profiles if found or 
 *         3) error 404 (Not Found) if no profiles
 */
exports.getAllProfiles = (req, res) =>
{
  console.log("GET ALL PROFILES");
  const username = req.userData.username;


  db.all(
    'SELECT profiles.id, firstname, lastname, isDefault FROM accounts, \
     profiles WHERE username=$username AND profiles.account_id = accounts.id',
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
        console.log(rows);
        console.log('---');
        (rows.length > 0)?
          res.status(200).json(rows) :
          res.status(404).json( {error: '\"'+username+'\" doesn\'t have any profiles'} );
      } 
    } // end of (err, rows) => {}
  ); // end of db.all(..)

} // end of getAllProfiles()


/**
 * Creates new profile for the requested account. Must be logged in.
 * 
 * Route signature: POST /profiles/new
 * Example call: localhost:3000/profiles/new
 * Expected: token, body {username, profilename, firstName, lastName, gender, dob}
 *
 * @return 1) error 500 if error occured while creating profile. Otherwise
 *         2) created profile and new token 
 */
exports.newProfile = (req, res) => 
{
  console.log("CREATE NEW PROFILE");
  console.log(req.body);

  db.run(
    `INSERT INTO profiles (profilename, firstName, lastName, dob, gender, isDefault, account_id) \
     VALUES ($profilename, $firstName, $lastName, $dob, $gender, $isDefault, $account_id)`,
    {
      $profilename: req.body.profilename.toLowerCase(),
      $firstName: req.body.firstName,
      $lastName: req.body.lastName,
      $dob: req.body.dob,
      $gender: req.body.gender,
      $isDefault: 0,
      $account_id: req.userData.account_id
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
        // find id of the newly created profile
        console.warn("inserted id:", this.lastID);


        req.body.account_id = req.userData.account_id;
        res.status(201).json( {message: "Profile Created", profile: req.body} );
      }
    }
  ); //end of db.run(`INSERT..`) for creating profile 

} // end of newProfile()


/**
 * GET profile data for an account. Must be logged in.
 * If logged in, find the with requested name. 
 *
 * Route signature: GET /profiles/:profilename/:profile_id
 * Example call: localhost:3000/profiles/JohnnyTest/2
 * Expected: token
 *
 * @return 1) error 500 if error occured while searching for profile. Otherwise
 *         2) profile information if found or 
 *         3) error 404 (Not Found) if profile not found
 */
exports.getProfile = (req, res) =>
{
  console.log("GET PROFILE")
  const username = req.userData.username;
  const profilename = req.params.profilename.toLowerCase();
  const profile_id = req.params.profile_id;
  const account_id = req.userData.account_id;

  db.get(
    `SELECT profiles.id, firstname, lastname, gender, dob, account_id FROM accounts, 
     profiles WHERE profilename=$profilename
     AND profiles.id = $profile_id  
     AND accounts.id = $account_id`,
    {
      $profilename: profilename,
      $profile_id: profile_id,
      $account_id: account_id
    },
    // callback function to run when the query finishes:
    (err, row) => 
    {
      if (err)
      {
        console.log(err);
        res.status(500).json( {error: err} );
      }
      else 
      {
        console.log('profile: ',row);
        console.log('---');
        if (row) //found profile
        {
          row.token = getToken(username, account_id, profile_id);
          res.status(200).json(row);
        }
        else
        {
          const name_id = '\"'+profilename+'\" (id: '+profile_id+')';
          res.status(404).json( {error: name_id + ' does not exist'} );
        }
      }

    } // end of (err, row) =>
  ); // end of db.get(..)

} // end of getProfile()

