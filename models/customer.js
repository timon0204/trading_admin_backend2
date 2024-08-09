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
            type: {
                type: Sequelize.ENUM("people", "company"),
                allowNull: false,
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            companyEmail: {
                type: Sequelize.STRING,
                allowNull: false,
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
            address_line1: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            address_line2: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: '',
            },
            address_line3: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: '',
            },
            first_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            middle_name: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: '',
            },
            second_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            nick_name: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: '',
            },
            date_of_birth: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            language: {
                type: Sequelize.ENUM("es", "ukr"),
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM("pending_kyc", "success", "failed"),
                allowNull: false,
            },
            plan: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: '',
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            archived: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            accounts: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: '',
            },
            external_id1: {
                type:Sequelize.STRING,
                allowNull:true,
                defaultValue: ''
            },
            external_id2: {
                type:Sequelize.STRING,
                allowNull:true,
                defaultValue: ''
            },
            agreement_signed: {
                type:Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            agreement_id: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: ''
            },
            agreement_ip: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: ''
            },
            agreement_legal_name: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: ''
            },
            agreement_ts: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: ''
            },
            orders: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            referrals: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
        },
        {
            tableName: "customers",
            freezeTableName: true,
            timestamps: true,
        }
    );

    Customer.migrate = async () => {
        await Customer.destroy({ truncate: true });
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash("123456", saltRounds);

        await Customer.create({
            type: 'people',
            phone: '+380 123456789',
            email: 'customer@gmail.com',
            password: hashedPassword,
            companyEmail: 'admin@demo.com',
            country: 'Ukraine',
            state: 'Kyiv',
            city: 'Kyiv',
            zip: '00000',
            address_line1: 'Kyiv Street1',
            first_name: 'Test',
            second_name: 'String',
            date_of_birth: Date.now(),
            status: 'pendingg_kyc',
            language: 'es',
            plan: '',
            title: 'Trading Customer',
            archived: true,
            orders: 0,
            referrals: 1,
            active: true,
        })

        await Customer.create({
            type: 'people',
            phone: '+380 987654321',
            email: 'personal@gmail.com',
            companyEmail: 'admin@gmail.com',
            password: hashedPassword,
            country: 'Poland',
            state: 'Warsaw',
            city: 'Warsaw',
            date_of_birth: Date.now(),
            zip: '11111',
            address_line1: 'Warsaw Street1',
            first_name: 'Text',
            second_name: 'Content',
            status: 'pendingg_kyc',
            language: 'es',
            plan: '',
            title: 'Trading Customer',
            archived: true,
            orders: 0,
            referrals: 1,
            active: true,
        })

    };

    return Customer;
}