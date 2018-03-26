module.exports=function(name){
    const list={
        html:'text/html',
        htm:'text/html',
        jpg:'image/jpg',
        jpeg:'image/jpg',
        png:'image/png',
        css:'text/css',
        js:'application/x-javascript',
        json:'application/json',
        woff:'application/x-font-woff',
        woff2:'application/x-font-woff',
        ttf:'application/octet-stream',
        svg:'text/xml',
        eot:'application/octet-stream'
    };
    if(list[name]){
        return list[name];
    }else{
        throw{message:'not found'};
    }
}