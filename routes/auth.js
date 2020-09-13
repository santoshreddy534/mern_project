const express = require('express');
const router = express.Router();
const {check, validationResult} = require("express-validator");
const { signout , signup, signin, isSignedIn } = require('../controllers/auth')

router.post('/signup',[
check("name", "name should be atleast 3 char")
.isLength({ min: 3}),
check("email", "Email required").isLength({min: 3}).isEmail(),
check("password", "password should be between 3-10 char")
.isLength({ min: 3, max: 10})
.matches(/\d/)
.withMessage('Password must contain a number')
], signup)

router.post('/signin',[
    check("email", "Email required !")
    .isLength({min : 3}),
    check("password", "Password field is required")
    .isLength({min:3, max:10})
    .matches(/\d/)
    .withMessage('Password must Contain a number')
], signin)

router.get('/signout', signout);

router.get('/testroute', isSignedIn, (req, res)=>{
    res.send(req.auth)
})

module.exports = router;