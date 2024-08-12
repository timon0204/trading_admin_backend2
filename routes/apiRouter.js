const express = require('express');
const router = express.Router();
const apiController = require("../control/apiController");
const { thirdPartymiddleware } = require('../middleware/thirdPartymiddleware');

const app = express();

router.post("/updateAccount", thirdPartymiddleware, apiController.updateAccount);

module.exports = router;