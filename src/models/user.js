// @ts-nocheck

const mongoose = require( "mongoose" );
const schema = new mongoose.Schema( {
    user_id: { type: String },
    password: { type: String },
    token: { type: String },
} );
mongoose.model( "user", schema );
