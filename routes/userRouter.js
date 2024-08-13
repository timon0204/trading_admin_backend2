const express = require('express');
const router = express.Router();
const { usermiddleware } = require('../middleware/usermiddleware');
const userController = require("../control/userController")

const app = express();

router.post("/auth", userController.login);

router.get("/getAccounts", usermiddleware, userController.getAccounts)
router.post("/getProfit", usermiddleware, userController.getProfit)
router.post("/updatePassword", usermiddleware, userController.updatePassword)

module.exports = router;