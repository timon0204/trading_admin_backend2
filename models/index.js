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

db.Company = require("./company")(sequelize, Sequelize);
db.Customer = require("./customer")(sequelize, Sequelize);
db.Account = require("./account")(sequelize, Sequelize);
db.Plan = require("./plan")(sequelize, Sequelize);

db.sync = async () => {
    await db.sequelize.sync();

    Object.keys(db).forEach(async (modelName) => {
        if(db[modelName].associate) {
            await db[modelName].associate(db);
        }
    });

    await db["Company"].migrate();
    await db['Customer'].migrate();
    await db['Account'].migrate();
    await db['Plan'].migrate();
};

module.exports = db