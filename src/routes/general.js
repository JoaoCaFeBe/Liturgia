var express = require('express'),
    router = express.Router(),
    path = require('path'),
    fs = require('fs');
// ----------------------------------------------------------------------------------------------------------------
router.get('/Lista/:tabela', async (req, res) => {
    if (fs.existsSync(path.join(__dirname, `../classes/${req.params.tabela}.js`))) {
        const Classe = require(`../classes/${req.params.tabela}.js`);
        let list = await Classe.list();
        res.render('Lista', list);
    } else {
        res.send('Tabela não encontrada : ' + req.params.tabela);
    }
})
// ----------------------------------------------------------------------------------------------------------------
module.exports = router;