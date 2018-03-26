// @ts-nocheck
const mongoose = require( "mongoose" );
const linkman = new mongoose.Schema( {
    name: { type: String },
    idnum: { type: String },
    mobile: { type: String },
    remark: { type: String },
    roomnum: { type: String }
} );
mongoose.model( "linkman", linkman );
