const { Customer, Company } = require("../models");
const { where } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { secretKey } = require("../config/key")

exports.createCustomer = async (req, res) => {
    try {
        const { email, companyEmail, password, active, firstName, middleName, lastName, nickName, birthday, accounts, orders, referrals, language, phone, exteranlID1, exteranlID2, agreementID, agreementIP, agreementLegalName, agreementTs, country, state, city, zip, addressLine1, addressLine2, addressLine3 } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const createdAt = Date.now();
        const customer = await Customer.create({ email: email, companyEmail: companyEmail, password: hashedPassword, active: active, firstName: firstName, middleName: middleName, lastName: lastName, nickName: nickName, birthday: birthday, accounts: accounts, orders: orders, referrals: referrals, language: language, phone: phone, exteranlID1: exteranlID1, exteranlID2: exteranlID2, agreementID: agreementID, agreementIP: agreementIP, agreementLegalName: agreementLegalName, agreementTs: agreementTs, country: country, state: state, city: city, zip: zip, addressLine1: addressLine1, addressLine2: addressLine2, addressLine3: addressLine3, createdAt: createdAt });
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
        const originCompany = await Company.findOne({ where: { id: decodedToken.id } });
        let customers;
        if (originCompany.role == 'admin') {
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
        const { email, companyEmail, password, active, firstName, middleName, lastName, nickName, birthday, accounts, orders, referrals, language, phone, exteranlID1, exteranlID2, agreementID, agreementIP, agreementLegalName, agreementTs, country, state, city, zip, addressLine1, addressLine2, addressLine3, customerId } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const updatedAt = Date.now();
        await Customer.update({ email: email, companyEmail: companyEmail, password: hashedPassword, active: active, firstName: firstName, middleName: middleName, lastName: lastName, nickName: nickName, birthday: birthday, accounts: accounts, orders: orders, referrals: referrals, language: language, phone: phone, exteranlID1: exteranlID1, exteranlID2: exteranlID2, agreementID: agreementID, agreementIP: agreementIP, agreementLegalName: agreementLegalName, agreementTs: agreementTs, country: country, state: state, city: city, zip: zip, addressLine1: addressLine1, addressLine2: addressLine2, addressLine3: addressLine3, updatedAt: updatedAt }, { where: { id: customerId } })

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