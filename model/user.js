const monggose=require('mongoose');
const schema=monggose.Schema;
const Userschema=new schema({
  
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
      skills:{
        type:String,
        required:true
      },
      experience:{
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
      isVerified:{
        type:Boolean,
        default:false
      },
      isAdmin:{
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
const UserModel=monggose.model('user',Userschema)
module.exports=UserModel