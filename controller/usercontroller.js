const UserModel = require('../model/user');
const EmployerModel = require('../model/employer')
const PostModel = require('../model/post');
const categorymodel = require('../model/category');
const AboutModel = require('../model/about')
const AcitvityModel = require('../model/activity');
const ContactModel = require('../model/contact');
const TokenModel = require('../model/token');
const Teammodel = require('../model/team');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const ActivityModel = require('../model/activity');

const index = (req, res) => {


    categorymodel.find().then(result => {
        PostModel.find().limit(5).sort("-createdAt").then(result2 => {

            res.render('./user/index', {
                title: "home page",
                message: req.flash('message'),
                error: req.flash('error'),
                displayData: result,
                data: req.user,
                displayData2: result2,

            })
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })



}

const job = (req, res) => {


    PostModel.find().sort('-createdAt').then(result => {
        categorymodel.find().then(result2 => {

            res.render('./user/job', {
                title: "job list page",
                data: req.user,
                displayData: result,
                displayData2: result2
            })
        })

    })



}

const register = (req, res) => {

    res.render('./user/register', {
        title: " register page",
        message: req.flash('message'),
        error: req.flash('error'),
        data: req.user,

    })
}
const register_emp = (req, res) => {

    res.render('./user/register_emp', {
        title: " register page",
        message: req.flash('message'),
        error: req.flash('error'),
        data: req.user,

    })

}

const registercreate = (req, res) => {
    const image = req.file
    const userdata = new UserModel({

        name: req.body.name,
        email: req.body.email,
        skills: req.body.skills,
        experience: req.body.experience,
        yourself: req.body.yourself,
        contact: req.body.contact,
        address: req.body.address,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
        image: image.path
    })
    userdata.save((err, user) => {
        if (!err) {
            TokenModel({
                _userid: user._id,
                token: crypto.randomBytes(16).toString('hex')
            }).save((err, token) => {
                if (!err) {
                    var transpoter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth: {
                            user: "dassouvik9991@gmail.com",
                            pass: "xvyosdscrianoksg",
                        }
                    });
                    var mailOptions = {
                        from: 'no-reply@souvik.com',
                        to: user.email,
                        subject: 'Acount Verification',
                        text: 'Hello ' + req.body.name + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n'
                    };
                    transpoter.sendMail(mailOptions, function (err) {
                        if (err) {
                            console.log("Technical Issuu....");
                        } else {
                            req.flash('message', "A Verfication Email Sent To Your Mail ID.... Please Verify By Click The Link.... It Will Expire By 24 Hrs...")
                            res.redirect('/register')
                        }
                    })
                } else {
                    console.log("Error When Create Token...", err);
                }
            })
        } else {
            console.log("Error When Create User....", err);
        }
    })

}


const userconfirmation = (req, res) => {
    TokenModel.findOne({ token: req.params.token }, (err, token) => {
        if (!token) {
            console.log("Verification Link May Be Expired :(");
            res.redirect('/register')
        } else {
            UserModel.findOne({ _id: token._userid, email: req.params.email }, (err, user) => {
                if (!user) {
                    req.flash('error', "User Not found");
                    res.redirect('/register')
                } else if (user.isVerified) {
                    req.flash("error", "User Already Verified");
                    res.redirect('/register')
                } else {
                    user.isVerified = true;
                    user.save().then(result => {
                        req.flash("message", "Your Account Verified Successfully");
                        res.redirect('/login')
                    }).catch(err => {
                        console.log("Something Went Wrong...", err);
                    })
                }
            })
        }
    })
}




