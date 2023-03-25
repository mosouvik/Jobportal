const mongoose=require('mongoose')
const Schema=mongoose.Schema
const aboutSchema=new Schema({
    point:{
        type:String,
        required:true,
    },
    status:{
        type:Boolean,
        default:true
    }
})
const aboutModel= mongoose.model('about',aboutSchema)
module.exports=aboutModel



