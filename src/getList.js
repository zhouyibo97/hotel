//@ts-nocheck
const _router = require( "./router" );
const get_mime = require( "./mime" );
const url = require( "url" );
const query = require( "querystring" );
const async = require( "async" );

const mongoose = require( "mongoose" );

let router = new _router();
// 加载mongo组件
const mongodb = require( "mongodb" );
const db_client = mongodb.MongoClient;
const db_connstr = 'mongodb://127.0.0.1:27017/hotel';


router.get( "/list", ( req, res ) =>
{
    var queryString = url.parse( req.url ).query;
    var param = query.parse( queryString );
    // 连接数据库
    db_client.connect( db_connstr, ( err, db ) =>
    {
        if ( err )
        {
            console.log( "连接数据库失败", err );
        } else
        {
            let collection = db.collection( "linkman" );
            let $where = param.keyword ? { name: new RegExp( param.keyword ) } : {}
            collection.find( $where ).sort( { "_id": -1 } ).toArray( ( err, result ) =>
            {
                if ( !err )
                {
                    res.writeHead( 200, { 'Content-Type': get_mime( 'json' ) } );
                    res.end( JSON.stringify( result ) );
                } else
                {

                }
                db.close();
            } )
        }
    } );
} )



router.post( "/create", ( req, res ) =>
{
    var queryString = url.parse( req.url ).query;

    var param = query.parse( queryString );
    var post = '';
    // 处理post的data事件，拼接数据
    req.on( 'data', ( chunk ) =>
    {
        post += chunk.toString();
    } );
    // 当完成时处理数据
    req.on( 'end', () =>
    {
        var post_param = query.parse( post );
        const { roomnum, idnum } = post_param;
        db_client.connect( db_connstr, ( err, db ) =>
        {
            let r = db.collection( "room" );
            r.find( { "roomnum": roomnum } ).toArray( function ( err, result )
            {
                if ( result )
                {
                    if ( !err )
                    {
                        if ( !!result )
                        {
                            let collection = db.collection( "linkman" );
                            collection.insert( post_param, ( err, result ) =>
                            {
                                if ( !err )
                                {
                                    res.writeHead( 200, { 'Content-Type': `${ get_mime( 'json' ) };charset:utf-8` } );
                                    res.end( JSON.stringify( { success: true } ) );

                                } else
                                {
                                    res.writeHead( 404, { 'Content-Type': `${ get_mime( 'json' ) };charset:utf-8` } );
                                    res.end( JSON.stringify( { message: '服务器无法找到' } ) );
                                }
                                db.close();
                            } );

                        } else
                        {
                            res.writeHead( 404, { 'Content-Type': `${ get_mime( 'json' ) };charset:utf-8` } );
                            res.end( JSON.stringify( { message: '服务器无法找到' } ) );
                        }
                    }
                    else
                    {
                        alert( "输入错误 " );
                    }
                } else
                {
                    res.writeHead( 404, { 'Content-Type': `${ get_mime( 'json' ) };charset:utf-8` } );
                    res.end( JSON.stringify( { message: '房间输入错误，未找到该房间' } ) );
                }
            } )
        } )
    } );

} );
router.post( "/remove", ( req, res ) =>
{
    var post = "";
    req.on( 'data', ( chunk ) =>
    {
        post += chunk.toString();
    } );
    req.on( 'end', () =>
    {
        const { _id } = query.parse( post );
        db_client.connect( db_connstr, ( err, db ) =>
        {
            if ( !err )
            {
                const collection = db.collection( "linkman" );
                collection.remove( { _id: mongodb.ObjectID( _id ) }, ( err, result ) =>
                {
                    if ( !err )
                    {
                        res.writeHead( 200, { 'Content-Type': `${ get_mime( 'json' ) };charset:utf-8` } );
                        res.end( JSON.stringify( { success: true } ) );
                    } else
                    {
                        res.writeHead( 404, { 'Content-Type': `${ get_mime( 'json' ) };charset:utf-8` } );
                        res.end( JSON.stringify( { message: '无法删除' } ) );
                    }
                } )

            } else
            {
                res.writeHead( 404, { 'Content-Type': `${ get_mime( 'json' ) };charset:utf-8` } );
                res.end( JSON.stringify( { message: '服务器无法找到' } ) );
            }
            db.close();
        } )
    } )

} )


router.post( "/update", ( req, res ) =>
{
    //操作
    var post = '';
    req.on( "data", ( chunk ) =>
    {
        post += chunk.toString();
    } );
    req.on( "end", () =>
    {

        //验证
        const token = req.headers.token;
        db_client.connect( db_connstr, ( err, db ) =>
        {
            let u = db.collection( "user" );
            u.findOne( { token }, ( err, result ) =>
            {
                if ( !result )
                {
                    // 验证成功，继续操作
                    db_client.connect( db_connstr, ( err, db ) =>
                    {
                        const post_body = query.parse( post );
                        const { name, idnum, mobile,  remark, id } = post_body;
                        const c = db.collection( "linkman" );
                        c.update( { _id: mongodb.ObjectID( id ) }, {
                            $set: { name, idnum, mobile,  remark }
                        }, ( err, result ) =>
                            {
                                if ( !err )
                                {
                                    res.writeHead( 200, { 'Content-Type': `${ get_mime( 'json' ) };charset=UTF-8` } );
                                    res.end( JSON.stringify( { success: true } ) );
                                }
                                db.close();
                            } );
                    } );
                } else
                {
                    //验证失败
                    res.writeHead( 401, { 'Content-Type': `${ get_mime( 'json' ) };charset=UTF-8` } );
                    res.end( '此操作需要验证身份' )
                }
                db.close();
            } );
        } );
    } );
} );




module.exports = router;
