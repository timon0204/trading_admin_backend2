const MD5 = require('md5.js');
const bcrypt = require("bcrypt");
module.exports = (sequelize, Sequelize) => {
    const Account = sequelize.define(
        "Account",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            displayName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            customerEmail: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            companyEmail: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            plan: {
                type: Sequelize.STRING,
                allowNull: false
            },

            currentEquity: {
                type: Sequelize.DOUBLE(20, 2),
                allowNull: false
            },
            leverage: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            type: {
                type: Sequelize.ENUM("Phase1", "Phase2", "Live"),
                allowNull: false
            },
            dailyDrawdown: {
                type: Sequelize.DOUBLE(20, 2),
                allowNull: false
            },
            totalDrawdown: {
                type: Sequelize.DOUBLE(20, 2),
                allowNull: false
            },
            totalTarget: {
                type: Sequelize.DOUBLE(20, 2),
                allowNull: false
            },
            profitShare: {
                type: Sequelize.DOUBLE(20, 2),
                allowNull: false
            },
            allow: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            blockReason: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            breached: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            breachedReason: {
                type: Sequelize.ENUM("DailyDrawdown", "TotalDrawdown", "TotalGoal", "None"),
                allowNull: false,
                defaultValue: "None"
            },
            tradeSystem: {
                type: Sequelize.ENUM("MT4", "LaserTrade"),
                allowNull: false,
            },
            dayStartEquity: {
                type: Sequelize.DOUBLE(20, 2),
                allowNull: false,
            }
        },
        {
            tableName: "accounts",
            freezeTableName: true,
            timestamps: true,
        }
    );

    Account.migrate = async () => {
        await Account.destroy({ truncate: true });

        await Account.create({
            displayName: 'KKK',
            customerEmail: 'custormer@gmail.com',
            companyEmail: 'testCompany@gmail.com',
            plan: 'PPPP',
            currentEquity: '112312',
            leverage: '1231',
            type: 'Phase1',
            dailyDrawdown: 12312,
            totalDrawdown:1231,
            totalTarget:12312 ,
            profitShare:12312,
            allow: true,
            blockReason: '13123123',
            breached:false,
            dayStartEquity:12312,
            breachedReason: 'None',
            tradeSystem: 'MT4'
        })
    };

    return Account;
}