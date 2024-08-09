const express = require('express');
const router = express.Router();
const customerController = require("../control/customerController")
const authControl = require("../control/authController");
const { adminmiddleware } = require('../middleware/adminmiddleware');

const app = express();

router.post("/login", authControl.login);

router.get("/getCustomers", adminmiddleware, customerController.getCustomers);
router.post("/createCustomer", adminmiddleware, customerController.createCustomer);
router.post("/updateCustomer", adminmiddleware, customerController.updateCustomer);
router.post("/deleteCustomer", adminmiddleware, customerController.deleteCustomer);


module.exports = router;