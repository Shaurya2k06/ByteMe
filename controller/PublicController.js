const User = require("../Model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_KEY = process.env.JWT_SECRET;


async function signUp(req, res) {
    console.log("yayyy")
    try {
        const body = req.body;
        if(!body || !body.userName || !body.userEmail || !body.password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const userInDb = await User.findOne({
            $or: [
                { userEmail: body.userEmail },
                { userName: body.userName }
            ]
        });
        if(userInDb) {
            return res.status(409).json({ warning: "Email or username already exists" });
        }

        const hashedPass = await bcrypt.hash(body.password, 10); //10 is the salting
        const newUser = await User.create({
            userName : body.userName,
            userEmail : body.userEmail,
            password : hashedPass,
            role : body.role,
        })

        const token = jwt.sign(
            { userEmail: newUser.userEmail, userName: newUser.userName, role : newUser.role },
            JWT_KEY,
            { expiresIn: '1d' }
        );

        return res.status(201).json({message: "User SignUp Sucessful",
            username : body.userName,
            role : body.role,
            token : token,
        });
    } catch (signup_error) {
        console.log(signup_error);
        return res.status(500).json({status: "Something went wrong, please try again later."})
    }
}


async function login(req, res) {
    try {
        const body = req.body;
        if(!body.userName || !body.password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const userInDb = await User.findOne({
            userName: body.userName,
        });
        if(!userInDb) {
            return res.status(400).json({ message: 'Invalid Username' });
        }

        const isPasswordValid = await bcrypt.compare(body.password, userInDb.password);
        if(!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid Password' });
        }

        const token = jwt.sign({
            userName : userInDb.userName,
            userEmail: userInDb.userEmail,
            role : userInDb.role,
        },
            JWT_KEY,
            {expiresIn: "1d"}
        );
        return res.status(200).json({
            message: 'Login successful',
            username: userInDb.userName,
            token: token
        });
    } catch (login_err) {
        console.error(login_err);
        return res.status(500).json({ message: 'Something went wrong during login' });
    }
}

module.exports = {
    signUp,
    login
};