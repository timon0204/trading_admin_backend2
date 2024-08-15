const MD5 = require('md5.js');
const bcrypt = require("bcrypt");
module.exports = (sequelize, Sequelize) => {
    const Customer = sequelize.define(
        "Customer",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            companyEmail: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            token: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            firstName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            middleName: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            lastName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            nickName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            birthday: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            accounts: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            orders: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            referrals: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            language: {
                type: Sequelize.ENUM("en"),
                allowNull: false,
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            externalID1: {
                type:Sequelize.INTEGER,
                allowNull:true,
            },
            externalID2: {
                type:Sequelize.INTEGER,
                allowNull:true,
            },
            agreementSigned: {
                type:Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            agreementID: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            agreementIP: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            agreementLegalName: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            agreementTs: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            country: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            state: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            city: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            zip: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM("pending", "allow", "block"),
                allowNull: false,
            },
            addressLine1: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            addressLine2: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            addressLine3: {
                type: Sequelize.STRING,
                allowNull: true,
            },
        },
        {
            tableName: "customers",
            freezeTableName: true,
            timestamps: true,
        }
    );

    Customer.migrate = async () => {
        // await Customer.destroy({ truncate: true });
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash("123456", saltRounds);

        // await Customer.create({
        //     email: 'customer@gmail.com',
        //     companyEmail: 'admin@gmail.com',
        //     password: hashedPassword,
        //     active: true,
        //     firstName: "TestFistName",
        //     lastName: "TestLastName",
        //     nickName: "TestNickName",
        //     birthday: "2000-01-01",
        //     accounts: 0,
        //     orders: 0,
        //     language: "en",
        //     phone: "+380 123456789",
        //     status: "allow",
        //     country: "Ukraine",
        //     state: "KR",
        //     city: "",
        //     zip: 0,
        //     status: 'allow',
        //     addressLine1: "",
        // })
        

    };

    return Customer;
}