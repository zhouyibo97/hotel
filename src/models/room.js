// @ts-nocheck
const mongoose = require( "mongoose" );
const room = new mongoose.Schema( {
    roomnum: { type: String },
    people: { type: String },
    hadpeople: { type: String },
    price: { type: String },
    allprice: {
        type: String
    }
} );
mongoose.model( "room", room );
