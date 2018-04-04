const spawn = require('child_process').execFile;
const cmd=require('node-command-line');

exports.find_document=function (ins,param) {
    console.log(param);
    return new Promise(function (resolve, reject) {
        ins.find(param).then(function (data) {
            if(data.length===0)
            {
                reject(new Error("user not found"));
            }
            resolve(data[0]);
        }).catch(function () {
            reject(new Error("could not retrieve data"));
        })
    })
}


exports.check_password=function (dbpass,reqpass) {
    console.log(dbpass);
    console.log(reqpass);
    return new Promise(function (resolve,reject) {
        if(reqpass===dbpass)
        {
            resolve("CORRECT PASS");
        }
        reject(new Error("incorrect password"));
    })

}

exports.run_python=function (filename,prob_id,num,user_id) {
    return new Promise(async function (resolve,reject) {
        setTimeout(function () {
            reject(new Error("exceeded"));
        },2000);
        let outfilename=filename.substring(0,filename.length-3)
        console.log("out file is"+outfilename);
        console.log("prob is"+prob_id);
        let command='python '+filename +' < '+'codes/'+prob_id+'-input'+num+'.txt'+' > '+'codes/'+prob_id+'-user-'+user_id+'-output'+num+'.txt';
        console.log("executing...  "+command);
        let run= await cmd.run(command);
        if(run.success)
        {
            console.log("executing here ......../////");
            let json=compare_output(prob_id,num,user_id);

            // let json={user_output:"",actual_output:""};
            /*let data1=await fs.readFileSync('codes/'+prob_id+'-user-output'+num+'.txt',"utf8",function (err,data1) {
                if(err) {
                    reject(new Error("some error"));
                }
            });
            json.user_output=data1;
            let data2=await fs.readFileSync('codes/'+prob_id+'-output'+num+'.txt', "utf8",function (err,data2) {
                if(err)
                {
                    reject(new Error("some error1"));
                }

            });*/
            // json.actual_output=data2;
            resolve(json);
        }
        else
        {
            console.log("code not running....");
            reject(new Error("code not running"));
        }
    });
}

exports.compile_and_run_code= function (filename,prob_id) {
    return new Promise(async function (resolve,reject) {
        setTimeout(function () {
            reject(new Error("exceeded"));
        },2000);
        let outfilename=filename.substring(0,filename.length-2)
        let compile =await spawn('gcc', [filename,'-o',outfilename],function (error) {
            if (error) {
                console.log(error.message);
                reject(error);
            }
            else
            {
                console.log("compiled");
                resolve("compiled");
            }
        });
    });

}

exports.run_code= function (filename,prob_id,num,user_id) {
    return new Promise(async function (resolve,reject) { setTimeout(function () {
        reject(new Error("exceeded"));
    },2000);
        let outfilename=filename.substring(0,filename.length-2)
        console.log("out file is"+outfilename);
        console.log("prob is"+prob_id);
        let command='./'+outfilename+' < '+'codes/'+prob_id+'-input'+num+'.txt'+' > '+'codes/'+prob_id+'-user-'+user_id+'-output'+num+'.txt';
        console.log("executing...  "+command);
        let run= await cmd.run(command);
        if(run.success)
        {
            let json=compare_output(prob_id,num,user_id);

            // let json={user_output:"",actual_output:""};
            /*let data1=await fs.readFileSync('codes/'+prob_id+'-user-output'+num+'.txt',"utf8",function (err,data1) {
                if(err) {
                    reject(new Error("some error"));
                }
            });
            json.user_output=data1;
            let data2=await fs.readFileSync('codes/'+prob_id+'-output'+num+'.txt', "utf8",function (err,data2) {
                if(err)
                {
                    reject(new Error("some error1"));
                }

            });*/
            // json.actual_output=data2;
            resolve(json);
        }
        else
        {
            console.log("code not running....");
            reject(new Error("code not running"));
        }

    });
};

compare_output=async function (prob_id,num,user_id) {
    let command='diff codes/'+prob_id+'-output'+num+'.txt'+' codes/'+prob_id+'-user-'+user_id+'-output'+num+'.txt';
    console.log("testing "+command);
    let run=await cmd.run(command);
    console.log("test"+num+"  ::"+JSON.stringify(run));
    return run.success
};

let db=require('../bin/db/db.js')
let fs=require('fs')


findAndUpdate=async function(user_id,prob_id,type,code_id)
{
  console.log(user_id);
    console.log(prob_id);
    let ins=db.file;
    return new Promise(async function( resolve,reject){
console.log("hahahaha")
        await ins.findOne({_id:code_id}).then(async function (data) {
            console.log("here..."+data);

            if(data!==undefined && data!=="" && data!==null)
        {
            data.filename="codes/"+data.filename+"."+data.filetype;
            console.log(data)
            resolve(data)
        }
        /*else{
            let inst=db.file({user_id:user_id,problem_id:prob_id,filename:name,filetype:type});
            await inst.save().then(function(data2){
                console.log("trying...")
            if(data2!==undefined && data2!=="" && data2!==null)
            {

                data2.filename="codes/"+data2.filename+"."+data2.filetype;
                console.log("data2"+data2);
                console.log(data2)
                resolve(data2)
            }
        }).catch(function(err){
            console.log(err.message);
        })
        }*/
    }).catch((function (err) {
        console.log(err.message);
    }))
    })
    
}

exports.write_file= function (user_id,prob_id,type,text,code_id) {
    return new Promise(async function(resolve){
        let val=await findAndUpdate(user_id,prob_id,type,code_id);
        let file_name={filename:val.filename,file_id:val._id};

     await fs.writeFileSync(file_name.filename,text,function () {
        console.log("written");
        
    });
     resolve(file_name)
})
};

/*' < ',prob_id+"-input.txt",' > ', prob_id+"-user-output.txt"*/

/* compile.on('close', function (data) {
           if (data === 0) {
               var run = spawn('./'+filename, []);
               run.stdout.on('data', function (output) {
                   console.log(String(output));
                   resolve(String(output));
               });
               run.stderr.on('data', function (output) {
                   console.log(String(output));
                   reject(new Error("could not run code"));
               });
               run.on('close', function (output) {
                   console.log('stdout: ' + output);
                   resolve(output);
               });
           }
       });*/