const UserModel=require('../model/user');
const CategoryModel=require('../model/category');
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
    res.render('./admin/dashboard',{
        title:"Admin || Dashboard",
       data: req.admin
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
    res.render('./admin/about',{
        title:"Admin || About page",
        data:req.admin
    })
}

module.exports={
    login,
    logincreate,
    dashboard,
    adminauth,
    logout,
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
    about
}