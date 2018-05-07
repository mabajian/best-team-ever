const jwt = require("jsonwebtoken");
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');     

// use this library to interface with SQLite databases: https://github.com/mapbox/node-sqlite3
const db = new sqlite3.Database('rest_api/database/users.db');

/**
 * GET a list of all medicine for a profile. Find medicine belonging to the
 * correct profile by checking account_id and profile_id.
 *
 * Route signature: GET /medicine
 * Example call: localhost:3000/medicine
 * Expected: token
 *
 * @return 1) erorr 500 if error occured while searching for medicine. Otherwise
 *            -> {keys -> error}
 *         2) array of all of profile's medicine if any exists, or 
 *            -> [ list of all medicine ]
 *         3) error 404 (Not Found) if none exists
 *            -> {keys -> error}
 */
exports.getAllMedicine = (req, res) => 
{
  console.log('GET ALL MEDICINE')

  db.all(
    `SELECT * FROM medicine 
     WHERE account_id=$account_id 
     AND   profile_id=$profile_id`,
    {
      $account_id: req.userData.account_id,
      $profile_id: req.userData.profile_id
    }, 
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
          res.status(404).json( {error: 'Profile doesn\'t have any medicine'} );
      }
    }
  ); // end of db.all(...)

} // end of getAllMedicine()




/**
 * Creates new medicine for the requested profile. Must be logged in.
 * 
 * Route signature: POST /medicine/new
 * Example call: localhost:3000/medicine/new
 * Expected: token, body {medicinename, dosage, num_pills, recurrence_hour,
                          times_per_day, start_date, start_time, end_date,
                          end_time, med_type, med_color}
 *
 * @return 1) error 500 if error occured while creating medicine. Otherwise
 *            -> {keys -> error}
 *         2) message saying medicine has been created 
 *            -> {keys -> message}
 */
exports.newMedicine = (req, res) => 
{
  console.log("CREATE NEW MEDICINE");
  console.log('medicine to create:\n', req.body, '\n');

  db.run(
    `INSERT INTO medicine
     VALUES ($id, $medicinename, $dosage, $num_pills, $recurrence_hour, 
             $times_per_day, $start_date, $start_time, $end_date, 
             $end_time, $med_type, $med_color, $account_id, $profile_id)`,
    {
      $id : null,
      $medicinename : req.body.medicinename,
      $dosage : req.body.dosage,
      $num_pills : req.body.num_pills,
      $recurrence_hour : req.body.recurrence_hour,
      $times_per_day : req.body.times_per_day,
      $start_date : req.body.start_date,
      $start_time : req.body.start_time,
      $end_date : req.body.end_date,
      $end_time : req.body.end_time,
      $med_type : req.body.med_type,
      $med_color : req.body.med_color,
      $account_id : req.userData.account_id,
      $profile_id : req.userData.profile_id
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
        console.log('Medicine created\n---');
        res.status(201).json( {message: 'Medicine created'} );
      }
    } // end of (err) =>
  ); // end of db.run(`INSERT..`) for creating medicine 

} // end of newMedicine()



/**
 * GET medicine data for profile. Must be logged in.
 * If logged in, find the with requested profile name and account name
 *
 * Route signature: GET /medicine/:medicinename/:medicine_id
 * Example call: localhost:3000/medicine/vitaminC/2
 * Expected: token
 *
 * @return 1) error 500 if error occured while searching for medicine. Otherwise
 *            -> {keys -> error}
 *         2) medicine information if found or 
 *            -> {keys -> id, medicinename, dosage, num_pills, recurrence_hour,
 *                        times_per_day, start_date, start_time, end_date,
 *                        end_time, med_type, med_color, account_id, profile_id}
 *         3) error 404 (Not Found) if medicine not found
 *            -> {keys -> error}
 */
exports.getMedicine = (req, res) => 
{
  console.log('GET MEDICINE');

  db.get(
    `SELECT * FROM medicine 
     WHERE id=$medicine_id 
     AND   medicinename=$medicinename
     AND   account_id=$account_id
     AND   profile_id=$profile_id`, 
    {
      $medicine_id: req.params.medicine_id,
      $medicinename: req.params.medicinename,
      $account_id: req.userData.account_id,
      $profile_id: req.userData.profile_id
    },
    (err, row) => 
    {
      if (err)
      {
        console.log(err);
        res.status(500).json( {error: err} );
      }
      else
      {
        console.log('medicine: ',row);
        console.log('---');
        if (row) //found profile
        {
          res.status(200).json(row);
        }
        else
        {
          const name_id = '\"'+req.params.medicinename+'\" \
                          (id: '+req.params.medicine_id+')';
          res.status(404).json( {error: name_id + ' does not exist'} );
        }
      }
    }
  );

} // end of getMedicine()





/**
 *
 */
exports.editMedicine = (req, res) => 
{
  const id = req.params.medicine_id;

  // to update, need to do `UPDATE medicine SET column='value', col2='value'`
  // 'str' iterates through all of the requested columns to be edited and
  // makes string for the `column='value', column2='value'`
  let str = ``;
  for (const e in req.body)
  {
    str += e+`='`+req.body[[e]]+`', `;
  }
  str = str.substring(0, str.length-2); // remove the final comma from string

  let query = `UPDATE medicine SET `+str+` WHERE id=?`;
  db.all(query, [id], (err, rows) =>
  {
    if (err)
    {
      console.log(err);
      res.status(500).json( {error: err} );
    }
    else
    {
      // find the edited medicine and return it
      db.get(
        `SELECT * FROM medicine WHERE id=?`, [id], (err, row) =>
        {
          console.log('edited medicine: ', row);
          res.status(200).json( row );
        }
      ); // end of db.get(...)
    }

  }); // end of db.all(..) for editing

  


} 

