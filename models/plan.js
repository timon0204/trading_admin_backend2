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
                type: Sequelize.DOUBLE(20, 2),
                allowNull: false,
            },
            phases: {
                type: Sequelize.TEXT,
                allowNull: false,
                defaultValue: ""
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
    };

    return Plan;
}