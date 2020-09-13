const User = require("../models/user");
const { check, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

//SignUp
exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      err: errors.array()[0].msg
    });
  }
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

//SignIN
exports.signin = (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      err: errors.array()[0].msg
    });
  }

  User.findOne({email}, (err, user)=>{
    if(err || !user){
     return res.status(400).json({
        error: 'user email doesnot exists'
      })
    }
    if(!user.authenticate(password)){
      return res.status(401).json({
        error: 'email and password doesnot match'
      })
    }
    const token = jwt.sign({_id: user._id}, process.env.SECRET)
    //put token in cookie
    res.cookie("token", token, {expire: new Date() + 9999});

    //send response to front end
    const {_id, name, email, role} = user;
    return res.json({token, user: {_id, name, email, role}})

  })
};

//SignOut
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Signed Out Successfully",
  });
};

//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth"
});


//custom middleware

exports.isAuthenticated = (req, res, next)=>{
  const checker = req.profile && req.auth && req.profile._id == req.auth._id
  if(!checker){
    return res.status(403).json({
      error: 'ACCESS DENIED'
    })
  }
  next();
}

exports.isAdmin = (req, res, next)=>{
  if(req.profile.role === 0){
    return res.status(403).json({
      error:'You are not ADMIN, Access denied'
    })
  }
  next();
}