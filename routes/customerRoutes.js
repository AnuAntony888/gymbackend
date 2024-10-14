const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController"); 
const authenticateToken = require('../middleware/authenticateToken');

// Define routes
router.post("/createCustomer", customerController.createCustomer);
router.get("/getCustomer",authenticateToken, customerController.getAllCustomer);

module.exports = router;