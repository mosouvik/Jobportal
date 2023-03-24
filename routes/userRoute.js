const express=require('express');
const Route=express.Router();
const UserController=require('../controller/usercontroller');

Route.get('/',UserController.index);
Route.get('/job',UserController.job)
Route.get('/register',UserController.register);
Route.post('/registercreate',UserController.registercreate);
Route.get('/login',UserController.login);
Route.get('/postjob',UserController.postjob);
Route.post('/postcreate',UserController.postcreate)
Route.get('/about',UserController.about);
Route.get('/contact',UserController.contact)


module.exports=Route