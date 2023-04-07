const mongoose = require('mongoose');
const schema = mongoose.Schema;
const postschema = new schema({
    jobtitle: {
        type: String,
        required: true
    },
    emp_name:{
        type:String,
        required:true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required:true
    },
    image: {
        type: String,
        required: true
    },
    short_des: {
        type: String,
        required: true
    },
    full_des: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    category:{
        type:String,
        required:true
    },
    job_nature: {
        type: String,
        required: true
    },
    
    deadline: {
        type: Date,
        required: true
    },
    status:{
        type:Boolean,
        default:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

},
{timestamps: true}
)
const postModel = mongoose.model('post', postschema)
module.exports = postModel