const registercreate_emp = (req, res) => {
    const image = req.file
    const userdata = new EmployerModel({

        name: req.body.name,
        email: req.body.email,
        yourself: req.body.yourself,
        company: req.body.company,

        contact: req.body.contact,
        address: req.body.address,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
        image: image.path
    })
    userdata.save((err, user) => {
        if (!err) {
            TokenModel({
                _userid: user._id,
                token: crypto.randomBytes(16).toString('hex')
            }).save((err, token) => {
                if (!err) {
                    var transpoter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth: {
                            user: "dassouvik9991@gmail.com",
                            pass: "xvyosdscrianoksg",
                        }
                    });
                    var mailOptions = {
                        from: 'no-reply@souvik.com',
                        to: user.email,
                        subject: 'Acount Verification',
                        text: 'Hello ' + req.body.name + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/empconfirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n'
                    };
                    transpoter.sendMail(mailOptions, function (err) {
                        if (err) {
                            console.log("Technical Issuu....");
                        } else {
                            req.flash('message', "A Verfication Email Sent To Your Mail ID.... Please Verify By Click The Link.... It Will Expire By 24 Hrs...")
                            res.redirect('/register_emp')
                        }
                    })
                } else {
                    console.log("Error When Create Token...", err);
                }
            })
        } else {
            console.log("Error When Create User....", err);
        }
    })
}



