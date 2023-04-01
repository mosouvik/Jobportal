const mongoose=require('mongoose');
const schema=mongoose.Schema;
const teamschema=new schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
})
const teamModel=mongoose.model('team',teamschema);
module.exports=teamModel