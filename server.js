require("dotenv").config(); // Add this at the top of your server file
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customerRoutes");
const masterRoutes = require('./routes/masterRoutes');
const employeeRoutes = require('./routes/employeeRoutes');



//  const corsOptions = require("./config/cors");
require("./config/createTables"); // Import and execute the table creation script
const app = express();
 const port = 5000;

 app.use('*',cors({
  origin: 'http://localhost:3000', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE','HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
//  app.use(cors(corsOptions));









// app.use('*',cors({
//   origin: 'https://wellfithub.vedahamgroup.com', // Your frontend URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE','HEAD'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// Enable preflight requests for all routes
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/master", masterRoutes);
app.use("/api/employee", employeeRoutes);


// Route for root URL
app.get("/", (req, res) => {
  res.send("welcom");
});

// app.get("/api/master", (req, res) => {

//    res.json({ message: "Welcome to the API!" });
// });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



