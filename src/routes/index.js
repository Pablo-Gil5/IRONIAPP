const express = require('express');


//Metodo de express que devulve un objecto
const router = express.Router();

router.get('/',(req,res) =>{
    res.render('links/menu');
});

module.exports = router;