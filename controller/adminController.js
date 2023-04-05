const UserModel = require('../model/user');
const PostModel = require('../model/post')
const CategoryModel = require('../model/category');
const ContactModel = require('../model/contact');
const AboutModel = require('../model/about')
const EmployerModel = require('../model/employer');
const ActivityModel = require('../model/activity');
const TeamModel = require('../model/team');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const login = (req, res) => {
    res.render('./admin/login', {
        title: "admin || login",
        message: req.flash('message'),

    })
}

const logincreate = (req, res) => {
    UserModel.findOne({
        email: req.body.email
    }, (err, data) => {
        if (data) {
            if (data.isAdmin == true) {
                const haspassword = data.password
                if (bcrypt.compareSync(req.body.password, haspassword)) {
                    const token = jwt.sign({
                        id: data._id,
                        name: data.name,
                        pic: data.image
                    }, 'souvik413@ggmondal134@56789', { expiresIn: '1h' })
                    res.cookie('AdminToken', token)
                    if (req.body.rememberme) {
                        res.cookie('email', req.body.email)
                        res.cookie('password', req.body.password)
                    }
                    console.log(data);
                    res.redirect('/admin/dashboard')
                } else {
                    console.log("Incorrect password");
                    res.redirect('/admin/')
                }
            } else {
                req.flash('message', "You are not an Admin")
                res.redirect('/admin/')
            }

        } else {
            console.log("Incorrect email");
            res.redirect('/admin/')
        }
    })
}

const dashboard = (req, res) => {
    PostModel.find().then(result => {
        UserModel.find().then(result1 => {
            EmployerModel.find().then(result2 => {
                CategoryModel.find().then(result3 => {
                    ActivityModel.find().then(result4 => {
                        ContactModel.find().then(result5 => {
                            TeamModel.find().then(result6 => {
                                res.render('./admin/dashboard', {
                                    title: "Admin || Dashboard",
                                    data: req.admin,
                                    post_data: result,
                                    jobseeker_data: result1,
                                    emp_data: result2,
                                    cat_data: result3,
                                    act_data: result4,
                                    cont_data: result5,
                                    team_data: result6

                                })
                            })

                        })

                    })

                })

            })

        })

    })



}

const adminauth = (req, res, next) => {
    if (req.admin) {
        console.log(req.admin);
        next();
    } else {
        console.log(req.admin);
        req.flash('message', "can not access this page ..please login first")
        res.redirect('/admin/')
    }
}



const logout = (req, res) => {
    res.clearCookie('AdminToken')
    res.redirect('/admin/')
}


const jobpost = (req, res) => {
    PostModel.aggregate([
        {
            $lookup: {
                from: "employers",
                localField: "name",
                foreignField: "emp_id",
                as: "emp_details"
            }
        },
        {
            $sort: { "createdAt": 1 }

        }
    ]).then(result => {
        res.render('./admin/jobpost', {
            title: 'Admin || jobpost page',
            data: req.admin,
            displayData: result
        })
    }).catch(err => {
        console.log(err);
    })

}

const jobseeker = (req, res) => {
    UserModel.find().then(result => {
        res.render('./admin/jobseeker', {
            title: "Jobseeker",
            data: req.admin,
            displayData: result
        })
    })
}

const deactivejobseeker = (req, res) => {
    const id = req.params.id
    UserModel.findByIdAndUpdate(id, { status: false }).then(result => {
        console.log(result, "Deactived jobseeker");
        res.redirect('/admin/jobseeker')
    }).catch(err => {
        console.log(err);
    })
}

const activejobseeker = (req, res) => {
    const id = req.params.id
    UserModel.findByIdAndUpdate(id, { status: true }).then(result => {
        console.log(result, "Deactived jobseeker");
        res.redirect('/admin/jobseeker')
    }).catch(err => {
        console.log(err);
    })
}
const jobcategory = (req, res) => {
    CategoryModel.find().then(result => {
        res.render('./admin/jobcategory', {
            title: "Admin || Jobcategory",
            data: req.admin,
            cat_data: result,
            message:req.flash('message'),
            error:req.flash('error'),

        })
    }).catch(err => {
        console.log(err);
    })

}


const categorycreate=(req,res)=>{
    const image=req.file
    CategoryModel({
        category:req.body.category,
        image:image.path
    }).save().then(result=>{
        req.flash('message',"Category added successfull..")
        res.redirect('/admin/jobcategory')
    }).catch(err=>{
        req.flash('error',"Category not added")
        res.redirect('/admin/jobcategory')
    })
}

const activecategory = (req, res) => {
    const id = req.params.id
    CategoryModel.findByIdAndUpdate(id, { status: true }).then(result => {
        PostModel.updateMany(
            { "category": `${result.category}` },
            { "status": true }).then(result2 => {
                console.log(result, "Actived category");
                res.redirect('/admin/jobcategory')
            }).catch(err => {
                console.log(err);
            })
    }).catch(err => {
        console.log(err);
    })

}

