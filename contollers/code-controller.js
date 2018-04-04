const rand=require('randomstring');
const  util_controller=require('../utils/utils.js');
const request=require('request');
const fs=require('fs');
let db=require('../bin/db/db.js');

exports.get_code=async function (req,res) {
    try{
        let user_id=req.body.user_id
        let prob_id=req.body.problem_id
        let type=req.body.type;
        console.log(req.body);
        await db.file.findOne({user_id:user_id,problem_id:prob_id,filetype:type},async function (err,data1) {
            console.log(data1);
            if(data1!==undefined && data1!=="" && data1!==null)
            {
                console.log("here");
                await fs.readFile('codes/'+data1.filename+'.'+data1.filetype,'utf-8',function (err,data) {
                    if(err){
                        console.log("cannot read data");
                        throw new Error("cannot read data");
                    }
                    console.log(data);
                    res.status(200);
                    res.send(JSON.stringify({code:data,info:data1}));
                })
            }
            else{
                let fname=rand.generate(9);
                let ins=db.file({user_id:user_id,problem_id:prob_id,filetype:type,filename:fname})
                ins.save().then(function (data1) {
                    console.log(data1);
                    if(data1!==undefined && data1!=="" && data1!==null)
                    {
                        console.log("here");
                        fs.writeFileSync('codes/'+data1.filename+'.c',"",function () {
                            console.log("written");

                        });
                        console.log(data1);
                        res.status(200);
                        res.send(JSON.stringify({code:"",info:data1}));
                    }
                })
            }
        })

    }
    catch(err){
        console.log("some error");
            res.status(200);
            res.end("");
    }
}

exports.code_save=async function (req,res) {
    try {
        let type=req.body.type;
        let code=req.body.code;
        let user_id=req.body.user_id
        let prob_id=req.body.prob_id
        let code_id=req.body.code_id
        console.log("save save");
        let f=await util_controller.write_file(user_id,prob_id,type,code,code_id);
        console.log("filename is"+f);
        res.status(200);
        res.json(f);
    }
    catch(err)
    {
        res.status(200);
        res.json({filename:undefined})
    }
}

exports.get_tests=async function (req,res) {
    try{
        let f=req.body.filename
        let problem_id=req.body.prob_id/*prob_id*/;
        let body=req.body.counts
            console.log("count is"+body);
            console.log("filename is"+f);
            if(req.body.program_type==='c'){
                await util_controller.compile_and_run_code(f,problem_id).then(function (data) {
                    if(data==="compiled"){
                        console.log("compiled here too");
                    }

                }).catch(function (err) {
                    throw err;
                });
            }
            else if(req.body.program_type==='py'){
               /* await util_controller.run_python(f,problem_id).then(function (data) {
                    if(data==="compiled"){
                        console.log("compiled here too");
                    }
                }).catch(function (err) {
                    throw err;
                })*/
            }

            for(let i=1;i<=parseInt(body);i=i+1) {
                console.log("i is"+i);
                await request('http://localhost:3000/test/input/'+problem_id+"/"+i).pipe
                (fs.createWriteStream("codes/"+problem_id+'-input'+i+'.txt'));

                await request('http://localhost:3000/test/output/'+problem_id+"/"+i).pipe
                (fs.createWriteStream("codes/"+problem_id+'-output'+i+'.txt'));
            }

        res.status(200);
        res.end("compiled");
    }
    catch(err){
            console.log("could not fetch test cases");
            res.status(200);
            res.json({type:"error",message:err.message});
    }
}

exports.code_execute= async function (req,res) {
    try {
        // let fname=rand.generate(9);
        // let type=req.body.type;
        // let code=req.body.code;
        // let user_id=req.body.user_id
        // let prob_id=req.body.prob_id
        console.log(".........................");
        console.log(req.body);
        console.log(".........................");
        let f=req.body.filename
        // let f=await util_controller.write_file(user_id,prob_id,fname,type,code);
        // console.log("filename is"+f);
        let problem_id=req.body.prob_id/*prob_id*/;
        let body=req.body.counts;
        let user=req.body.user_id;
       /* let test_data=await request('http://localhost:3000/test/'+problem_id,async function (err,res,body) {
            if(err)
            {
                console.log(err.message);
            }
            console.log("count is"+body);
            console.log("filename is"+f);
            let compile=await util_controller.compile_and_run_code(f,problem_id);
            for(let i=1;i<=parseInt(body);i=i+1) {
                console.log("i is"+i);
                await request('http://localhost:3000/test/input/'+problem_id+"/"+i).pipe
                (fs.createWriteStream("codes/"+problem_id+'-input'+i+'.txt'));

                await request('http://localhost:3000/test/output/'+problem_id+"/"+i).pipe
                (fs.createWriteStream("codes/"+problem_id+'-output'+i+'.txt'));
            }*/
       let out=[];
                for(let i=1;i<=parseInt(body);i=i+1){
                    if(req.body.program_type==="c"){
                        console.log("running c..")
                        let run =await util_controller.run_code(f,problem_id,i,user);
                        console.log(JSON.stringify({number:i,output:run}));
                        out[i-1]={number:i,output:run}
                    }
                    else if(req.body.program_type==="py"){
                        console.log("running py..")
                        let run =await util_controller.run_python(f,problem_id,i,user);
                        console.log(JSON.stringify({number:i,output:run}));
                        out[i-1]={number:i,output:run}
                    }

                }

        // });

        res.status(200);
        res.end(JSON.stringify(out));
    }
    catch (err)
    {
        res.status(200);
        res.json({type:"error",message:err.message});
    }
}