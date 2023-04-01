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
      yourself:{
        type:String,
        required:true
      },
      company:{
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
      isVerified:{
        type:Boolean,
        default:false
      },
      
      status:{
        type:Boolean,
        default:true
      },
      createdAt:{
        type:Date,
        default:Date.now
      },
      
})
const EmployerModel=monggose.model('employer',Employerschema)
module.exports=EmployerModel