const bcrypt = require('bcrypt');
const { where } = require('sequelize');
const axios = require('axios');
const { tradeAPI } = require("../config/main");
const { Account, Company, Plan, Customer } = require("../models");
const logger = require('../utils/logger');

exports.createAccount = async (req, res) => {
    try {
        const token = req.headers.authorization || "";
        const company = await Company.findOne({ where: { token } });
        if (!company) {
            return res.status(401).json({
                status: false,
                message: "Invalid authorization token."
            });
        }
        console.log("this is the req", req.body)
        const { customerEmail, planName, tradeSystem } = req.body;
        const customer = await Customer.findOne({ where: { email: customerEmail } });
        if (!customer) {
            return res.status(404).json({
                status: false,
                message: "Customer not found."
            });
        }

        const plan = await Plan.findOne({ where: { name: planName } });
        if (!plan) {
            return res.status(404).json({
                status: false,
                message: "Plan not found."
            });
        }

        const displayName = (new Date()).getTime();

        await axios.post(`${tradeAPI}/createUser`, {
            name: customer.nickName,
            email: displayName,
            balance: plan.initialBalance,
            companyEmail: customer.companyEmail,
            type: "Phase1",
            password: customer.password,
            leverage: plan.leverage,
        });

        const account = await Account.create({
            displayName: displayName,
            customerEmail,
            companyEmail: customer.companyEmail,
            plan: planName,
            currentEquity: plan.initialBalance,
            leverage: plan.leverage,
            type: "Phase1",
            dailyDrawdown: (plan.initialBalance * plan.dailyDrawdown / 100),
            totalDrawdown: (plan.initialBalance * (100 - plan.totalDrawdown) / 100),
            totalTarget: (plan.initialBalance * (100 + plan.phase1) / 100),
            profitShare: plan.profitShare,
            allow: true,
            breached: false,
            tradeSystem,
            dayStartEquity: plan.initialBalance,
        });

        const accounts = company.role === "Admin"
            ? await Account.findAll()
            : await Account.findAll({ where: { companyEmail: company.email } });

        return res.status(200).json({
            status: true,
            accounts: accounts
        });

    } catch (error) {
        logger("error", "AccountController | CreateAccount | ", error.message);
        return res.status(500).json({
            status: false,
            message: `Create Account Failed : ${error.message}`
        });
    }
}

exports.getAccounts = async (req, res) => {
    try {
        const token = req.headers.authorization || "";
        const company = await Company.findOne({ where: { token } });
        if (company.role == "Admin") {
            const accounts = await Account.findAll();
            return res.status(200).json({ accounts });
        } else {
            const accounts = await Account.findAll({ where: { companyEmail: company.email } });
            return res.status(200).json({ accounts });
        }
    } catch (error) {
        logger("error", "AccountController", `Get Accounts | ${error.message}`)
        res.status(500).json({ message: `Get Accounts Failed | ${error.message}` })
    }
}

exports.resetDailyDrawdown = async (req, res) => {
    try {
        const { displayName } = req.body;
        const account = await Account.findOne({ where: { displayName: displayName } });
        await Account.update({ breachedReason: "none", breached: false, dayStartEquity: account.balance });
        res.status(200).json({ message: "Reset DailyDrawdown Successfully" });
    } catch (error) {
        logger("error", "AccountController", `Reset DailyDrawdown | ${error.message}`);
        res.status(500).json({ message: `Reset DailyDrawdown Failed | ${error.message}` })
    }
}

exports.upgradeAccount = async (req, res) => {
    try {
        const { displayName } = req.body;
        const account = await Account.findOne({ where: { displayName: displayName } });
        if (account.breachedReason == "TotalGoal") {
            const plan = await Plan.findOne({ where: { name: account.plan } });
            if (account.type == "Phase1") {
                await Account.update({
                    currentEquity: plan.initialBalance,
                    leverage: plan.leverage,
                    type: "Phase2",
                    dailyDrawdown: (plan.initialBalance * plan.dailyDrawdown / 100),
                    totalDrawdown: (plan.initialBalance * (100 - plan.totalDrawdown) / 100),
                    totalTarget: (plan.initialBalance * (100 + plan.phase2) / 100),
                    profitShare: plan.profitShare,
                    allow: true,
                    breached: false,
                    dayStartEquity: plan.initialBalance,
                })
            }
        }
    } catch (error) {
        logger("error", "AccountController", `Upgrade Account | ${error.message}`);
    }
}

exports.deleteAccount = async (req, res) => {
    const { accountId } = req.body;
    try {
        const account = await Account.findOne({ where: { id: accountId } });
        if (!account) {
            return res.status(404).send({ message: 'Cannot find the Account' });
        }
        await Account.destroy({ where: { id: accountId } });
        return res.status(200).send({ message: "Successfully deleted" });
    } catch (error) {
        return res.status(500).send({ message: 'An error occurred while deleting the customer.' });
    }
}
