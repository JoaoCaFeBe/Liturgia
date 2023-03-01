const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    root = '/www',
    // handlebars = require('handlebars'),
    exphbs = require('express-handlebars').engine;

// handlebars.registerHelper('eq', function () {
//     const args = Array.prototype.slice.call(arguments, 0, -1);
//     return args.every(function (expression) {
//         return args[0] === expression;
//     });
// });

class Server {
    constructor() {
        this.app = express();
        this.app.use(express.static(path.join(__dirname, root)));
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.raw());
        this.app.use('/', require('./src/routes/security'));
        this.app.use('/', require('./src/routes/general'));
        this.app.engine('hbs', exphbs({ extname: '.hbs' }));
        this.app.set('view engine', 'hbs');
        this.app.set('views', './www/views');
    }
}

module.exports = new Server().app;