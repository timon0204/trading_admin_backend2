const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    port: process.env.PORT || 8001,

    database: {
        type: process.env.DB_TYPE || "mysql",
        host: process.env.DB_HOST || "127.0.0.1",
        name: process.env.DB_NAME || "trading",
        user: process.env.DB_USER || "root",
        port: process.env.DB_PORT || "3306",
        pass: process.env.DB_PASS || 'HwYF"4/sWEN;$b(!VG5v}+',
        logging: process.env.DB_LOGGING === "true",
    },

    tradeAPI: process.env.TRADE_API || "http://127.0.0.1:8000/thirdParty",
}