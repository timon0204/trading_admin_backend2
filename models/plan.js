const MD5 = require('md5.js');
const bcrypt = require("bcrypt");
module.exports = (sequelize, Sequelize) => {
    const Plan = sequelize.define(
        "Plan",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            price: {
                type: Sequelize.DOUBLE(20,2),
                allowNull: false,
            },
            initialBalance: {
                type: Sequelize.DOUBLE(20,2),
                allowNull: false,
            },
            dailyDrawdown: {
                type: Sequelize.DOUBLE(20,2),
                allowNull: false
            },
            totalDrawdown: {
                type: Sequelize.DOUBLE(20,2),
                allowNull: false
            },
            phase1: {
                type: Sequelize.DOUBLE(20,2),
                allowNull: false
            },
            phase2: {
                type: Sequelize.DOUBLE(20,2),
                allowNull: false,
            },
            leverage: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            profitShare: {
                type: Sequelize.DOUBLE(20,2),
                allowNull: false
            },
        },
        {
            tableName: "plans",
            freezeTableName: true,
            timestamps: true,
        }
    );

    Plan.migrate = async () => {
        await Plan.destroy({ truncate: true });
        await Plan.create({
            name: "BasicPlan1",
            price: 25,
            initialBalance: 5000,
            dailyDrawdown: 5,
            totalDrawdown: 10,
            phase1: 10,
            phase2: 7,
            leverage: 50,
            profitShare: 80,
        })
    };

    return Plan;
}