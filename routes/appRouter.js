const express = require('express');
const router = express.Router();
const customerController = require("../control/customerController")
const authControl = require("../control/authController");
const accountController = require("../control/accountController");
const companyController = require("../control/companyController")
const { adminmiddleware } = require('../middleware/adminmiddleware');

const app = express();

router.post("/login", authControl.login);

router.post("/createCompany", adminmiddleware, companyController.createCompany)

router.get("/getCustomers", adminmiddleware, customerController.getCustomers);
router.post("/createCustomer", adminmiddleware, customerController.createCustomer);
router.post("/updateCustomer", adminmiddleware, customerController.updateCustomer);
router.post("/deleteCustomer", adminmiddleware, customerController.deleteCustomer);

router.get("/getAccounts", adminmiddleware, accountController.getAccounts);
router.post("/createAccount", adminmiddleware, accountController.createAccout);

module.exports = router;