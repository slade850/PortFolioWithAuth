const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User model
const User = require('../models/User');

// login page
router.get('/login', (req, res) => res.render('login'));

// register page
/* router.get('/register', (req, res) => res.render('register'));

//register post
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //check les champs requis
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'please fill in all field'});
    }
    
    //check password
    if(password !== password2){
        errors.push({ msg: 'Password do not match' });
    }

    // check pass length
    if(password.length < 6){
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if(errors.length > 0){
    res.render('register', {
        errors,
        name,
        email,
        password,
        password2
    });
    }else{
        // Validation de l'enregistrement
        User.findOne({ email: email })
        .then(user => {
            if(user){
                //User exist
                errors.push({ msg: 'Email is already register'});
                res.render('register', {
                errors,
                name,
                email,
                password,
                password2
                });
            }else{
                const newUser = new User({
                    name,
                    email,
                    password
                });
                
                //Hash password
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        //Set password to hashed
                        newUser.password = hash;
                        //Save user
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now register and can log in');
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                }))
            }
        })
    }
}); */

//login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

//logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})

module.exports = router;