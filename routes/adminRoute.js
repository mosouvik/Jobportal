const express=require('express');
const Route=express.Router();
const AdminController=require('../controller/adminController');

Route.get('/admin/',AdminController.login);
Route.post('/admin/logincreate',AdminController.logincreate);
Route.get('/admin/dashboard',AdminController.adminauth,AdminController.dashboard);
Route.get('/admin/jobcategory',AdminController.jobcategory);
Route.get('/admin/Education_Training',AdminController.Education_Training);
Route.get('/admin/SalesandMarketing',AdminController.SalesandMarketing);
Route.get('/admin/ComputerPrograming',AdminController.ComputerPrograming);
Route.get('/admin/CustomerSupport',AdminController.CustomerSupport);
Route.get('/admin/Design_Multimedia',AdminController.Design_Multimedia);
Route.get('/admin/WebDevelopment',AdminController.WebDevelopment);
Route.get('/admin/Medical_Pharma',AdminController.Medical_Pharma);
Route.get('/admin/Engineer_Architects',AdminController.Engineer_Architects);
Route.get('/admin/jobseeker',AdminController.jobseeker)

Route.get('/admin/logout',AdminController.logout)


// ....category ac/dc...

Route.get('/admin/activecategory/:id',AdminController.activecategory);
Route.get('/admin/deactivecategory/:id',AdminController.deactivecategory)

// ....about....

Route.get('/admin/about',AdminController.about);
Route.get('/admin/deactiveabout/:id',AdminController.deactiveabout)
Route.get('/admin/activeabout/:id',AdminController.activeabout)

//....ac/dc post
Route.get('/admin/activejob/:id',AdminController.activejob)
Route.get('/admin/deactivejob/:id',AdminController.deactivejob)

//.....ac/dc jobseeker
Route.get('/admin/deactivejobseeker/:id',AdminController.deactivejobseeker)
Route.get('/admin/activejobseeker/:id',AdminController.activejobseeker)

module.exports=Route;
