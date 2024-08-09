const bcrypt = require('bcrypt');
const { where } = require('sequelize');
const { Admin } = require("../models");
const jwt = require('jsonwebtoken');
const secretKey = 'tradeSecretKey';

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ where: { email: email } });
        if (admin) {
            const result = await bcrypt.compare(password, admin.password);
            if (result) {
                const payload = { id: admin.id, password: admin.password };
                const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
                await Admin.update({ token: token }, { where: { id: admin.id } });
                return res.status(200).json({ state: true, token: token });
            } else {
                return res.status(401).json({ state: false, message: "Invalid Admin" });
            }
        } else {
            return res.status(401).json({ state: false, message: "Invalid Admin" });
        }
    } catch (error) {
        return res.status(500).json({ state: false, message: "An error occurred during authentication." });
    }
}