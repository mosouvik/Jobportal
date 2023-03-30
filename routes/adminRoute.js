const express=require('express');
const Route=express.Router();
const AdminController=require('../controller/adminController');

Route.get('/admin/',AdminController.login);
Route.post('/admin/logincreate',AdminController.logincreate);
Route.get('/admin/dashboard',AdminController.adminauth,AdminController.dashboard);
Route.get('/admin/jobcategory',AdminController.adminauth,AdminController.jobcategory);
Route.get('/admin/jobseeker',AdminController.adminauth,AdminController.jobseeker)
Route.get('/admin/employer',AdminController.adminauth,AdminController.employer)

Route.get('/admin/logout',AdminController.logout)


// ....category ac/dc...

Route.get('/admin/activecategory/:id',AdminController.activecategory);
Route.get('/admin/deactivecategory/:id',AdminController.deactivecategory)

// ....about....

Route.get('/admin/about',AdminController.adminauth,AdminController.about);
Route.get('/admin/deactiveabout/:id',AdminController.deactiveabout)
Route.get('/admin/activeabout/:id',AdminController.activeabout)

//....ac/dc post
Route.get('/admin/activejob/:id',AdminController.activejob)
Route.get('/admin/deactivejob/:id',AdminController.deactivejob)

//.....ac/dc jobseeker
Route.get('/admin/deactivejobseeker/:id',AdminController.deactivejobseeker)
Route.get('/admin/activejobseeker/:id',AdminController.activejobseeker)


//.....ac/dc employer
Route.get('/admin/activeemployer/:id',AdminController.activeemployer)
Route.get('/admin/deactiveemployer/:id',AdminController.deactiveemployer)

// activity.

Route.get('/admin/activity',AdminController.adminauth,AdminController.activity);

module.exports=Route;
