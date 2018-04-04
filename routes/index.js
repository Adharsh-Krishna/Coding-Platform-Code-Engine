var express = require('express');
var router = express.Router();

let controller=require('../contollers/code-controller.js');

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods"," GET, PUT, POST, DELETE, HEAD");
    next();
});

router.post('/', function(req, res) {
controller.code_execute(req,res);
});


router.post('/save',function (req,res) {
controller.code_save(req,res);
});

router.post('/get',function (req,res) {
controller.get_code(req,res);
});

router.post('/gettest',function (req,res) {
    controller.get_tests(req,res);
});

module.exports = router;
