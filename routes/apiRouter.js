const express = require('express');
const router = express.Router();
const apiController = require("../control/apiController");
const { thirdPartymiddleware } = require('../middleware/thirdPartymiddleware');
const userRouter = require("./userRouter")

const app = express();

router.post("/updateAccount", thirdPartymiddleware, apiController.updateAccount);
router.post("/getData", apiController.getMT4Account)

router.use("/users", userRouter )

module.exports = router;