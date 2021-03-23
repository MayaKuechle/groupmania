const express = require('express');
const router = express.Router(); //we create a router

const userCtrl = require('../controllers/user'); //we need to import user controller

router.get('/', function(req, res, next) {
    res.render('index', {title: 'Form Validation', success: req.session.success, errors: req.session.errors});
    req.session.errors = null;
});

router.post('/submit', function(req, res, next) {
    req.check('email', 'Invalid email address').isEmail();
    req.check('password', 'Password is invalid').isLength({min:4}).equals(req.body.confirmPassword);

    var errors = req.validationErrors();
    if(errors) {
        req.session.errors = errors;
        req.session.success = false;
    } else {
        req.session.success = true;
    }
    res.redirect('/');
});

/*
router.post('/signup', userCtrl.signup); 
router.post('/login', userCtrl.login);
*/

module.exports = router; //so that it is available outside of project and available to app