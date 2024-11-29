
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require("uuid");
const db = require("../utils/db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "e08e19dd47b1ccb6fc50f1edbe10d4a8f5ad19f71fced245553341f2dd432f7e";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "360d";

let tokenBlacklist = []; // In-memory blacklist, use a persistent store in production




exports.signup = async (req, res) => {
  const {
    name,
    email,
    password,
    visibility = 1, // Default visibility to 1
  } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters long" });
  }

  // Check if email already exists
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error("Error checking existing email:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while checking email." });
      }

      if (results.length > 0) {
        // Email exists, check if the details are the same
        const user = results[0];

        if (
          name === user.name &&
          
          visibility === user.visibility
        ) {
          // All details are the same, return an error
          return res.status(400).json({
            error: "User already exists with the same details.",
          });
        } else {
          // Details are different, update the record
          const updateSql = `
            UPDATE users
            SET
              name = ?,
              password = ?,         
              visibility = ?
            WHERE email = ?
          `;
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);

          db.query(
            updateSql,
            [
              name,
              hashedPassword,       
              visibility,
              email,
            ],
            (err, results) => {
              if (err) {
                console.error("Error updating user:", err);
                return res.status(500).json({
                  error: "An error occurred while updating the user.",
                });
              }

              res.json({ message: "User details updated successfully" });
            }
          );
        }
      } else {
        // Email does not exist, create a new user
        try {
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          const user_id = uuidv4();

          db.query(
            "INSERT INTO users (user_id, name, email, password,  visibility) VALUES ( ?, ?, ?, ?, ?)",
            [
              user_id,
              name,
              email,
              hashedPassword,          
              visibility,
            ],
            (err, results) => {
              if (err) {
                console.error("Error inserting user:", err);
                return res
                  .status(500)
                  .send("An error occurred while adding the user.");
              }

              res.json({
                user_id,
                name,
                email,             
                visibility,
              });
            }
          );
        } catch (error) {
          console.error("Error hashing password:", error);
          res.status(500).send("An error occurred while hashing the password.");
        }
      }
    }
  );
};

{/*******login*****************/ }
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Check if user exists with visibility = 1
  db.query(
    "SELECT * FROM users WHERE email = ? AND visibility = 1",
    [email],
    async (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).send("An error occurred while fetching user.");
      }

      // If no user is found with the provided email
      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = results[0];

      try {
        // Compare password with the hashed password in the database
        const match = await bcrypt.compare(password, user.password);

        if (match) {
          // Generate a JWT token
          const token = jwt.sign(
            { id: user.user_id, email: user.email },
            JWT_SECRET, // Ensure JWT_SECRET is set in your environment variables
            { expiresIn: JWT_EXPIRATION } // JWT_EXPIRATION should be set (e.g., '1h', '24h')
          );

          console.log("Generated token:", token); // For debugging purposes

          // Respond with success message and user details
          res.json({
            message: "Login successful",
            token: token,
            userId: user.user_id,
            email: user.email,
            name: user.name,
            Rolles:user.Rolles
          });
        } else {
          // Password mismatch
          res.status(401).json({ error: "Invalid credentials" });
        }
      } catch (error) {
        console.error("Error comparing passwords:", error);
        res.status(500).send("An error occurred while comparing passwords.");
      }
    }
  );
};
{/*************Logout**************** */ }
exports.logout = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    tokenBlacklist.push(token);
    res.json({ message: "Logout successful" });
  } else {
    res.status(400).json({ error: "No token provided" });
  }
};


