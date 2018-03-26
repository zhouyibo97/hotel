// @ts-nocheck
const mongoose = require( "mongoose" );
const total = new mongoose.Schema( {
    totalprice: { type: String },
    day:{type:String}
} );
mongoose.model( "total", total );
