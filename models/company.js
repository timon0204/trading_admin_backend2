const MD5 = require('md5.js');
const bcrypt = require('bcrypt');
// const company = require('./company');
const jwt = require('jsonwebtoken');
const {secretKey} = require("../config/key")

module.exports = (sequelize, Sequelize) => {
    const Company = sequelize.define(
        "Company",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            token: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            role: {
                type: Sequelize.ENUM("admin", "company"),
                allowNull: false,
                defaultValue: "company"
            },
            allow: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            blockReason: {
                type: Sequelize.STRING,
                allowNull: true
            }
        },
        {
            tableName: "company",
            freezeTableName: true,
            timestamps: true,
        }
    );

    Company.migrate = async () => {
            await Company.destroy({ truncate: true });
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash("123456", saltRounds);

            await Company.create({
                email: "admin@gmail.com",
                name: "Admin",
                password: hashedPassword,
                token:  jwt.sign({hashedPassword, type:"Demo"}, secretKey),
                role: "admin",
                allow: true,
            })
            await Company.create({
                email: "testCompany@gmail.com",
                name: "TestCompany",
                password: hashedPassword,
                token:  jwt.sign({hashedPassword, type:"Demo"}, secretKey),
                role: "company",
                allow: true,
            })
    };

    return Company;
}