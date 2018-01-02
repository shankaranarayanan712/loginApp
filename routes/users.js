/**
 * Created by shankara on 29/12/17.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy

var User = require('../models/user')

// Get Homepage
router.get('/register',(req, res)=>{
    res.render('registers');
});

router.get('/login',(req, res)=>{
    res.render('login');
});

router.post('/register', (req, res)=>{
    var name = req.body.name ;
    var username = req.body.username ;
    var email = req.body.email ;
    var password = req.body.password ;
    var password2 = req.body.password2 ;
    req.checkBody('name', "Name is Required").notEmpty();
    req.checkBody('username', "username is Required").notEmpty();
    req.checkBody('email', "email is Required").isEmail();
    req.checkBody('password', "password is Required").notEmpty();
    req.checkBody('password2', "password do not match").equals(req.body.password)
    var errors = req.validationErrors()
    if(errors) {
        res.render('registers',{
            errors:errors
        })
    }
    else{
        var newUser = new User({
            userName : username,
            password :password,
            email: email,
            name : name,
        })
        User.createUser(newUser, (err, user)=>{
            if(err) throw err
            
        })
        req.flash('success_msg' , "You are registered and now you can log in");
        res.redirect('/users/login');
    }
});
router.post('/login',
    passport.authenticate('local', {successRedirect:'/dashboard', failureRedirect:'/users/login',failureFlash: true}),
    function(req, res) {
        res.redirect('/dashboard');
    });

router.get('/logout',(req, res)=>{
    req.logout();
    req.flash('success_msg',"You are logged out")
    res.redirect('login');
});
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Unknown User'});
            }
            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
            done(err, user);
    });
});



module.exports = router;