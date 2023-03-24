const UserModel=require('../model/user');
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
                    }, 'souvik413@ggmondal134@56789', { expiresIn: '5h' })
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

module.exports={
    login,
    logincreate,
    dashboard,
    adminauth,
    logout
}