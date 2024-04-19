const express = require('express');
const Router = express.Router();
const UserController = require('../controllers/User');
//signup

Router.post('/register', UserController.RegisterUser);

//login

Router.post('/login',UserController.LoginUser);

//get users

Router.get('/',UserController.getUsers);



module.exports = Router;