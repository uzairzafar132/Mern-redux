const asyncHandler = require('express-async-handler');
const generateToken =require('../utils/generateToken');
const pool = require("../db")
const bcrypt = require('bcrypt');


// const userCredentials=req.body;
// console.log(userCredentials.email)
//     try{
//    const todos = await pool.query('SELECT * FROM todos WHERE user_email = $1',[userCredentials.email])
//    console.log(todos.rows)
//     res.json(todos.rows)
// }catch(err){
//     console.error(err)
// }

const createUsersTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);
    console.log('Users table created successfully');
  } catch (err) {
    console.error('Error creating users table:', err);
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const userCredentials = req.body;

  const userEmail = userCredentials.email;
  const userPassword = userCredentials.password;

  try {
    const doesUserExist = await userExists(userEmail);

    if (!doesUserExist) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = await pool.query('SELECT * FROM users WHERE email = $1', [userEmail]);
    const passwordMatch = await bcrypt.compare(userPassword, user.rows[0].password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    const userData = {
      id: user.rows[0].id,
      name: user.rows[0].name,
      email: user.rows[0].email,
    };

    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const userExists = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows.length > 0;
};

const registerUser = asyncHandler(async (req, res) => { 
  const { name, email, password } = req.body;

  try {
    // Create the users table if it doesn't exist
    await createUsersTable();
    const doesUserExist = await userExists(email);

    if (doesUserExist) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user data into the users table
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );
  

    const newUser = result.rows[0];
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  // Implementation for user logout
  res.status(200).json({ message: 'User logged out successfully' });
});

const getUserProfile = asyncHandler(async (req, res) => {
  // Implementation for getting user profile
  res.status(200).json({ message: 'User profile fetched successfully' });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  // Implementation for updating user profile
  res.status(200).json({ message: 'User profile updated successfully' });
});

module.exports = {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
