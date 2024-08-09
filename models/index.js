const Sequelize = require('sequelize');
const config = require("../config/main");

const sequelize = new Sequelize(config.database.name, config.database.user, config.database.pass, {
    host: config.database.host,
    dialect: config.database.type,
    port: config.database.port,
    logging: config.database.logging,
    pool: {
        max: 30,
        min: 0,
        acquire:30000,
        idle: 10000,
    },
    timezone: "+03:00"
});

const db = {}
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Admin = require("./admin")(sequelize, Sequelize);
db.Customer = require("./customer")(sequelize, Sequelize);

db.sync = async () => {
    await db.sequelize.sync();

    Object.keys(db).forEach(async (modelName) => {
        if(db[modelName].associate) {
            await db[modelName].associate(db);
        }
    });

    await db["Admin"].migrate();
    await db['Customer'].migrate();
};

module.exports = db