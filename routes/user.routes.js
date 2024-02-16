const express = require('express');
const {UserModel} = require('../model/users.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userRouter = express.Router();

userRouter.post('/register', async(req, res)=> {

    const {username, email, password } = req.body;
    try {
         const existinguser = await UserModel.findOne({email});
         if(existinguser){
            res.status(401).json({msg: "User already exists"});
         } else{
            bcrypt.hash(password, 8, async(err, hash)=>{
                if(err){
                    res.send({err: "error hashing password"});
                }
                else if(hash){
                    const newUser = new UserModel({username, email, password: hash});
                    await newUser.save();
                    res.send({"msg": "User has been registered"});
                }
            })
         }

    } catch (error) {
        console.log("error", error);
    }
})

userRouter.post('/login', async(req, res) => {
    const {email, password} =req.body;
    try {
          const existingUser = await UserModel.findOne({email});
          if(!existingUser){
            res.send({msg: "user doesnt exist"});
          } else{
            bcrypt.compare(password, existingUser.password, (err,result)=> {
                if(result){
                    const token = jwt.sign({userID : existingUser._id, author : existingUser.username}, "masai")
                    res.send({msg: "login successful", token});
                } else if(err){
                    res.send({msg: "wrong credentials", err});
                }
            })
          }
    } catch (error) {
        res.send(error);
    }
})


module.exports = {
    userRouter
}