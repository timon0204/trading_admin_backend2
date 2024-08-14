const bcrypt = require('bcrypt');
const { where } = require('sequelize');
const axios = require('axios');
const { tradeAPI } = require("../config/main");

const { Account, Company, Plan, Customer } = require("../models");
const logger = require('../utils/logger');

exports.updateAccount = async (req, res) => {
    try {
        const { displayName, balance } = req.body;
        const account = await Account.findOne({ where: { displayName } });
        await Account.update({ balance: balance }, { where: { displayName } });

        ///////////////////////**************Start Check Account With Plan****************///////////////////////////////
        if (account.dayStartEquity - balance > account.dailyDrawdown) {
            await axios.post(`${tradeAPI}/blockUser`, { email: account.displayName });
            await Account.update({ breached: true, breachedReason: "DailyDrawdown" }, { where: { displayName } });
        }
        if (balance < account.totalDrawdown) {
            await axios.post(`${tradeAPI}/blockUser`, { email: account.displayName });
            await Account.update({ breached: true, breachedReason: "TotalDrawdown" }, { where: { displayName } });
        }
        if (balance > account.totalTarget) {
            await axios.post(`${tradeAPI}/blockUser`, { email: account.displayName });
            await Account.update({ breached: true, breachedReason: "TotalGoal" }, { where: { displayName } });
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

exports.getMT4Account = async (req, res) => {
    try {
        logger("info", "APIController | GetMT4Account | ", req.body);
        const { mail, accountNumber, accountBalance, accountEquity, drawdown, chartStartDate } = req.body;

        if (!mail || !accountNumber || !accountBalance || !accountEquity || !drawdown || !chartStartDate) {
            return res.status(400).send('Missing required fields');
        }
        const customer = await Customer.findOne({where : {email : mail}});
        const account = await Account.findOne({where : {displayName : accountNumber, customerEmail: mail}});
        if(account && customer) {
            await Account.update({
                balance: accountBalance,
                currentEquity: accountEquity,
                currentDrawdown: drawdown
            }, {where: {displayName: accountNumber}});
        } else {
            res.status(500).send('Invalid account');
        }

        ///////////////////////**************Start Check Account With Plan****************///////////////////////////////
        if (account.dayStartEquity - balance > account.dailyDrawdown) {
            await Account.update({ breached: true, breachedReason: "DailyDrawdown" }, { where: { displayName } });
        }
        if (accountEquity < account.totalDrawdown) {
            await Account.update({ breached: true, breachedReason: "TotalDrawdown" }, { where: { displayName: accountNumber } });
        }
        if (accountEquity > account.totalTarget) {
            await Account.update({ breached: true, breachedReason: "TotalGoal" }, { where: { displayName } });
        }
        ///////////////////////***************End Check Account With Plan*****************///////////////////////////////

    } catch (error) {
        return res.status(500).send(`GetMt4Account Failed with Error | ${error.message}`);
    }

}