const UserModel = require('../model/user');
const PostModel=require('../model/post')
const bcrypt = require('bcryptjs');

const index = (req, res) => {
    res.render('./user/index', {
        title: "home page",
    })
}

const job=(req,res)=>{
    res.render('./user/job',{
        title:"job list page"
    })
}

const register = (req, res) => {
    res.render('./user/register', {
        title: " register page"
    })
}

const registercreate = (req, res) => {
    const image = req.file
    const userdata = new UserModel({

        name: req.body.name,
        email: req.body.email,
        contact: req.body.contact,
        address: req.body.address,
        isEmployer: req.body.isEmployer,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
        image: image.path
    })
    userdata.save().then(data => {
        console.log(data, "employee added successfully");
        // req.flash('message', "Employee added successfully..")
        res.redirect('/')
    }).catch(err => {
        console.log(err);
        // req.flash('message', "Employee NOT added")
        // req.flash('alert', 'alert-danger')

        res.redirect('/')
    })
}

const login=(req,res)=>{
res.render('./user/login',{
    title:"login page",
})
}


const postjob = (req, res) => {
    res.render('./user/postjob', {
        title: "Post job page"
    })
}

const postcreate=(req,res)=>{
    const image = req.file
    const postdata = new PostModel({

        jobtitle: req.body.jobtitle,
        company: req.body.company,
        location: req.body.location,
        short_des: req.body.short_des,
        full_des:req.body.full_des,
        salary:req.body.salary,
        job_nature:req.body.job_nature,
        deadline:req.body.deadline,
        image: image.path
    })
    postdata.save().then(data => {
        console.log(data, "employee added successfully");
        // req.flash('message', "Employee added successfully..")
        res.redirect('/postjob')
    }).catch(err => {
        console.log(err);
        // req.flash('message', "Employee NOT added")
        // req.flash('alert', 'alert-danger')

        res.redirect('/')
    })
}

const contact=(req,res)=>{
    res.render('./user/contact',{
        title:"contact page"
    })
}

module.exports = {
    index,
    job,
    register,
    registercreate,
    postjob,
    postcreate,
    login,
    contact
}