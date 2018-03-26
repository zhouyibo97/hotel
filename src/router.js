// @ts-nocheck
/*
    路由组件，用于定义路由模块
*/
//handler对像
const url = require('url');

class handler{
    constructor(config){
        this.method=config.method;
        this.path=config.path;
        this.callback=config.callback;
    }
}

//路由对像
class router{
    constructor(){
        this.handlers=[];
    }
    push_handler(method,path,callback){
        const r=new handler({method,path,callback});
        this.handlers.push(r);
    }
    post(path,callback){
        this.push_handler("post",path,callback);
    }
    get(path,callback){
        this.push_handler("get",path,callback)
    }
    // 把另一个router对像合并进来
    use(r){
        this.handlers=this.handlers.concat(r.handlers);
    }
    //查找路径对应的handler
    find(request){
        let  method=request.method.toLowerCase();
        let u = url.parse(request.url);
        let pathname = u.pathname;

        for(let handler of this.handlers){
            if(handler.method===method && pathname===handler.path){
                console.log(handler.method===method && pathname===handler.path);
                return handler;
            }
        }
        return undefined;
    }
}

module.exports=router;
