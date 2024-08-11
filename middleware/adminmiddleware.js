const { Admin } = require("../models");

exports.adminmiddleware = async (req, res, next) => {
    const token = req.headers.authorization || "";
    if (token == "") {
        res.status(401).json({ state: "No Vailed Token! Please Login Again!" });
        return
    }
    const admin = await Admin.findOne({ where: { token } });
    if (!admin) {
        res.status(401).json({ state: "No Vailed Token! Please Login Again!" });
        return
    }
    next();
}
