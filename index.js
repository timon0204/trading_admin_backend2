const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
const compression = require('compression');
const i18n = require('i18n');
const router = require("./routes/router");
const loaders = require("./loaders");
const logger = require('./utils/logger');
const { port } = require('./config/main');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const server = http.createServer(app);

const startServer = async () => {
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(cors({
        origin: "*"
    }))
    app.use(bodyParser.json({ limit: "10mb" }));
    app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
    app.use(compression());

    i18n.configure({
        locales: ["en"],
        directory: path.join(__dirname, "lang")
    });
    // console.log(i18n.getLocales());
    app.use(i18n.init);

    // Set Middleware to process error
    app.use((err, req, res, next) => {
        if (err.code === 'EBADCSRFTOKEN') {
            res.status(403).send('CSRF Attack Detected');
        } else if (err instanceof SyntaxError) {
            res.status(400).send("JSON_ERROR");
        } else {
            next(err);
        }
    });

    app.use("/", router);
    await loaders({ app });
    server.listen(port, () => {
        logger("info", "Server", `Gold Site Server is started on ${port} port`);
    });
}

startServer();
