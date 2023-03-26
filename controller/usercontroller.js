const UserModel = require('../model/user');
const PostModel = require('../model/post');
const categorymodel=require('../model/category');
const AboutModel=require('../model/about')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const nodemailer=require('nodemailer');

const index = (req, res) => {
    categorymodel.find().then(result=>{
        res.render('./user/index', {
            title: "home page",
            message: req.flash('message'),
            error: req.flash('error'),
            displayData:result,
            data: req.user
        })
    }).catch(err=>{
        console.log(err);
    })
    
}

const job = (req, res) => {
    res.render('./user/job', {
        title: "job list page",
        data: req.user
    })
}

const register = (req, res) => {
    res.render('./user/register', {
        title: " register page",
        message: req.flash('message'),
        error: req.flash('error'),
        data: req.user
    })
}

const registercreate = (req, res) => {
    const image = req.file
    const userdata = new UserModel({

        name: req.body.name,
        email: req.body.email,
        email_pass: req.body.emailpassword,
        contact: req.body.contact,
        address: req.body.address,
        isEmployer: req.body.isEmployer,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
        image: image.path
    })
    userdata.save().then(data => {
        console.log(data, "Registration added successfully");
        req.flash('message', "Registration successfull..")
        res.redirect('/login')
    }).catch(err => {
        console.log(err);
        req.flash('error', "Registration unsuccessfull..")
        // req.flash('alert', 'alert-danger')

        res.redirect('/register')
    })
}

const login = (req, res) => {
    loginData={}
    loginData.email=(req.cookies.email )? req.cookies.email :undefined,
    loginData.password=(req.cookies.password) ? req.cookies.password :undefined,
    res.render('./user/login', {
        title: "login page",
        message: req.flash('message'),
        error: req.flash('error'),
        data1:loginData,
        data: req.user
    })
}

const logincreate = (req, res) => {
    UserModel.findOne({
        email: req.body.email
    }, (err, data) => {

        if (data) {
            const haspassword = data.password

            if (bcrypt.compareSync(req.body.password, haspassword)) {
                const token = jwt.sign({
                    id: data._id,
                    name: data.name,
                    isEmployer: data.isEmployer,
                    pic: data.image
                }, 'souvikmondalhelowelcome@123456789', { expiresIn: '10m' })
                res.cookie('userToken', token)
                if (req.body.rememberme) {
                    res.cookie('email', req.body.email);
                    res.cookie('password', req.body.password)
                }
                console.log(data, "login successfully");

                if (data.isEmployer == 'employer') {
                    req.flash('message', "Login successfully..")

                    res.redirect('/postjob')
                } else {
                    req.flash('message', "Login successfully..")
                    res.redirect('/')
                }

            } else {
                console.log("password incorect");
                req.flash('error', "Password Incorrect")
                res.redirect('/login')
            }

        } else {
            console.log("invalid email");
            req.flash('error', "No User found with thet email")
            res.redirect('/login')
        }
    })
}


const postjob = (req, res) => {
    const emp_type = req.user.isEmployer
    if (emp_type == 'employer') {
        res.render('./user/postjob', {
            title: "Post job page",
            message: req.flash('message'),
            error: req.flash('error'),
            data: req.user
        })
    } else {
        req.flash('error', "You are not Employer...")

        res.redirect('/')
    }

}

const postcreate = (req, res) => {
    const image = req.file
    const id=req.user.id
    
    const postdata = new PostModel({

        jobtitle: req.body.jobtitle,
        emp_id:id,
        company: req.body.company,
        location: req.body.location,
        short_des: req.body.short_des,
        full_des: req.body.full_des,
        salary: req.body.salary,
        category:req.body.category,
        job_nature: req.body.job_nature,
        deadline: req.body.deadline,
        image: image.path
    })
    postdata.save().then(data => {
        console.log(data, "jobpost added successfully");
        req.flash('message', "Jobpost added successfully..")
        res.redirect('/postjob')
    }).catch(err => {
        console.log(err);
        req.flash('error', "Jobpost NOT added")
        // req.flash('alert', 'alert-danger')

        res.redirect('/postjob')
    })
}

const contact = (req, res) => {
    res.render('./user/contact', {
        title: "contact page",
        data: req.user
    })
}



const about = (req, res) => {
    AboutModel.find().then(result=>{
        res.render('./user/about', {
            title: "About page",
            data: req.user,
            displayData:result
        })
    })
    
}

const auth = (req, res, next) => {
    if (req.user) {
        console.log(req.user);
        next();
    } else {
        console.log(req.user);
        req.flash('error', "Can not access this page please Login First..")
        res.redirect('/login')
    }
}

const logout = (req, res) => {
    res.clearCookie('userToken');
    res.redirect('/login')
}

const cat=(req,res)=>{
    res.render('./user/cat')
}

const catc=(req,res)=>{
    const image=req.file
    const result=new categorymodel({
        category:req.body.category,
        image:image.path
    })
    result.save().then(data=>{
        console.log(data);
        res.redirect('/cat')
    }).catch(err=>{
        console.log(err);
    })
}

// Send Email

const sendemail = (req, res) => {
    UserModel.findOne({
        email: req.body.email,
    }).then((user) => {
        if (user) {
            const email=user.email
            const password=user.email_pass
            // generate token
                    var transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth: {
                            user: `${email}`,
                            pass: `${password}`                          
                        }
                    });
                    var mailOptions = {
                        from: req.body.email,
                        to:"msouvik112@gmail.com",
                        subject: req.body.subject,
                        text:req.body.message
                    };
                    transporter.sendMail(mailOptions, function (err) {
                        if (err) {
                            console.log("Techniclal Issue...");
                            console.log(err);
                        } else {
                            req.flash("message", "Mail has been sent");
                            res.redirect("/contact");
                        }
                    });
                
            

        } else {
            console.log("Error When Create User...", err);
        }
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
    logincreate,
    contact,
    about,
    auth,
    logout,
    cat,
    catc,
    sendemail
}