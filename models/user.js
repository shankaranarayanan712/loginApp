/**
 * Created by shankara on 29/12/17.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/loginapp');

var db = mongoose.connection;

var UserSchema = mongoose.Schema({
    
    userName :{
        
        type : String,
        index : true
    },
    password :{
        type : String
    },
    email:{
        type : String
    },
    name :{
        type : String
    },
    
})

var User = module.exports = mongoose.model('User', UserSchema)


var apiSchema = mongoose.Schema({
    
    placeName :{
        type : String,
        index : true
    },
    political :{
        type : String
    },
    areaOne:{
        type : String
    },
    areaTwo :{
        type : String
    },
    country :{
        type : String
    },
    latitude :{
        type : String
    },
    lalongitude :{
        type : String
    },
    
})

var Api = module.exports = mongoose.model('Api', apiSchema)


module.exports.createUser = (newUser, callback)=>{
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            if(!err) {
                newUser.password = hash
                newUser.save(callback)
            }
        });
    });
    
}
module.exports.getUserByUsername = function(username, callback){
    var query = {userName: username};
    User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}
module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}