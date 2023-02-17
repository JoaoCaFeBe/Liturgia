const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    root = '/www';

class Server {
    constructor() {
        this.app = express();
        this.app.use(express.static(path.join(__dirname, root)));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.raw());
        this.app.use('/', require('./src/routes/security'));
    }
}

module.exports = new Server().app;