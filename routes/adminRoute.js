const express=require('express');
const Route=express.Router();
const AdminController=require('../controller/adminController');

Route.get('/admin/',AdminController.login);
Route.post('/admin/logincreate',AdminController.logincreate);
Route.get('/admin/dashboard',AdminController.adminauth,AdminController.dashboard);
Route.get('/admin/logout',AdminController.logout)

module.exports=Route;
