const { login } = require('../security/securityFunctions');
var express = require('express'),
    md5 = require('md5'),
    router = express.Router();
// ----------------------------------------------------------------------------------------------------------------
router.get('/Modules', (req, res) => {
    res.json(Modules);
})
// ----------------------------------------------------------------------------------------------------------------
const User = require('../classes/User.js');
// ----------------------------------------------------------------------------------------------------------------
router.get('/Users', (req, res) => {
    res.json(User.getAll());
})
// ----------------------------------------------------------------------------------------------------------------
router.get('/User/:email', (req, res) => {
    res.json(new User(req.params.email));
})
router.post('/User', (req, res) => {
    res.json(new User().post(req.body));
})
router.put('/User', (req, res) => {
    res.json(new User().post(req.body));
})
router.delete('/User/:email', (req, res) => {
    res.json(User.delete(req.params.email));
})
router.get('/User/definitions/:email', (req, res) => {
    if (req.params.email == 0) req.params.email = false;
    res.json(User.definitions(req.params.email));
})
// ----------------------------------------------------------------------------------------------------------------
const Group = require('../classes/Group.js');
// ----------------------------------------------------------------------------------------------------------------
router.get('/Groups', (req, res) => {
    res.json(Groups.getAll());
})
// ----------------------------------------------------------------------------------------------------------------
router.get('/Group/:name', (req, res) => {
    res.json(new Group(req.params.name));
})
router.post('/Group', (req, res) => {
    res.json(new Group().post(req.body));
})
router.put('/Group', (req, res) => {
    res.json(new Group().post(req.body));
})
router.delete('/Group/:name', (req, res) => {
    res.json(Group.delete(req.params.name));
})
router.get('/Group/definitions/:name', async (req, res) => {
    if (req.params.name == 0) req.params.name = false;
    retorno = await Group.definitions(req.params.name);
    res.json(retorno);
})
// ----------------------------------------------------------------------------------------------------------------
router.post('/Login', (req, res) => {
    res.json(login(req.body.email, req.body.password, req.body.module));
})
// ----------------------------------------------------------------------------------------------------------------
module.exports = router;