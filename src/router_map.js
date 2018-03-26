// @ts-nocheck
const get_static=require('./get_static');
const get_mime=require('./mime');
module.exports=[{
    method:'get',
    path:'/',
    title:'首页',
    handler:(req,res)=>{
        get_static(`/index.html`,(error,data)=>{
            if(!error){
                res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
                res.end(data,"binary");
            }else{
                res.writeHead(404, {'Content-Type': 'text/html;charset=UTF-8'});
                res.end("没有找到指定资源");
            }
        });
    }
},{
    method:'get',
    path:'/list',
    title:'联系人列表',
    handler:(req,res)=>{
        res.writeHead(200, {'Content-Type': get_mime('json')});
        let data=[{

        }];
        res.end(JSON.stringify(data));
    }
}];
