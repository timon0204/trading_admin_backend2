const bcrypt = require('bcrypt');
const { where } = require('sequelize');
const axios = require('axios');
const { tradeAPI } = require("../config/main");

const { Account, Company, Plan, Customer } = require("../models");
const logger = require('../utils/logger');

exports.createPlan = async (req, res) => {
    try {
        const { name, price, initialBalance, dailyDrawdown, totalDrawdown, phase1, phase2, leverage, profitShare } = req.body;
        const createdAt = Date.now();
        const plan = await Plan.create({ name: name, price: price, initialBalance: initialBalance, dailyDrawdown: dailyDrawdown, totalDrawdown: totalDrawdown, phase1: phase1, phase2: phase2, leverage: leverage, profitShare: profitShare, createdAt: createdAt });
        plan.save();
        return res.status(200).send({ message: 'created successfully' });
    } catch (error) {
        return res.status(500).send({ message: 'An error occured when create plan' });
    }

}

exports.getPlans = async (req, res) => {
    try {
        const plans = await Plan.findAll();
        return res.status(200).json({ plans });
    } catch (error) {
        logger("error", "AccountController", `Get Accounts | ${error.message}`)
        res.status(500).json({ message: `Get Accounts Failed | ${error.message}` })
    }
}

exports.updatePlan = async (req, res) => {
    try {
        const { name, price, initialBalance, dailyDrawdown, totalDrawdown, phase1, phase2, leverage, profitShare, planId } = req.body;
        const plan = await Plan.findOne({ where: { id: planId } });
        if (!plan) {
            return res.send(500).send({message:'Cannot find plan'});
        }
        const updatedAt = Date.now();
        await Plan.update({name: name, price:price, initialBalance:initialBalance, dailyDrawdown:dailyDrawdown, totalDrawdown: totalDrawdown, phase1:phase1, phase2: phase2, leverage:leverage, profitShare: profitShare}, {where: {id: planId}});
        return res.status(200).json({message: "update plan successfully"});
    } catch (error) {
        logger("error", "AccountController", `Upgrade Account | ${error.message}`);
        return res.status(200).send({message: 'An error occured when update plan'});
    }
}

exports.deletePlan = async (req, res) => {
    const { planId } = req.body;
    try {
        const plan = await Plan.findOne({ where: { id: planId } });
        if (!plan) {
            return res.status(404).send({ message: 'Cannot find the Account' });
        }
        await Plan.destroy({ where: { id: planId } });
        return res.status(200).send({ message: "Successfully deleted" });
    } catch (error) {
        return res.status(500).send({ message: 'An error occurred while deleting the customer.' });
    }
}