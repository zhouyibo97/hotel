const fs=require('fs');
module.exports=function(path,callback){
    let static_dir=__dirname+'/../static';
    fs.readFile(static_dir+path,(err,data)=>{
        callback(err,data);
    });
}