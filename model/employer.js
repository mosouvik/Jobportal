const monggose=require('mongoose');
const schema=monggose.Schema;
const Employerschema=new schema({
  
      name:{
        type:String,
        required:true
      },
      email:{
        type:String,
        required:true
      },
      contact:{
        type:Number,
        required:true
      },
      address:{
        type:String,
        required:true
      },
      image:{
        type:String,
        required:true
      },
      
      password:{
        type:String,
        required:true
      },
      isEmployer:{
        type:Boolean,
        default:true
      },
      
      status:{
        type:Boolean,
        default:true
      },
      createdAt:{
        type:Date,
        default:Date.now
      },
      email_pass:{
        type:String,
        required:true
      }
})
const EmployerModel=monggose.model('employer',Employerschema)
module.exports=EmployerModel