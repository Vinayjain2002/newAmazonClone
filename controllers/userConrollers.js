import User from '../models/userModel.js'
import bcrypt from 'bcryptjs';

export const registerUser=async(req,res,next)=>{
    try{
        const {name, email,phoneNo}=req.body;
        const existingUser= await User.findOne({"email": email});
        if(existingUser){
            return res.status(400).json({"error": "User Already Exists"});
        }
        const newUser= await new User({email, phoneNo, name});
        const token= await newUser.generateAuthToken();
        await newUser.save();
        return res.json({"message": "Success", token: token});
    }catch(err){
        return res.status(500).json({"message": "Internal Server Error", "error": err});
    }
}

export const signUpUser = async(req, res,next)=>{
    try{
        const {email, password}= req.body;
        const user= await User.findOne({email});
        if(!user){
            return res.status(200).json({"message": "User does not exists"});
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token= await user.generateAuthToken();
        res.cookie('userToken', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
        return res.status(200).json({"message": "User registed Successfully", "token": token});
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"});
    }
}

//finding particular user
export const fetchUser= async(req,res,next)=>{
    try{
        const {id}= req.params;
        try{
            const user= await User.findOne({_id:id}).select('-password');
            return res.status(200).json({"message": "Fetched", "data": user});
        }
        catch(err){
            return res.status(500).json({"Error": "Internal Server Error"});
        }
    }
    catch(err){
        return res.status(500).json({"Error": "Internal Server Error"});
    }
}

export const allUser= async(req,res,next)=>{
    try{
        const allUser= await User.find({}).lean();
        return res.status(200).json({"message": "Users Fetched Successfully","data": allUser});
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"});
    }
}

export const searchUser= async(req,res,next)=>{
    try{
        const search= req.query.search ? {
            $or: [
                {name: {$regex: req.query.search, $options: 'i'}},
                {email: {$regex: req.query.search, $options: 'i'}}
            ]
        }: {};
        const searchedUser= await User.find(search).find({_id: {$ne: req.rootUserId}});
        return res.status(200).send({"data": searchedUser});
    }  
    catch(err){
        return res.status(500).json({"Error": "Error while Fetching the user"});
    }
}

export const validUser= async(req,res,next)=>{
    try{
        const validUser= await User.findOne({_id: req.rootUserId}).select('-password');
        if(!validUser){
            return res.json({"message": "User is not valid"});
        }
        res.status(201).json({"message": "User is valid", user: validUser, token: req.token});
    }
    catch(err){
        return res.status(500).json({"error": "Internal Server Errror"});
    }
}
export const logout= (req,res,next)=>{
    try{
        req.rootUser.tokens= req.rootUser.tokens.filter((e)=>e.token != req.token);
    }catch(err){
        return res.status(500).json({"Error": "Error while Logout"});
    }
}

export const deleteUser = async (req, res, next) => {
    const { userId } = req.params; // Assuming the user ID is passed as a URL parameter
    try {
        const deletedUser = await User.findByIdAndDelete(userId); // Delete user by ID
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" }); // Handle user not found
        }
        req.rootUserId="";
        req.rootUser.tokens=[]
        return res.status(200).json({ message: "User deleted successfully" }); // Success response
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({ message: "Internal Server Error" }); // Handle server error
    }
};
//update User
export const updateUser= async(req,res,next)=>{
    try{
        const {id}= req.params;
        const {name, profilePic, phoneNo}= req.body;
        const updatedUser= await User.findByIdAndUpdate(id, {name,profilePic,phoneNo});
        return updatedUser;
    } 
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"});
    }
}

