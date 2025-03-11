const User = require('../models/users');
const {signUpSchema, signInSchema ,userIdValidation, updateUserSchema} = require('../lib/validation/user');
const { z } = require('zod');
const bcrypt = require('bcrypt');
const {setTokenCookie} = require('../lib/validation/utils');
const { findOne } = require('../models/income');



const signUp = async (req, res) => {
    try {
        const { fullName, username, email, password } = signUpSchema.parse(req.body);

        const usernameExists = await User.findOne({ username });
        console.log(1.1);
        if (usernameExists) {
            console.log(1.2)
            return res.status(400).json({ message: 'Username already exists' });
        }

        
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            console.log(1.2)
            return res.status(400).json({ message: 'email already exists' });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        
        const user = new User({
            fullName,
            username,
            email,
            password: hashedPassword,
        })


        const newUser = await user.save()

        if (!newUser) {
            return res.status(400).json({ message: 'failed to create user' })
        }

        setTokenCookie(res,newUser, process.env.JWT_SECRET)

        return res.status(201).json({ message: 'user created successfully' });
    }
    catch (error) {
        console.log(error);

        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message })
        }

        return res.status(500).json({ message: 'Internal server error' })

    }
};

const signIn = async (req,res) => {
    try{
        const {username, password} = signInSchema.parse(req.body)

        const user = await User.findOne({username})
        if(!user)
        {
            return res.status(400).json({message:'invalid username or password'})
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch)
        {
            return res.status(400).json({message:'invalid username or password'});
        }
        
        setTokenCookie(res,user, process.env.JWT_SECRET);
        return res.status(200).json({message:'Login successfully'});
    }
    catch (error) {
        console.log(error);

        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message })
        }

        return res.status(500).json({ message: 'Internal server error' })
    }
}


const signOut = async(req,res) => {


   try { res.clearCookie("token");
    return res.status(200).json({message: 'User logout successfully'});
   } catch(error){
    return res.status(500).json({message: 'Internal server error'});
   }
};

const updateUser = async (req,res) => {
        try {

            if(req.user._id !== req.params.userId){
                return res.status(403).json({message: 'Forbidden'});
            }

            const { fullName, username, email, password } = updateUserSchema.parse(req.body);
    
            const userId = userIdValidation.parse(req.params.userId);
    
            const userExists = await User.findById(userId);
            if (!userExists) {
                return res.status(404).json({ message: "User not found" });
            }
    
            if (username && username === userExists.username) {
                const existingUsername = await User.findOne({username});
                if(existingUsername){
                return res.status(400).json({ message: 'Username is the same as the old one' });
                }
            }
    
            if (email && email === userExists.email) { 
                const existingEmail = await User.findOne({email});
                if(existingEmail){
                return res.status(400).json({ message: 'Email is the same as the old one' });
                }
            }
    
            if (password) { 
               matchedPass = await bcrypt.compare(password, userExists.password);
                if (matchedPass) { 
                    return res.status(400).json({ message: 'Password is the same as the last one' });
                }
                const hashedPassword = await bcrypt.hash(password, 10);
                userExists.password = hashedPassword;
            }
            

            const updatedUser = await User.findByIdAndUpdate(userId, {
                fullName: fullName || userExists.fullName,
                username: username || userExists.username,
                email: email || userExists.email,
                password: userExists.password
            });
    
            if (!updatedUser) {
                return res.status(400).json({ message: "Failed to update user" });
            }
    
            setTokenCookie(res, updatedUser, process.env.JWT_SECRET);
    
            return res.status(200).json({ message: "User updated successfully" });
        } catch (error) {
            console.log(error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: error.errors[0].message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

const me = async (req,res) =>{
    try{
        const {exp,createdAt,email,fullName,username,_id} = req.user;
        const user = {
            tokenExpired: exp,
            createdAt,
            email,
            fullName,
            username,
            id: _id
        };
        return res.status(200).json(user);
    } catch(error){
        return res.status(500).json({ message: 'Internal server error' });

    }
};


module.exports = {
    signUp,
    signIn,
    signOut,
    updateUser,
    me,
}

