const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const RegisterUser = async (req,res) => {
    const userBody = req.body;

    if( !userBody.email || !userBody.password || !userBody.name){
        return res.status(400).json({
            message: 'You cannot leave email,password or name blank !'
        })
    }

    const userExists = await UserModel.findOne({ email: userBody.email});

    if(userExists){
        return res.status(403).json({
            message: "User already Exists!, try to use another email"
        })
    }

    const encryptedPassword = await bcrypt.hash(userBody.password, 10);

    const newUser = new UserModel({
        name: userBody.name,
        email: userBody.email,
        password: encryptedPassword
    })

    try{
        const savedUser = await newUser.save();
        return res.status(201).json({
            message: 'User Registed successfully',
            data: savedUser
        })
    } catch (error) {
        return res.status(500).json({
            message: 'There was an error',
            error
        })
    }
}

const getUsers = async (req,res) => {

    try{
        const users = await UserModel.find();
        return res.status(200).json({
            message: 'Found the Users !',
            data: users
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error finding users',
            error
        })
    }
}

const LoginUser = async (req,res) => {
    const userBody = req.body;

    if( !userBody.email || !userBody.password){
        return res.status(400).json({
            message: 'You cannot leave email,password or name blank !'
        })
    }

    const userExists = await UserModel.findOne({ email: userBody.email});

    if(!userExists){
        return res.status(401).json({
            message: "User doesn't exist"
        })
    }


    const isPasswordSame = await bcrypt.compare(userBody.password, userExists.password);

    if(!isPasswordSame){
        return res.status(401).json({
            message: "Incorrect Credentials"
        })
    }

    const accessToken = jwt.sign({
        email: userExists.email,
        name: userExists.name,
        id: userExists._id
    }, process.env.JWT_SECRET_KEY)

    const userData = {
        id: userExists.id,
        email: userExists.email,
        name: userExists.name,
        token: accessToken
    }

    return res.status(200).json({
        message: "User Logged in!",
        data: userData
    })
}



module.exports = {
    RegisterUser,
    getUsers,
    LoginUser
}