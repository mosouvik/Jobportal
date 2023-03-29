const EmployerModel = require('../model/employer');

exports.CheckDuplicate2 = (req, res, next) => {
    EmployerModel.findOne({
        email: req.body.email
    }).exec((err, email) => {
        if (err) {
            console.log(err);
            return
        }
        if (email) {
            req.flash('error', "Email already exist")
            return res.redirect('/register_emp')
        }
        EmployerModel.findOne({
            contact: req.body.contact
        }).exec((err, contact) => {
            if (err) {
                console.log(err);
                return
            }
            if (contact) {
                req.flash('error', "Contact already exist")
                return res.redirect('/register_emp')
            }
            EmployerModel.findOne({
                name: req.body.name
            }).exec((err, name) => {
                if (err) {
                    console.log(err);
                    return
                }
                if (name) {
                    req.flash('error', "Name already exist")
                    return res.redirect('/register_emp')
                }

                const password = req.body.password
                const confirm = req.body.cpassword
                if (password !== confirm) {
                    req.flash('error', "Password & Confirm password are not matched")
                    return res.redirect('/register_emp')
                }
                next();
            })
        })



    })




}