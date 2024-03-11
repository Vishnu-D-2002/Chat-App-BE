const User = require("../Models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../utils");

const userController = {
    signup: async (req, res) => {      
        const { name, email, password } = req.body;
        try {
            const user = await User.findOne({ name, email })
            if (user) {
                res.status(201).send({message:"Existing User , please login"})
            }    
            else {
                const passWordHash = await bcrypt.hash(password, 10);
                const newUser = new User({
                    name,
                    email,
                    passWordHash
                })
                await newUser.save();
                res.status(200).send({message:"SignUp success",newUser})
            }
        } catch (e) {
            res.status(500).send({message:'signup Error',e})
            console.log('error', e);
        }
    },
    signin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                res.send({ message: "No Users found" });
            }else{
                const passCheck = await bcrypt.compare(password, user.passWordHash);
                if (!passCheck) {
                    res.send({ message: "Password is wrong" });
                }
                let token = await jwt.sign({
                    email, id: user._id
                }, JWT_SECRET);
                res.status(200).send({ message: "Signin sucess", token });
            }
        } catch (e) {
            res.status(500).send({message:"signin error",e})
        }
    },
}
module.exports = userController;