// run this once to create the initial database as the users.db file
//   node create_database.js

// to clear the database, simply delete the users.db file:
//   rm users.db

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('users.db');
// run each database statement *serially* one after another
// (if you don't do this, then all statements will run in parallel,
//  which we don't want)
/*

users
--------------------------------------------------------------------------------------------------------
user-id (NUM) * primary key AUTOINCREMENT | username (TEXT) | password (TEXT) | email (TEXT) | DOB (date)


UserProfiles
---------------------------------------------------------------------------------------------------------------------------------------------------------
profile-id (NUM) * primary key AUTOINCREMENT | Firstname (TEXT) | lastname (TEXT) | DOB (date) | Gender (TEXT) | isDefault (Bool) *  integer 0 (false) and 1 (true). | user-id (FOREIGN KEY)

*/
db.serialize(() => {

  //----------------------------------------------------------------
  //account table

  // create a new database table:
  db.run(
    `CREATE TABLE accounts 
    ( 
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      username TEXT,  
      password TEXT,  
      email TEXT 
    )`
  );
  // insert 3 rows of data: 
  const hashedPassword = '$2a$10$HCwBZYmiL.ukBvVakPtJ6urHm/s7AXszpZRYsHZ.ppD5f8.U0/1Gy';
  db.run("INSERT INTO accounts (username, password, email) VALUES ( 'user1', '"+hashedPassword+"', 'user1@gmail.com')");
  db.run("INSERT INTO accounts (username, password, email) VALUES ( 'user2', '"+hashedPassword+"', 'user2@gmail.com')");
  db.run("INSERT INTO accounts (username, password, email) VALUES ( 'user3', '"+hashedPassword+"', 'user3@gmail.com')");


  console.log('successfully created the users table in users.db');
  console.log('------------------------------------------------');
  console.log('| user name | password |');
  console.log('------------------------------------------------');
  // print them out to confirm their contents:
  db.each("SELECT id, username, password FROM accounts", (err, row) => {
    console.log(row);
  });

  //-----------------------------------------------------------------------
  //profile table
  db.run(
    `CREATE TABLE profiles 
    ( 
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      profilename TEXT,
      firstName TEXT, 
      lastName TEXT, 
      dob TEXT, 
      gender TEXT, 
      isDefault INTERGER, 
      account_id INTEGER, 
      FOREIGN KEY(account_id) REFERENCES accounts(id) 
    )`
  );

  db.run("INSERT INTO profiles (profilename, firstName, lastName, dob, gender, isDefault, account_id ) VALUES ( 'liamsmith', 'Liam', 'Smith', '02/21/1987', 'male', 1, 2)");
  db.run("INSERT INTO profiles (profilename, firstName, lastName, dob, gender, isDefault, account_id ) VALUES ( 'philipjohnson', 'Philip', 'Johnson', '01/17/1980', 'male', 0, 2)");
  db.run("INSERT INTO profiles (profilename, firstName, lastName, dob, gender, isDefault, account_id ) VALUES ( 'jamesbrown', 'James', 'Brown', '08/13/1995', 'male', 0, 1)");
  db.run("INSERT INTO profiles (profilename, firstName, lastName, dob, gender, isDefault, account_id ) VALUES ( 'marymiller', 'Mary', 'Miller', '07/03/1975', 'female', 0, 1)");
  

  db.all("SELECT * FROM profiles", (err, rows) => 
  {
    console.log(rows);
  });

  //-----------------------------------------------------------------------
  //medicine table
  db.run(
    `CREATE TABLE medicine 
    ( 
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      medicinename TEXT,
      account_id INTEGER, 
      profile_id INTEGER,
      FOREIGN KEY(account_id) REFERENCES accounts(id),
      FOREIGN KEY(profile_id) REFERENCES profiles(id)
    )`
  );

  db.run(`INSERT INTO medicine (medicinename, account_id, profile_id) VALUES ('vitaminA', 1, 3)`);
  db.run(`INSERT INTO medicine (medicinename, account_id, profile_id) VALUES ('vitaminC', 1, 3)`);
  db.run(`INSERT INTO medicine (medicinename, account_id, profile_id) VALUES ('NyQuil', 2, 1)`);

  db.all(
    `SELECT * FROM medicine
     WHERE medicine.account_id = 1 AND medicine.profile_id = 3`, (err, rows) =>
  {
    console.log(rows);
  });




});

db.close();
