const app = require('./app'),
    https = require('https'),
    fs = require('fs'),
    port = process.env.PORT || 3000;

Modules = JSON.parse(fs.readFileSync('src/security/Modules.json'));
Users = JSON.parse(fs.readFileSync('src/security/Users.json'));
Groups = JSON.parse(fs.readFileSync('src/security/Groups.json'));

const httpsOptions = {
    key: fs.readFileSync('security/cert.key'),
    cert: fs.readFileSync('security/cert.pem')
}
const server = https.createServer(httpsOptions, app)
    .listen(port, () => {
        console.log('server running at https://localhost:' + port)
    })
