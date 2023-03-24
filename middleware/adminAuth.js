const jwt=require('jsonwebtoken');

exports.adminjwt=(req,res,next)=>{
    if (req.cookies && req.cookies.AdminToken) {
        jwt.verify(req.cookies.AdminToken,'souvik413@ggmondal134@56789',(err,data)=>{
            req.admin=data
            next();
        })
    }else{
        next();
    }
}