const bcrypt = require('bcrypt');
const { where } = require('sequelize');
const { Company } = require("../models");
const jwt = require('jsonwebtoken');
const secretKey = 'tradeSecretKey';

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const company = await Company.findOne({ where: { email: email } });
        if (company) {
            const result = await bcrypt.compare(password, company.password);
            if (result) {
                const payload = { id: company.id, password: company.password };
                const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
                await Company.update({ token: token }, { where: { id: company.id } });
                return res.status(200).json({ state: true, token: token });
            } else {
                return res.status(401).json({ state: false, message: "Invalid Company" });
            }
        } else {
            return res.status(401).json({ state: false, message: "Invalid Company" });
        }
    } catch (error) {
        return res.status(500).json({ state: false, message: "An error occurred during authentication." });
    }
}