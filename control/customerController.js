const { Customer, Admin } = require("../models");
const { where } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { secretKey } = require("../config/key")

exports.createCustomer = async (req, res) => {
    try {
        const { type, phone, email, companyEmail, country, state, city, zip, address_line1, address_line2, address_line3, first_name, seconde_name, language, status, plan, title, archived, orders, referrals, active, accounts, password, middle_name, nick_name, date_of_birth, external_id1, external_id2, agreement_signed, agreement_id, agreement_ip, agreement_ts } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const createdAt = Date.now();
        const customer = await Customer.create({ type: type, email: email, password: hashedPassword, phone: phone, country: country, state: state, city: city, secretKey, companyEmail: companyEmail, zip: zip, address_line1: address_line1, address_line2: address_line2, address_line3: address_line3, first_name: first_name, seconde_name: seconde_name, language: language, status: status, plan: plan, title: title, archived: archived, orders: orders, referrals: referrals, active: active, accounts: accounts, createdAt: createdAt, middle_name: middle_name, nick_name: nick_name, date_of_birth: date_of_birth, external_id1: external_id1, external_id2: external_id2, agreement_signed: agreement_signed, agreement_id: agreement_id, agreement_ip: agreement_ip, agreement_ts: agreement_ts });
        customer.save();
        return res.status(200).send({ message: "created successfully", });
    } catch (err) {
        console.log("this is a err", err);
        return res.status(500).send({ message: "An error occurred while creating user" });
    }
}
exports.getCustomers = async (req, res) => {
    try {
        const token = req.headers.authorization || "";
        const decodedToken = jwt.verify(token, secretKey);
        const originCompany = await Admin.findOne({ where: { id: decodedToken.id } });
        let customers;
        if (originCompany.email == 'admin@gmail.com') {
            customers = await Customer.findAll();
        } else {

            customers = await Customer.findAll({ where: { companyEmail: originCompany.email } });
        }
        return res.status(200).send({ customers: customers });
    } catch (error) {
        return res.status(500).send({ message: 'An error occurred while deleting the customer.' });
    }
}

exports.updateCustomer = async (req, res) => {
    try {
        const { type, phone, email, companyEmail, country, state, city, zip, address_line1, address_line2, address_line3, first_name, seconde_name, language, status, plan, title, archived, orders, referrals, active, accounts, password, middle_name, nick_name, date_of_birth, external_id1, external_id2, agreement_signed, agreement_id, agreement_ip, agreement_ts, customerId } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await Customer.update({ type: type, email: email, password: hashedPassword, phone: phone, country: country, state: state, city: city, secretKey, companyEmail: companyEmail, zip: zip, address_line1: address_line1, address_line2: address_line2, address_line3: address_line3, first_name: first_name, seconde_name: seconde_name, language: language, status: status, plan: plan, title: title, archived: archived, orders: orders, referrals: referrals, active: active, accounts: accounts, updatedAt: updatedAt, middle_name: middle_name, nick_name: nick_name, date_of_birth: date_of_birth, external_id1: external_id1, external_id2: external_id2, agreement_signed: agreement_signed, agreement_id: agreement_id, agreement_ip: agreement_ip, agreement_ts: agreement_ts }, { where: { id: customerId } })

        res.status(200).json({ messages: "Update Successfully" });
    } catch (error) {
        return res.status(500).send({ message: 'An error occurred while deleting the customer.' });
    }
}


exports.deleteCustomer = async (req, res) => {
    const { customerId } = req.body;
    try {
        const user = await Customer.findOne({ where: { id: customerId } });
        if (!user) {
            return res.status(404).send({ message: 'Cannot find the Customer' });
        }
        await Customer.destroy({ where: { id: customerId } });
        return res.status(200).send({ message: "Successfully deleted" });
    } catch (error) {
        return res.status(500).send({ message: 'An error occurred while deleting the customer.' });
    }
}