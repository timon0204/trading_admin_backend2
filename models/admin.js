const MD5 = require('md5.js');
const bcrypt = require('bcrypt');
// const company = require('./company');
const jwt = require('jsonwebtoken');
const {secretKey} = require("../config/key")

module.exports = (sequelize, Sequelize) => {
    const Admin = sequelize.define(
        "Admin",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            removed: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            enabled: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            surname: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            token: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            role: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'owner'
            },
        },
        {
            tableName: "admins",
            freezeTableName: true,
            timestamps: true,
        }
    );

    Admin.migrate = async () => {
            await Admin.destroy({ truncate: true });
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash("123456", saltRounds);

            await Admin.create({
                email: "admin@demo.com",
                surname: "Admin",
                name: 'IDURAR',
                password: hashedPassword,
                token:  jwt.sign({hashedPassword, type:"Demo"}, secretKey)
            })

    };

    return Admin;
}