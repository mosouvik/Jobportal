const UserModel = require('../model/user');
const EmployerModel = require('../model/employer')
const PostModel = require('../model/post');
const categorymodel = require('../model/category');
const AboutModel = require('../model/about')
const AcitvityModel = require('../model/activity')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const ActivityModel = require('../model/activity');

const index = (req, res) => {
    categorymodel.find().then(result => {
        PostModel.find().limit(5).then(result2 => {
            res.render('./user/index', {
                title: "home page",
                message: req.flash('message'),
                error: req.flash('error'),
                displayData: result,
                data: req.user,
                displayData2: result2
            })
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })

}

const job = (req, res) => {
    PostModel.find().then(result => {
        res.render('./user/job', {
            title: "job list page",
            data: req.user,
            displayData: result
        })
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
const register_emp = (req, res) => {
    res.render('./user/register_emp', {
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


const registercreate_emp = (req, res) => {
    const image = req.file
    const userdata = new EmployerModel({

        name: req.body.name,
        email: req.body.email,
        email_pass: req.body.emailpassword,
        contact: req.body.contact,
        address: req.body.address,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
        image: image.path
    })
    userdata.save().then(data => {
        console.log(data, "Registration added successfully");
        req.flash('message', "Registration successfull..")
        res.redirect('/login_emp')
    }).catch(err => {
        console.log(err);
        req.flash('error', "Registration unsuccessfull..")
        // req.flash('alert', 'alert-danger')

        res.redirect('/register_emp')
    })
}
const login = (req, res) => {
    loginData = {}
    loginData.email = (req.cookies.email) ? req.cookies.email : undefined,
        loginData.password = (req.cookies.password) ? req.cookies.password : undefined,
        res.render('./user/login', {
            title: "login page",
            message: req.flash('message'),
            error: req.flash('error'),
            data1: loginData,
            data: req.user
        })
}
const login_emp = (req, res) => {
    loginData = {}
    loginData.email = (req.cookies.email) ? req.cookies.email : undefined,
        loginData.password = (req.cookies.password) ? req.cookies.password : undefined,
        res.render('./user/login_emp', {
            title: "login page",
            message: req.flash('message'),
            error: req.flash('error'),
            data1: loginData,
            data: req.user
        })
}

const logincreate = (req, res) => {
    UserModel.findOne({
        email: req.body.email
    }, (err, data) => {

        if (data) {
            if (data.status) {
                const haspassword = data.password

                if (bcrypt.compareSync(req.body.password, haspassword)) {
                    const token = jwt.sign({
                        id: data._id,
                        name: data.name,
                        pic: data.image
                    }, 'souvikmondalhelowelcome@123456789', { expiresIn: '10m' })
                    res.cookie('userToken', token)
                    if (req.body.rememberme) {
                        res.cookie('email', req.body.email);
                        res.cookie('password', req.body.password)
                    }
                    console.log(data, "login successfully");


                    req.flash('message', "Login successfully..")

                    res.redirect('/postjob')
                } else {
                    req.flash('message', "Login successfully..")
                    res.redirect('/')
                

                } else {
                    console.log("password incorect");
                    req.flash('error', "Password Incorrect")
                    res.redirect('/login')
                }

            } else {
                req.flash('error', 'Admin has blocked your account')
                res.redirect('/login')
            }
        } else {
            console.log("invalid email hi");
            req.flash('error', "No User found with thet email")
            res.redirect('/login')
        }
    })
}

const logincreate_emp = (req, res) => {
    EmployerModel.findOne({
        email: req.body.email
    }, (err, data) => {

        if (data) {
            if (data.status) {
                const haspassword = data.password

                if (bcrypt.compareSync(req.body.password, haspassword)) {
                    const token = jwt.sign({
                        id: data._id,
                        name: data.name,
                        isEmployer: true,
                        pic: data.image
                    }, 'souvikmondalhelowelcome@123456789', { expiresIn: '10m' })
                    res.cookie('userToken', token)
                    if (req.body.rememberme) {
                        res.cookie('email', req.body.email);
                        res.cookie('password', req.body.password)
                    }
                    console.log(data, "login successfully");


                    req.flash('message', "Login successfully..")

                    res.redirect('/')


                } else {
                    console.log("password incorect");
                    req.flash('error', "Password Incorrect")
                    res.redirect('/login_emp')
                }
            } else {
                req.flash('error', 'Admin has blocked your account')
                res.redirect('/login_emp')
            }


        } else {
            console.log("invalid email");
            req.flash('error', "No User found with thet email")
            res.redirect('/login_emp')
        }
    })
}


const postjob = (req, res) => {
    const emp_status = req.user.isEmployer
    if (emp_status) {
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
    const id = req.user.id
    console.log(id);

    const postdata = new PostModel({

        jobtitle: req.body.jobtitle,
        emp_id: id,
        company: req.body.company,
        location: req.body.location,
        short_des: req.body.short_des,
        full_des: req.body.full_des,
        salary: req.body.salary,
        category: req.body.category,
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
        data: req.user,
        message: req.flash('message')
    })
}



const about = (req, res) => {
    AboutModel.find().then(result => {
        res.render('./user/about', {
            title: "About page",
            data: req.user,
            displayData: result
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

const cat = (req, res) => {
    res.render('./user/cat')
}

const catc = (req, res) => {
    const image = req.file
    const result = new categorymodel({
        category: req.body.category,
        image: image.path
    })
    result.save().then(data => {
        console.log(data);
        res.redirect('/cat')
    }).catch(err => {
        console.log(err);
    })
}

// Send Email

const sendemail = (req, res) => {
    UserModel.findOne({
        email: req.body.email,
    }).then((user) => {
        if (user) {
            const email = user.email
            const password = user.email_pass

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
                from: req.body.name,
                to: "msouvik112@gmail.com",
                subject: req.body.subject,
                text: req.body.name + ' here' + '\n' + req.body.message
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

//,.,..Category

const Education_Training = (req, res) => {
    PostModel.aggregate([{
        $match: { "category": "Education-Training" }
    }]).then(result => {
        res.render('./user/job', {
            title: "Education-Training",
            data: req.user,
            displayData: result
        })
    })
}
const Medical_Pharma = (req, res) => {
    PostModel.aggregate([{
        $match: { "category": "Medical-Pharma" }
    }]).then(result => {
        res.render('./user/job', {
            title: "Medical_Pharma",
            data: req.user,
            displayData: result
        })
    })
}

const Computer_Programing = (req, res) => {
    PostModel.aggregate([{
        $match: { "category": "Computer-Programing" }
    }]).then(result => {
        res.render('./user/job', {
            title: "Computer-Programing",
            data: req.user,
            displayData: result
        })
    })
}

const Customer_Support = (req, res) => {
    PostModel.aggregate([{
        $match: { "category": "Customer-Support" }
    }]).then(result => {
        res.render('./user/job', {
            title: "Customer-Support",
            data: req.user,
            displayData: result
        })
    })
}

const Design_Multimedia = (req, res) => {
    PostModel.aggregate([{
        $match: { "category": "Design-Multimedia" }
    }]).then(result => {
        res.render('./user/job', {
            title: "Design-Multimedia",
            data: req.user,
            displayData: result
        })
    })
}
const Web_Development = (req, res) => {
    PostModel.aggregate([{
        $match: { "category": "Web-Development" }
    }]).then(result => {
        res.render('./user/job', {
            title: "Web-Development",
            data: req.user,
            displayData: result
        })
    })
}
const Engineer_Architects = (req, res) => {
    PostModel.aggregate([{
        $match: { "category": "Engineer-Architects" }
    }]).then(result => {
        res.render('./user/job', {
            title: "Engineer-Architects",
            data: req.user,
            displayData: result
        })
    })
}
const Sales_Marketing = (req, res) => {
    PostModel.aggregate([{
        $match: { "category": "Sales-Marketing" }
    }]).then(result => {
        res.render('./user/job', {
            title: "Sales-Marketing",
            data: req.user,
            displayData: result
        })
    })
}

const Full_Time = (req, res) => {
    PostModel.aggregate([{
        $match: { "job_nature": "Full-Time" }
    }]).then(result => {
        res.render('./user/job', {
            title: "Full-Time",
            data: req.user,
            displayData: result
        })
    })
}
const Part_Time = (req, res) => {
    PostModel.aggregate([{
        $match: { "job_nature": "Part-Time" }
    }]).then(result => {
        res.render('./user/job', {
            title: "Part-Time",
            data: req.user,
            displayData: result
        })
    })
}
const Freelancer = (req, res) => {
    PostModel.aggregate([{
        $match: { "job_nature": "Freelancer" }
    }]).then(result => {
        res.render('./user/job', {
            title: "Freelancer",
            data: req.user,
            displayData: result
        })
    })
}

const view_job = (req, res) => {
    const id = req.params.id
    const u_id = req.user.id
    PostModel.findById(id).then(result => {
        ActivityModel.aggregate([
            {
                $match:
                {
                    "user_id": `${u_id}`,
                    "post_id": `${id}`
                }
            }
        ]).then(result2 => {

            res.render('./user/job_details', {
                title: 'Job Details',
                data: req.user,
                displayData: result,
                displayData2: result2,
                message: req.flash('message'),
                error:req.flash('error')
            })

        })

    })

}

const apply = (req, res) => {
    
    const p_id = req.params.id
    console.log(p_id);
    const u_id = req.user.id
    if(!req.user.isEmployer){
    PostModel.findById(p_id).then(result => {
        console.log(result);
        UserModel.findById(u_id).then(result2 => {

            const save_data = new AcitvityModel({
                user_id: `${result2._id}`,
                user_name: result2.name,
                post_id: `${result._id}`,
                post_title: result.jobtitle,
                location: result.location,
                image: `${result.image}`,
                category: result.category,
                post_company: result.company,
                status: true
            })
            const data_save = save_data.save().then(result3 => {
                req.flash('message', "Job Applied Successfully")
                res.redirect(`/viewjob/${result._id}`)
            })
        })
    })
}else{
    req.flash('error','Employer cannot apply for jobs')
    res.redirect(`/`)
}
}


const appliedjobs = (req, res) => {
    if (!req.user.isEmployer) {
        const id = req.user.id
        ActivityModel.aggregate([
            { $match: { "user_id": `${id}` } }
        ]).then(result => {
            console.log(result);
            res.render('./user/applied', {
                title: "Applied Jobs",
                data: req.user,
                displayData: result
            })
        })
    }else{
        req.flash('error',"Employer cannot have applied jobs")
        res.redirect('/')
    }
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
    sendemail,
    register_emp,
    logincreate_emp,
    registercreate_emp,
    login_emp,
    Education_Training,
    Medical_Pharma,
    Computer_Programing,
    Customer_Support,
    Design_Multimedia,
    Web_Development,
    Engineer_Architects,
    Sales_Marketing,
    Full_Time,
    Part_Time,
    Freelancer,
    view_job,
    apply,
    appliedjobs
}