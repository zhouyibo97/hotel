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
var total = 0;

router.get( "/listtotal", ( req, res ) =>
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
            let collection = db.collection( "total" );
            let $where = param.keyword ? { day: new RegExp( param.keyword ) } : {}
            collection.find( $where ).sort( { "_id": -1 } ).toArray( ( err, result ) =>
            {
                if ( !err )
                {
                    console.log( 123 );
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



// router.post( "/rcreate", ( req, res ) =>
// {
//     var queryString = url.parse( req.url ).query;

//     var param = query.parse( queryString );
//     var post = '';
//     // 处理post的data事件，拼接数据
//     req.on( 'data', ( chunk ) =>
//     {
//         post += chunk.toString();
//     } );
//     // 当完成时处理数据
//     req.on( 'end', () =>
//     {
//         var post_param = query.parse( post );

//         db_client.connect( db_connstr, ( err, db ) =>
//         {
//             if ( !err )
//             {
//                 let collection1 = db.collection( "room" );
//                 collection1.insert( post_param, ( err, result ) =>
//                 {
//                     if ( !err )
//                     {
//                         res.writeHead( 200, { 'Content-Type': `${ get_mime( 'json' ) };charset:utf-8` } );
//                         res.end( JSON.stringify( { success: true } ) );

//                     } else
//                     {
//                         res.writeHead( 404, { 'Content-Type': `${ get_mime( 'json' ) };charset:utf-8` } );
//                         res.end( JSON.stringify( { message: '服务器无法找到' } ) );
//                     }
//                     db.close();
//                 } )
//             } else
//             {
//                 res.writeHead( 404, { 'Content-Type': `${ get_mime( 'json' ) };charset:utf-8` } );
//                 res.end( JSON.stringify( { message: '服务器无法找到' } ) );
//             }
//         } )

//     } );

// } );
router.post( "/remove3", ( req, res ) =>
{
    var post = "";
    req.on( 'data', ( chunk ) =>
    {
        post += chunk.toString();
    } );
    req.on( 'end', () =>
    {

        // const post_body = query.parse( post );
        // const { roomnum, people, hadpeople, price, allprice, id } = post_body;
        db_client.connect( db_connstr, ( err, db ) =>
        {
            const post_body = query.parse( post );
            const { _id, total,day } = post_body;
            if ( !err )
            {
                const collection = db.collection( "total" );
                // collection.find( { _id: mongodb.ObjectID( _id ) } ).toArray( function ( err, result )
                // {
                //     // console.log( "2222" );
                //     // console.log( result[ 0 ].allprice + "1" );
                //     var allprice = parseInt( ( result[ 0 ].allprice ) );
                //     total = total + allprice;
                //     console.log( total );
                // } )

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


router.post( "/update3", ( req, res ) =>
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
            const c = db.collection( "total" );
            const post_body = query.parse( post );
            const { total, day, id } = post_body;
            c.update( { _id: mongodb.ObjectID( id ) }, {
                $set: { total, day }
            }, ( err, result ) =>
                {
                    if ( !err )
                    {
                        res.writeHead( 200, { 'Content-Type': `${ get_mime( 'json' ) };charset=UTF-8` } );
                        res.end( JSON.stringify( { success: true } ) );
                    }
                    db.close();
                } );

            // let u = db.collection( "user" );
            // u.findOne( { token }, ( err, result ) =>
            // {
            //     if ( !result )
            //     {
            //         // 验证成功，继续操作
            //         db_client.connect( db_connstr, ( err, db ) =>
            //         {
            //             const c = db.collection( "total" );
            //             const post_body = query.parse( post );
            //             const { total, day, _id } = post_body;
            //             c.update( { "total":0 }, {
            //                 $set: { total, day }
            //             }, ( err, result ) =>
            //                 {
            //                     if ( !err )
            //                     {
            //                         res.writeHead( 200, { 'Content-Type': `${ get_mime( 'json' ) };charset=UTF-8` } );
            //                         res.end( JSON.stringify( { success: true } ) );
            //                     }
            //                     db.close();
            //                 } );
            //         } );
            //     } else
            //     {
            //         //验证失败
            //         res.writeHead( 401, { 'Content-Type': `${ get_mime( 'json' ) };charset=UTF-8` } );
            //         res.end( '此操作需要验证身份' )
            //     }
            //     db.close();
            // } );
        } );
    } );
} );


module.exports = router;
