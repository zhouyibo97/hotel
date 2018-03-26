const _router = require("./router");
const get_mime = require('./mime');
const guid = require("guid");
const url = require("url");
const query = require("querystring");
const async = require("async");
const md5 = require('md5');
const mongoose=require("mongoose");

let router = new _router();
router.get("/insertTestManager",(req,res)=>{
    const m_user=mongoose.model("user");
    m_user.create({
        user_id:"admin",password:"admin",token:""
    },(err)=>{
        if(err){
            res.end("error");
        }else{
            res.end("ok");
        }
    })
})

// // 加载mongo组件
const mongodb = require("mongodb");
const db_client = mongodb.MongoClient;
const db_connstr = 'mongodb://127.0.0.1:27017/c4_phonebook';

router.post("/user/login", (req, res) => {
    var post = '';
    // 处理post的data事件，拼接数据
    req.on('data', (chunk) => {
        post += chunk.toString();
        //debugger;
    });
    req.on('end',()=>{
        var post_param=query.parse(post);
        const {user_id,password}=post_param;
        db_client.connect(db_connstr,(err,db)=>{
            if(!err){
                let collection=db.collection("user");
                collection.findOne({user_id,password},(err,result)=>{
                    if(!err){
                        if(!!result){
                            let token_str=guid.raw();
                            collection.update(
                                {_id:result._id},
                                {$set:{token:token_str}},
                                (err,result)=>{
                                    db.close();
                                }
                            )
                            res.writeHead(200, { 'Content-Type': get_mime('json') });
                            res.end(JSON.stringify({token:'token_str'}));
                        }else{
                            res.writeHead(401, { 'Content-Type': get_mime('json') });
                            res.end(JSON.stringify({message:"登录失败"}));
                            db.close();
                        }
                    }
                })
            }
        })
    })
    // req.on("end", () => {
    //     var param = query.parse(post);
    //     const { user_id, password } = param;
    //     let ps_md5 = md5(password);
    //     async.waterfall([
    //         (next_callback) => {
    //             db_client.connect(db_connstr, (err, db) => {
    //                 next_callback(err, db);
    //             })
    //         },
    //         (db, next_callback) => {
    //             let collection = db.collection("user");
    //             next_callback(null, { collection, db });
    //         },
    //         (prev, next_callback) => {
    //             const { db, collection } = prev;
    //             collection.findOne({ user_id, password: password }, (err, result) => {
    //                 if (result) {
    //                     next_callback(err, { user: result, collection, db });
    //                 } else {
    //                     next_callback({ message: '用户密码错误' }, { db });
    //                 }
    //             })
    //         },
    //         (prev, next_callback) => {
    //             const { db, collection, user } = prev;
    //             let token_str = guid.raw();
    //             collection.update(
    //                 { _id: user._id },
    //                 { $set: { token: token_str } },
    //                 (err, result) => {
    //                     next_callback(err, { token_str, db })
    //                 }
    //             )
    //         }
    //     ], (err, result) => {
    //         result && result.db && result.db.close();
    //         if (err) {
    //             let err_msg = !result ? "数据库连接失败" : err.message;
    //             res.writeHead(401, { 'Content-Type': get_mime('json') });
    //             res.end(JSON.stringify({ message: err_msg }));
    //         } else {
    //             res.writeHead(200, { 'Content-Type': get_mime('json') });
    //             res.end(JSON.stringify({ token: result.token_str }));
    //         }

    //     });
    // })
});

module.exports = router;
