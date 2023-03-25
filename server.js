const express=require('express');
const mongoose=require('mongoose');
const path = require('path');
const flash=require('connect-flash');
const session=require('express-session');
const cookieparser=require('cookie-parser');
const multer=require('multer')
const UserRoute=require('./routes/userRoute');
const AdminRoute=require('./routes/adminRoute');
const adminauth=require('./middleware/adminAuth')
const userauth=require('./middleware/auth');


const port=2345
const app=express();



app.use(express.urlencoded({extended:true}));

app.use(flash());
app.use(cookieparser());
app.use(session({
    cookie:{maxAge:5000},
    secret:'nodejs',
    resave:false,
    saveUninitialized:false
}))

//steap-1...static file uplode...
app.use('/upload',express.static(path.join(__dirname,'upload')));

//steap-2..
const filestorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'upload')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

//steap-3.. type of file....
const filefilter=(req,file,cb)=>{
    if(file.mimetype.includes("png")||
    file.mimetype.includes("jpg")||
    file.mimetype.includes("jpeg")){
        cb(null,true)
    }
    else{
        cb(null,false)
    }
}

// steap-4.... file upload.
app.use(multer({storage:filestorage,fileFilter:filefilter,limits:{fieldSize:1024*1024*5}}).single('image'))


app.set('view engine','ejs');
app.set('views','views');


app.use(userauth.authjwt);

app.use(UserRoute);

app.use(adminauth.adminjwt)

app.use(AdminRoute);

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'admincss')));


const DB="mongodb+srv://nodeClassjan:BrnrXRpwEfvb35kG@cluster0.4axmojt.mongodb.net/Final_Project"
mongoose.connect(DB,({useNewUrlParser:true,useUnifiedTopology:true}))
.then(result=>{
    app.listen(port,()=>{
        console.log("server Connected.......");
        console.log(`server running http://localhost:${port}`);
    })
}).catch(err=>{
    console.log(err);
})