const deactivecategory = (req, res) => {
    const id = req.params.id
    CategoryModel.findByIdAndUpdate(id, { status: false }).then(result => {
        PostModel.updateMany(
            { "category": `${result.category}` },
            { "status": false }).then(result2 => {
                console.log(result2, "Actived category");
                res.redirect('/admin/jobcategory')
            }).catch(err => {
                console.log(err);
            })
    }).catch(err => {
        console.log(err);
    })
}


const about = (req, res) => {
    AboutModel.find().then(result => {
        res.render('./admin/about', {
            title: "Admin || About page",
            data: req.admin,
            displayData: result,
            message:req.flash('message'),
            error:req.flash('error')
        })
    })

}


const aboutcreate=(req,res)=>{
    AboutModel({
        point:req.body.point
    }).save().then(result=>{
        req.flash('message',"About added successfull..")
        res.redirect('/admin/about')
    }).catch(err=>{
        req.flash('error',"About not added")
        res.redirect('/admin/about')

    })
}

const activeabout = (req, res) => {
    const id = req.params.id
    AboutModel.findByIdAndUpdate(id, { status: true }).then(result => {
        console.log(result, "Actived about");
        res.redirect('/admin/about')
    }).catch(err => {
        console.log(err);
    })
}

const deactiveabout = (req, res) => {
    const id = req.params.id
    AboutModel.findByIdAndUpdate(id, { status: false }).then(result => {
        console.log(result, "Deactived about");
        res.redirect('/admin/about')
    }).catch(err => {
        console.log(err);
    })
}

//.....ac/dc post
const activejob = (req, res) => {
    const post_id = req.params.id
    PostModel.findByIdAndUpdate(post_id, { status: true }).then(result => {
        res.redirect('/admin/jobpost')
    }
    )
}
const deactivejob = (req, res) => {
    const post_id = req.params.id
    PostModel.findByIdAndUpdate(post_id, { status: false }).then(result => {
        res.redirect('/admin/jobpost')
    }
    )
}

const employer = (req, res) => {
    EmployerModel.find().then(result => {
        res.render('./admin/employer', {
            title: "Employer",
            data: req.admin,
            displayData: result
        })
    })
}

const activeemployer = (req, res) => {
    const id = req.params.id
    EmployerModel.findByIdAndUpdate(id, { status: true }).then(result => {
        console.log(result, "actived employer");
        res.redirect('/admin/employer')
    }).catch(err => {
        console.log(err);
    })
}

const deactiveemployer = (req, res) => {
    const id = req.params.id
    EmployerModel.findByIdAndUpdate(id, { status: false }).then(result => {
        console.log(result, "Deactived employer");
        res.redirect('/admin/employer')
    }).catch(err => {
        console.log(err);
    })
}

// activity..
const activity = (req, res) => {
    ActivityModel.find().sort('-appliedAt').then(result => {
        res.render('./admin/activity', {
            title: "Admin || Activity page",
            data: req.admin,
            displayData: result,
        })
    }).catch(err => {
        console.log(err);
    })

}


const contact = (req, res) => {
    ContactModel.find().sort('-appliedAt').then(result => {
        console.log(result);
        res.render('./admin/contact', {
            title: "Admin || Contact page",
            data: req.admin,
            displayData: result,
        })
    }).catch(err => {
        console.log(err);
    })

}


const team = (req, res) => {
    TeamModel.find().then(result => {
        res.render('./admin/team', {
            title: "Admin || Team page",
            data: req.admin,
            displayData: result,
            message:req.flash('message'),
            error:req.flash('error')

        })
    }).catch(err => {
        console.log(err);
    })

}

const teamcreat = (req, res) => {
    const image = req.file
    TeamModel({
        name: req.body.name,
        image: image.path,
        message: req.body.message
    }).save().then(result => {
        console.log(result);
        req.flash('message',"Team added successfull..")

        res.redirect('/admin/team')
    }).catch(err => {
        console.log(err);
        req.flash('error',"Team added successfull..")
        res.redirect('/admin/team')

    })
}

const activeteam = (req, res) => {
    const id = req.params.id
    TeamModel.findByIdAndUpdate(id, { status: true }).then(result => {
        console.log(result, "actived team");
        res.redirect('/admin/team')
    }).catch(err => {
        console.log(err);
    })
}

const deactiveteam = (req, res) => {
    const id = req.params.id
    TeamModel.findByIdAndUpdate(id, { status: false }).then(result => {
        console.log(result, "deactived team");
        res.redirect('/admin/team')
    }).catch(err => {
        console.log(err);
    })
}


module.exports = {
    team,
    teamcreat,
    activeteam,
    deactiveteam,
    login,
    logincreate,
    dashboard,
    adminauth,
    logout,
    jobpost,
    jobseeker,
    activejobseeker,
    deactivejobseeker,
    jobcategory,
    categorycreate,
    activecategory,
    deactivecategory,
    about,
    aboutcreate,
    activeabout,
    deactiveabout,
    activejob,
    deactivejob,
    employer,
    activeemployer,
    deactiveemployer,

    activity,
    contact
}