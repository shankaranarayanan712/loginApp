/**
 * Created by shankara on 29/12/17.
 */
var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/',  function(req, res){
    res.redirect('/users/login');
});
router.get('/dashboard',ensureAuthentication,  function(req, res){
    res.render('index');
});

function ensureAuthentication(req, res, next) {
    if(req.isAuthenticated()){
        return next()
    }
    else{
    
        req.flash('error_msg', "You are not logged in")
        res.redirect('/users/login')
    }

}
module.exports = router;