const empconfirmation = (req, res) => {
    TokenModel.findOne({ token: req.params.token }, (err, token) => {
        if (!token) {
            console.log("Verification Link May Be Expired :(");
            res.redirect('/register_emp')
        } else {
            EmployerModel.findOne({ _id: token._userid, email: req.params.email }, (err, user) => {
                if (!user) {
                    req.flash('error', "User Not found");
                    res.redirect('/register_emp')
                } else if (user.isVerified) {
                    req.flash("error", "User Already Verified");
                    res.redirect('/register_emp')
                } else {
                    user.isVerified = true;
                    user.save().then(result => {
                        req.flash("message", "Your Account Verified Successfully");
                        res.redirect('/login_emp')
                    }).catch(err => {
                        console.log("Something Went Wrong...", err);
                    })
                }
            })
        }
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
            if (data.isVerified) {

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
                req.flash('error', 'Verify your account first');
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
            if (data.isVerified) {
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

                        res.redirect('/postjob')


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
                req.flash('error', 'Verify account first')
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
    EmployerModel.findById(req.user.id).then(result3 => {
        const emp_status = req.user.isEmployer
        if (emp_status) {
            res.render('./user/postjob', {
                title: "Post job page",
                message: req.flash('message'),
                error: req.flash('error'),
                data: req.user,
                emp_data: result3
            })
        } else {
            req.flash('error', "You are not Employer...")

            res.redirect('/')
        }

    })
}

const postcreate = (req, res) => {
    const image = req.file
    const name = req.user.name
    console.log(name);

    const postdata = new PostModel({

        jobtitle: req.body.jobtitle,
        emp_name: name,
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
        message: req.flash('message'),
        error: req.flash('error'),


    })



}



const about = (req, res) => {


    AboutModel.find().then(result => {
        Teammodel.find().then(result2 => {

            res.render('./user/about', {
                title: "About page",
                data: req.user,
                displayData: result,

                team: result2,
            })
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

const contactcreate = (req, res) => {
    const cdata = new ContactModel({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        contact: req.body.contact,
        message: req.body.message
    })
    cdata.save().then(result => {
        req.flash('message', "Contact added successfull");
        res.redirect('/contact')
    }).catch(err => {
        req.flash('error', "Contact data not added.");
        res.redirect('/contact')
    })
}



//,.,..Category

const Education_Training = (req, res) => {


    PostModel.aggregate([{
        $match: { "category": "Education-Training" }

    },
    { $sort: { 'createdAt': -1 } }
    ]).then(result => {
        categorymodel.find().then(result2 => {
            res.render('./user/job', {
                title: "Education-Training",
                data: req.user,
                displayData: result,
                displayData2: result2
            })
        })

    })


}
const Medical_Pharma = (req, res) => {


    PostModel.aggregate([{
        $match: { "category": "Medical-Pharma" }
    },
    { $sort: { 'createdAt': -1 } }
    ]).then(result => {
        categorymodel.find().then(result2 => {
            res.render('./user/job', {
                title: "Medical-Pharma",
                data: req.user,
                displayData: result,
                displayData2: result2
            })
        })

    })



}

const Computer_Programing = (req, res) => {


    PostModel.aggregate([{
        $match: { "category": "Computer-Programing" }
    },
    { $sort: { 'createdAt': -1 } }
    ]).then(result => {
        categorymodel.find().then(result2 => {
            res.render('./user/job', {
                title: "Computer-Programing",
                data: req.user,
                displayData: result,
                displayData2: result2
            })
        })

    })


}

const Customer_Support = (req, res) => {

    PostModel.aggregate([{
        $match: { "category": "Customer-Support" }
    },
    { $sort: { 'createdAt': -1 } }
    ]).then(result => {
        categorymodel.find().then(result2 => {
            res.render('./user/job', {
                title: "Customer-Support",
                data: req.user,
                displayData: result,
                displayData2: result2
            })
        })

    })

}

const Design_Multimedia = (req, res) => {


    PostModel.aggregate([{
        $match: { "category": "Design-Multimedia" }
    },
    { $sort: { 'createdAt': -1 } }
    ]).then(result => {
        categorymodel.find().then(result2 => {
            res.render('./user/job', {
                title: "Design-Multimedia",
                data: req.user,
                displayData: result,
                displayData2: result2
            })
        })

    })

}
const Web_Development = (req, res) => {


    PostModel.aggregate([{
        $match: { "category": "Web-Development" }
    },
    { $sort: { 'createdAt': -1 } }
    ]).then(result => {
        categorymodel.find().then(result2 => {
            res.render('./user/job', {
                title: "Web-Development",
                data: req.user,
                displayData: result,
                displayData2: result2
            })
        })

    })


}
const Engineer_Architects = (req, res) => {


    PostModel.aggregate([{
        $match: { "category": "Engineer-Architects" }
    },
    { $sort: { 'createdAt': -1 } }
    ]).then(result => {
        categorymodel.find().then(result2 => {
            res.render('./user/job', {
                title: "Engineer-Architects",
                data: req.user,
                displayData: result,
                displayData2: result2
            })
        })

    })


}
const Sales_Marketing = (req, res) => {


    PostModel.aggregate([{
        $match: { "category": "Sales-Marketing" }
    },
    { $sort: { 'createdAt': -1 } }
    ]).then(result => {
        categorymodel.find().then(result2 => {
            res.render('./user/job', {
                title: "Sales-Marketing",
                data: req.user,
                displayData: result,
                displayData2: result2
            })
        })

    })


}

const Full_Time = (req, res) => {


    PostModel.aggregate([{
        $match: { "job_nature": "Full-Time" }
    },
    { $sort: { 'createdAt': -1 } }
    ]).then(result => {
        categorymodel.find().then(result2 => {

            res.render('./user/job', {
                title: "Full-Time",
                data: req.user,
                displayData: result,
                displayData2: result2
            })
        })
    })


}
const Part_Time = (req, res) => {

    PostModel.aggregate([{
        $match: { "job_nature": "Part-Time" }
    },
    { $sort: { 'createdAt': -1 } }
    ]).then(result => {
        categorymodel.find().then(result2 => {

            res.render('./user/job', {
                title: "Part-Time",
                data: req.user,
                displayData: result,
                displayData2: result2
            })
        })
    })
}
const Freelancer = (req, res) => {


    PostModel.aggregate([{
        $match: { "job_nature": "Freelancer" }
    },
    { $sort: { 'createdAt': -1 } }
    ]).then(result => {
        categorymodel.find().then(result2 => {

            res.render('./user/job', {
                title: "Freelancer",
                data: req.user,
                displayData: result,
                displayData2: result2
            })
        })
    })

}

const view_job = (req, res) => {
    EmployerModel.findById(req.user.id).then(result3 => {
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
                    error: req.flash('error'),
                    emp_data: result3
                })

            })

        })

    })
}

const apply = (req, res) => {

    const p_id = req.params.id
    console.log(p_id);
    const u_id = req.user.id
    if (!req.user.isEmployer) {
        PostModel.findById(p_id).then(result => {
            console.log(result);
            UserModel.findById(u_id).then(result2 => {

                const save_data = new AcitvityModel({
                    user_id: `${result2._id}`,
                    user_name: result2.name,
                    emp_name: result.emp_name,
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
    } else {
        req.flash('error', 'Employer cannot apply for jobs')
        res.redirect(`/`)
    }
}


const appliedjobs = (req, res) => {
    EmployerModel.findById(req.user.id).then(result3 => {
        if (!req.user.isEmployer) {
            const id = req.user.id
            ActivityModel.aggregate([
                { $match: { "user_id": `${id}` } }
            ]).then(result => {
                console.log(result);
                res.render('./user/applied', {
                    title: "Applied Jobs",
                    data: req.user,
                    displayData: result,
                    emp_data: result3
                })
            })
        } else {
            req.flash('error', "Employer cannot have applied jobs")
            res.redirect('/')
        }
    })
}


// search..
const search = (req, res) => {
    if (req.user) {
        EmployerModel.findById(req.user.id).then(result3 => {
            PostModel.aggregate([
                { $match: { company: req.body.input } }
            ]).then(result => {
                categorymodel.find().then(result2=>{
                    console.log(result);
                    res.render('./user/job', {
                        title: "joblist page",
                        data: req.user,
                        displayData: result,
                        emp_data: result3,
                        displayData2:result2
                    })
    
                    })
             
                
            })
        })
    } else {
        PostModel.aggregate([
            { $match: { company: req.body.input } }
        ]).then(result => {
            

         

            categorymodel.find().then(result2=>{
            console.log(result);
            res.render('./user/job', {
                title: "joblist page",
                data: req.user,
                displayData: result,
                displayData2:result2

            })
      
    })
                
            })
      
    }
}

const profile = (req, res) => {
    UserModel.findById(req.user.id).then(result3 => {
        EmployerModel.findById(req.user.id).then(result2 => {
            res.render('./user/profile', {
                title: "Profile",
                data: req.user,
                user_data: result3,
                emp_data: result2
            })
        })
    })
}




// test

const team = (req, res) => {
    res.render('./user/team')
}

const ct = (req, res) => {
    const image = req.file
    Teammodel({
        name: req.body.name,
        image: image.path,
        message: req.body.message,
    }).save().then(result => {
        console.log(result);
        res.redirect('/team')
    })

}


const viewactivity = (req, res) => {
    if (req.user.isEmployer) {
        EmployerModel.findById(req.user.id).then(result2 => {
            PostModel.aggregate([
                { $match: { "emp_name": req.user.name } }
            ]).then(result => {
                console.log(result);
                res.render('./user/viewact', {
                    title: "Activity",
                    data: req.user,
                    displayData: result,
                    emp_data: result2
                })
            })
        })
    }
}
const viewapply = (req, res) => {
    if (req.user.isEmployer) {
        EmployerModel.findById(req.user.id).then(result2 => {
            ActivityModel.aggregate([
                { $match: { "emp_name": req.user.name } }
            ]).then(result => {
                console.log(result);
                res.render('./user/viewapply', {
                    title: "Activity",
                    data: req.user,
                    displayData: result,
                    emp_data: result2
                })
            })
        })
    }
}

const viewprofile = (req, res) => {
    const name = req.params.name
    if (req.user.isEmployer) {
        EmployerModel.findById(req.user.id).then(result2 => {
            UserModel.findOne({ name: name }).then(result => {
                console.log(result);
                res.render('./user/viewprofile', {
                    title: "View Profile",
                    data: req.user,
                    displayData: result,
                    emp_data: result2
                })
            })
        })
    }
}


module.exports = {
    viewprofile,
    viewactivity,
    viewapply,
    team,
    ct,
    index,
    job,
    register,
    registercreate,
    userconfirmation,
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
    contactcreate,
    register_emp,
    empconfirmation,
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
    appliedjobs,
    search,
    profile
}