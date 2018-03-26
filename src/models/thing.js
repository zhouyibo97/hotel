const mongoose=require("mongoose");
const thing=new mongoose.Schema({
    thingnum:{type:String},
    thingname:{type:String},
    number:{type:String},
    tprice:{type:String}
});
mongoose.model("thing",thing);