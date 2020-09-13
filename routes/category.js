const express = require('express');
const router = express.Router()

const {getCategoryById, createCategory, getCategory, getAllCategory, updateCategory, removeCategory} = require('../controllers/category');
const {isSignedIn, isAuthenticated, isAdmin} = require('../controllers/auth');
const {getUserById} = require('../controllers/user');

//params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById)

//create routes goes here
router.post('/category/create/:userId', isSignedIn, isAuthenticated, isAdmin, createCategory );

//Read 
router.get('/category/:categoryId', getCategory)
router.get('/categories', getAllCategory)

//Update
router.put('/category/:categoryId/:userId', isSignedIn, isAuthenticated, isAdmin, updateCategory );

//Delete
router.delete('/category/:categoryId/:userId', isSignedIn, isAuthenticated, isAdmin, removeCategory );



module.exports = router;