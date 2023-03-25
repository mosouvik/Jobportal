const mongoose=require('mongoose');
const schema=mongoose.Schema;
const categoryschema=new schema({
    category:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
})
const categoryModel=mongoose.model('category',categoryschema);
module.exports=categoryModel