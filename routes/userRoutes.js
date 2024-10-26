import express from 'express'
import {registerUser, signUpUser,fetchUser,allUser,searchUser,validUser,logout,deleteUser,updateUser} from '../controllers/userConrollers.js';
import {Auth, isAdmin} from '../middleware/Auth.js'

const router= express.Router();
router.post('/auth/register', registerUser);
router.post('/auth/login',signUpUser);
router.get('/auth/valid', Auth, validUser);
router.get('/auth/logout', Auth, logout);
router.get('/api/user?', Auth, searchUser)
router.get('/api/users/:userId', Auth,fetchUser);
router.get('/api/users/update/:userId', Auth, updateUser);
router.get('/api/users',Auth,isAdmin, allUser);
router.get('/api/delete/userId', Auth,deleteUser);