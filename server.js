// @ts-nocheck
const http=require('http');
const url=require('url');
const query=require('querystring');
const fs=require('fs');
const router_map=require('./src/router_map');
const get_static=require('./src/get_static');
const get_mime=require('./src/mime');
const _router=require("./src/router");
const get_list=require("./src/getList");
const get_room_list=require("./src/getRoomList");
const get_thing = require( './src/getThing' );
const get_total = require( './src/gettotel' );
const get_person = require( './src/getPerson' );
const user=require("./src/user");
const mongoose=require("mongoose");
const db_connstr = 'mongodb://127.0.0.1:27017/hotel';
mongoose.connect(db_connstr,{useMongoClient:true});
require("./src/models/linkman");
require("./src/models/user");
require("./src/models/room");
require( "./src/models/thing" );
require( "./src/models/total" );
require( "./src/models/person" );

let router=new _router();
router.get("/",(req,res)=>{
    get_static(`/one.html`,(error,data)=>{
        if(!error){
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
            res.end(data,"binary");
        }else{
            res.writeHead(404, {'Content-Type': 'text/html;charset=UTF-8'});
            res.end("没有找到指定资源");
        }
    });
    get_static(`/index.html`,(error,data)=>{
        if(!error){
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
            res.end(data,"binary");
        }else{
            res.writeHead(404, {'Content-Type': 'text/html;charset=UTF-8'});
            res.end("没有找到指定资源");
        }
    });
    get_static(`/room.html`,(error,data)=>{
        if(!error){
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
            res.end(data,"binary");
        }else{
            res.writeHead(404, {'Content-Type': 'text/html;charset=UTF-8'});
            res.end("没有找到指定资源");
        }
    });
    get_static(`/thing.html`,(error,data)=>{
        if(!error){
            res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
            res.end(data,"binary");
        }else{
            res.writeHead(404, {'Content-Type': 'text/html;charset=UTF-8'});
            res.end("没有找到指定资源");
        }
    });
})


router.use(get_list);
router.use(get_room_list);
router.use(user);
router.use( get_thing );
router.use( get_total );
router.use( get_person );
const server=http.createServer((req,res)=>{
    let u=url.parse(req.url);
    let pathname=u.pathname;
    let query_obj=query.parse(u.query);
    const method=req.method.toLowerCase();
    //代表找到了对应的处理程序
    let handler=router.find(req);
    if(handler){
        handler.callback(req,res);
    }else{
        //提取mime信息
        let name_arr=pathname.split('').reverse();
        let ex_name=name_arr.slice(0,name_arr.indexOf('.')).reverse().join('');
        //判断mime,如果没有找到对应的mime信息，就提示错误
        try{
            var mime_name=get_mime(ex_name);
        }catch(e){
            res.writeHead(500, {'Content-Type': 'text/html;charset=UTF-8'});
            res.end("没有找到指定资源");
            return;
        }
        //输出静态资源
        get_static(pathname,(error,data)=>{
            if(!error){
                res.writeHead(200, {'Content-Type': `${mime_name}`});
                res.end(data,"binary");
            }else{
                res.writeHead(404, {'Content-Type': 'text/html;charset=UTF-8'});
                res.end("没有找到指定资源");
            }
        });
    }
    // //在router里查找对应的处理程序
    // router_map.map((v,k)=>{
    //     if(v.method===method&&pathname===v.path){
    //         //已找到对应的处理程序
    //         find_router=true;
    //         console.log(`对应路由：${v.title}[${v.path}]`);
    //         v.handler(req,res);
    //     }
    // })
    // if(!find_router){
    //     //第二部路由表没处理的请求，我们在第二步里查找是否由静态资源
    //     //提取mime信息
    //     let name_arr=pathname.split('').reverse();
    //     let ex_name=name_arr.slice(0,name_arr.indexOf('.')).reverse().join('');
    //     //判断mime,如果没有找到对应的mime信息，就提示错误
    //     try{
    //         var mime_name=get_mime(ex_name);
    //     }catch(e){
    //         res.writeHead(500, {'Content-Type': 'text/html;charset=UTF-8'});
    //         res.end("没有找到指定资源");
    //         return;
    //     }
    //     //输出静态资源
    //     get_static(pathname,(error,data)=>{
    //         if(!error){
    //             res.writeHead(200, {'Content-Type': `${mime_name}`});
    //             res.end(data,"binary");
    //         }else{
    //             res.writeHead(404, {'Content-Type': 'text/html;charset=UTF-8'});
    //             res.end("没有找到指定资源");
    //         }
    //     });
    // }



    // for(let k of router_map){
    //     if(k.method===method&&pathname===k.path){
    //         console.log(`对应路由：${k.title}[${k.path}]`);
    //         k.handler(req,res);
    //     }
    // }
    // for(let k in router_map){
    //     var v=router_map[k];
    //     if(v.method===method&&pathname===v.path){
    //         console.log(`对应路由：${v.title}[${v.path}]`);
    //         v.handler(req,res);
    //     }
    // }
    console.log('接到请求',req);
});
server.listen(8082);
console.log(`服务启动，端口8082`);
