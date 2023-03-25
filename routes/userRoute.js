const express=require('express');
const Route=express.Router();
const UserController=require('../controller/usercontroller');
const CheckDuplcate=require('../middleware/Checkduplicate');

Route.get('/',UserController.index);
Route.get('/job',UserController.job)
Route.get('/register',UserController.register);
Route.post('/registercreate',[CheckDuplcate.CheckDuplicate],UserController.registercreate);
Route.get('/login',UserController.login);
Route.post('/logincreate',UserController.logincreate)
Route.get('/postjob',UserController.auth,UserController.postjob);
Route.post('/postcreate',UserController.postcreate)
Route.get('/about',UserController.about);
Route.get('/contact',UserController.contact)
Route.get('/logout',UserController.logout);


Route.get('/cat',UserController.cat)
Route.post('/catc',UserController.catc)


module.exports=Route