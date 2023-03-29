const express=require('express');
const Route=express.Router();
const UserController=require('../controller/usercontroller');
const CheckDuplcate=require('../middleware/Checkduplicate');
const CheckDuplcate2=require('../middleware/Checkduplicate2');

Route.get('/',UserController.index);
Route.get('/job',UserController.job)
Route.get('/register',UserController.register);
Route.post('/registercreate',[CheckDuplcate.CheckDuplicate],UserController.registercreate);
Route.post('/registercreate_emp',[CheckDuplcate2.CheckDuplicate2],UserController.registercreate_emp);
Route.get('/login',UserController.login);
Route.get('/login_emp',UserController.login_emp);
Route.post('/logincreate',UserController.logincreate)
Route.post('/logincreate_emp',UserController.logincreate_emp)
Route.get('/postjob',UserController.auth,UserController.postjob);
Route.post('/postcreate',UserController.postcreate)
Route.get('/about',UserController.about);
Route.get('/contact',UserController.contact)
Route.get('/logout',UserController.logout);
Route.get('/register_emp',UserController.register_emp)
Route.get('/viewjob/:id',UserController.auth,UserController.view_job)


Route.get('/cat',UserController.cat)
Route.post('/catc',UserController.catc)


// Contact
Route.post('/sendemail',UserController.auth,UserController.sendemail)

//...category

Route.get('/Education-Training',UserController.Education_Training)
Route.get('/Medical-Pharma',UserController.Medical_Pharma)
Route.get('/Computer-Programing',UserController.Computer_Programing)
Route.get('/Customer-Support',UserController.Customer_Support)
Route.get('/Design-Multimedia',UserController.Design_Multimedia)
Route.get('/Web-Development',UserController.Web_Development)
Route.get('/Engineer-Architects',UserController.Engineer_Architects)
Route.get('/Sales-Marketing',UserController.Sales_Marketing)

Route.get('/Full-Time',UserController.Full_Time)
Route.get('/Part-Time',UserController.Part_Time)
Route.get('/Freelancer',UserController.Freelancer)

//....apply
Route.get('/apply/:id',UserController.auth,UserController.apply)

//...applied jobs
Route.get('/appliedjobs',UserController.auth,UserController.appliedjobs)

module.exports=Route