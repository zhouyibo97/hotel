// @ts-nocheck
const mongoose = require( "mongoose" );
const person = new mongoose.Schema( {
    pname: { type: String },
    pID: { type: String },
    tel: { type: String },
    department: { type: String }
} );
mongoose.model( "person", person );
