const bcrypt = require('bcrypt');
const { where } = require('sequelize');
const axios = require('axios');
const { tradeAPI } = require("../config/main");

const { Account, Company, Plan, Customer } = require("../models");
const logger = require('../utils/logger');

exports.createAccout = async (req, res) => {
    try {
        const token = req.headers.authorization || "";
        const company = await Company.findOne({ where: { token } });
        const { customerEmail, companyEmail, planName, tradeSystem } = req.body;
        const customer = await Customer.findOne({ where: { email: customerEmail } });
        const plan = await Plan.findOne({ where: { name: planName } });
        const displayName = (new Date()).getTime();
        const account = await Account.create({
            displayName: displayName,
            customerEmail,
            companyEmail: customer.companyEmail,
            plan: planName,
            currentEquity: plan.initialBalance,
            leverage: plan.leverage,
            type: "Phase1",
            dailyDrawdown: plan.dailyDrawdown,
            totalDrawdown: plan.totalDrawdown,
            totalTarget: plan.phase1,
            profitShare: plan.profitShare,
            allow: true,
            breached: false,
            tradeSystem,
        });
        if (company.role == "admin") {
            const accounts = await Account.findAll();
            return res.status(200).json({
                status: true,
                accounts: accounts
            });
        } else {
            const accounts = await Account.findAll({ where: { companyEmail: company.email } });
            return res.status(200).json({
                status: true,
                accounts: accounts
            });
        }

    } catch (error) {
        logger("error", "AccountController | CreateAccounts | ", error.message);
    }
}

exports.getAccounts = async (req, res) => {
    const token = req.headers.authorization || "";
    const company = await Company.findOne({ where: { token } });
    if (company.role == "admin") {
        const accounts = await Account.findAll();
        return accounts;
    } else {
        const accounts = await Account.findAll({ where: { companyEmail: company.email } });
        return accounts;
    }
}