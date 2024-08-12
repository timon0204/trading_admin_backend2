const bcrypt = require('bcrypt');
const { where } = require('sequelize');
const axios = require('axios');
const { tradeAPI } = require("../config/main");

const { Account, Company, Plan, Customer } = require("../models");
const logger = require('../utils/logger');

exports.updateAccount = async (req, res) => {
    try {
        const { displayName, balance } = req.body;
        await Account.update({ currentEquity: balance }, { where: { displayName } });
        const account = await Account.findOne({ where: { displayName } });

        ///////////////////////**************Start Check Account With Plan****************///////////////////////////////
        if (balance < account.totalDrawdown) {
            await axios.post(`${tradeAPI}/blockUser`, { email: account.displayName });
            await Account.update({ breached: true, breachedReason: "TotalDrawdown" }, { where: { displayName } });
        }
        if (balance > account.totalTarget) {
            await axios.post(`${tradeAPI}/blockUser`, { email: account.displayName });
            await Account.update({ breached: true, breachedReason: "TotalGoal" }, { where: { displayName } });
        }
        if (account.dayStartEquity - balance > account.dailyDrawdown) {
            await axios.post(`${tradeAPI}/blockUser`, { email: account.displayName });
            await Account.update({ breached: true, breachedReason: "DailyDrawdown" }, { where: { displayName } });
        }
        ///////////////////////***************End Check Account With Plan*****************///////////////////////////////
        return res.status(200).json({ account });
    } catch (error) {
        logger("error", "APIController | updateAccount | ", error.message);
        return res.status(500).json({
            status: false,
            message: `Update Account Failed : ${error.message}`
        });
    }
}
