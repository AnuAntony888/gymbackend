const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController"); 


// Define routes
router.post("/createCustomer", customerController.createCustomer);

module.exports = router;