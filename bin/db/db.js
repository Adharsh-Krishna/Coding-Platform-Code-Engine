var Mongoose = require('mongoose');

Mongoose.connect('mongodb://localhost/Code');
var  mongoose= Mongoose.connection.then(function () {
    console.log("CONNECTED");
}).catch(function () {
    console.log("NOT CONNECTED");
});

let db={};
db.mongoose=mongoose;
db.Mongoose=Mongoose;

const  file=require('../schemas/File-schema.js');

db.file=file.instance(Mongoose);

module.exports=db;



