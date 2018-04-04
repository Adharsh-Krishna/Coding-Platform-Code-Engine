const mongoose=require('mongoose');

const schema=mongoose.Schema({
        problem_id:{type:String, required : true},
        user_id:{type:String, required : true},
        filename:String,
        filetype:String
    },
    {
        timestamps:true
    },
    {
        collection:'codefiles'
    });


exports.instance=function (mon) {
    return mon.model('codefiles',schema);
};