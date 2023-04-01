const monggose = require('mongoose');
const schema = monggose.Schema;
const Activityschema = new schema({

    user_id: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    emp_name: {
        type: String,
        required: true
    },
    post_id: {
        type: String,
        required: true
    },
    post_title: {
        type: String,
        required: true
    },
    post_company: {
        type: String,
        required: true
    },
    image:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },

    status: {
        type: Boolean,
        default: false
    },
    appliedAt:{
        type:Date,
        default:Date.now
    }
})
const ActivityModel = monggose.model('activity', Activityschema)
module.exports = ActivityModel