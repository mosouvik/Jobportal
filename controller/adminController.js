const UserModel=require('../model/user');
const PostModel=require('../model/post')
const CategoryModel=require('../model/category');
const AboutModel=require('../model/about')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');



const login=(req,res)=>{
   res.render('./admin/login',{
    title:"admin || login",
    message:req.flash('message'),
    
   })
}

const logincreate=(req,res)=>{
    UserModel.findOne({
        email: req.body.email
    }, (err, data) => {
        if (data) {
            if (data.isAdmin==true) {
                const haspassword = data.password
                if (bcrypt.compareSync(req.body.password, haspassword)) {
                    const token = jwt.sign({
                        id: data._id,
                        name: data.name,
                        pic:data.image
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
            }else{
                req.flash('message',"You are not an Admin")
                res.redirect('/admin/')
            }
           
        } else {
            console.log("Incorrect email");
            res.redirect('/admin/')
        }
    })
}

const dashboard=(req,res)=>{
    PostModel.aggregate([
        {$lookup:{
            from:"employers",
            localField:"emp_id",
            foreignField:"_id",
            as:"emp_details"
        }
    }
    ]).then(result=>{
        console.log(result);
        res.render('./admin/dashboard',{
            title:"Admin || Dashboard",
           data: req.admin,
           displayData:result
        })
    })
    
}

const adminauth=(req,res,next)=>{
if (req.admin) {
    console.log(req.admin);
    next();
} else {
    console.log(req.admin);
    req.flash('message',"can not access this page ..please login first")
    res.redirect('/admin/')
}
}



const logout=(req,res)=>{
   res.clearCookie('AdminToken')
   res.redirect('/admin/')
}


const jobseeker=(req,res)=>{
UserModel.find().then(result=>{
    res.render('./admin/jobseeker',{
        title:"Jobseeker",
        data:req.admin,
        displayData:result
    })
})
}

const deactivejobseeker=(req,res)=>{
    const id=req.params.id
    UserModel.findByIdAndUpdate(id,{status:false}).then(result=>{
        console.log(result,"Deactived jobseeker");
        res.redirect('/admin/jobseeker')
    }).catch(err=>{
        console.log(err);
    })
}

const activejobseeker=(req,res)=>{
    const id=req.params.id
    UserModel.findByIdAndUpdate(id,{status:true}).then(result=>{
        console.log(result,"Deactived jobseeker");
        res.redirect('/admin/jobseeker')
    }).catch(err=>{
        console.log(err);
    })
}
const jobcategory=(req,res)=>{
     CategoryModel.find().then(result=>{
        res.render('./admin/jobcategory',{
            title:"Admin || Jobcategory",
           data: req.admin,
           cat_data:result
        })
     }).catch(err=>{
        console.log(err);
     })
    
}

const Education_Training=(req,res)=>{
    res.render('./admin/Education_Training',{
        title:"Admin || Education & Training page ",
        data:req.admin
    })
}
const SalesandMarketing=(req,res)=>{
    res.render('./admin/SalesandMarketing',{
        title:"Admin || Salesand Marketing page ",
        data:req.admin
    })
}
const ComputerPrograming=(req,res)=>{
    res.render('./admin/ComputerPrograming',{
        title:"Admin || Computer Programing page ",
        data:req.admin
    })
}

const CustomerSupport=(req,res)=>{
    res.render('./admin/CustomerSupport',{
        title:"Admin || Customer Support page ",
        data:req.admin
    })
}

const Design_Multimedia=(req,res)=>{
    res.render('./admin/Design&Multimedia',{
        title:"Admin || Design_Multimedia page ",
        data:req.admin
    })
}

const WebDevelopment=(req,res)=>{
    res.render('./admin/WebDevelopment',{
        title:"Admin || Web Development page ",
        data:req.admin
    })
}

const Medical_Pharma=(req,res)=>{
    res.render('./admin/Medical_Pharma',{
        title:"Admin ||Medical_Pharma page ",
        data:req.admin
    })
}

const Engineer_Architects=(req,res)=>{
    res.render('./admin/Engineer_Architect',{
        title:"Admin ||Engineer_Architects page ",
        data:req.admin
    })
}




const activecategory=(req,res)=>{
    const id=req.params.id
    CategoryModel.findByIdAndUpdate(id,{status:true}).then(result=>{
        console.log(result,"Actived category");
        res.redirect('/admin/jobcategory')
    }).catch(err=>{
        console.log(err);
    })
}

const deactivecategory=(req,res)=>{
    const id=req.params.id
    CategoryModel.findByIdAndUpdate(id,{status:false}).then(result=>{
        console.log(result,"Deactived category");
        res.redirect('/admin/jobcategory')
    }).catch(err=>{
        console.log(err);
    })
}


const about=(req,res)=>{
    AboutModel.find().then(result=>{
        res.render('./admin/about',{
            title:"Admin || About page",
            data:req.admin,
            displayData:result
        })
    })
    
}


const activeabout=(req,res)=>{
    const id=req.params.id
    AboutModel.findByIdAndUpdate(id,{status:true}).then(result=>{
        console.log(result,"Actived about");
        res.redirect('/admin/about')
    }).catch(err=>{
        console.log(err);
    })
}

const deactiveabout=(req,res)=>{
    const id=req.params.id
    AboutModel.findByIdAndUpdate(id,{status:false}).then(result=>{
        console.log(result,"Deactived about");
        res.redirect('/admin/about')
    }).catch(err=>{
        console.log(err);
    })
}

//.....ac/dc post
const activejob=(req,res)=>{
    const post_id=req.params.id
    PostModel.findByIdAndUpdate(post_id,{status:true}).then(result=>{
        res.redirect('/admin/dashboard')
    }
    )
}
const deactivejob=(req,res)=>{
    const post_id=req.params.id
    PostModel.findByIdAndUpdate(post_id,{status:false}).then(result=>{
        res.redirect('/admin/dashboard')
    }
    )
}

module.exports={
    login,
    logincreate,
    dashboard,
    adminauth,
    logout,
    jobseeker,
    activejobseeker,
    deactivejobseeker,
    jobcategory,
    Education_Training,
    SalesandMarketing,
    ComputerPrograming,
    CustomerSupport,
    Design_Multimedia,
    WebDevelopment,
    Medical_Pharma,
    Engineer_Architects,
    activecategory,
    deactivecategory,
    about,
    activeabout,
    deactiveabout,
    activejob,
    deactivejob
}