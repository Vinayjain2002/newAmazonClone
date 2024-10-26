import mongoose from 'mongoose'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const userSchema= mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    profilePic: {
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    phoneNo: {
        type: Number,
        required: true
    },
    // tokens: [
    //     {
    //         token: {
    //             type: String
    //         }
    //     }
    // ]
},{timestamps: true});

userSchema.pre("save",async function(next){
    if(this.isModified('password')){
        this.password= await bcrypt.hash(this.password, process.env.SALT_ROUND)
    }
    next();
});
userSchema.methods.matchPassword= async function(password){
    // going to match the password
    try{
        const isMatch = await bcrypt.compare(password, this.password);
        return isMatch; 
    }
    catch(err){
        throw new Error("Error while matching Password");
    }
}

userSchema.methods.generateAuthToken= async function(){
    try{
        let token= jwt.sign({
            id: this._id, email: this.email
        }, process.env.SECRET_KEY,{
            expiresIn: '24h'
        });
        return token;
    }
    catch(err){
        throw new Error("Error while generating Auth Token");
    }
}
const UserModel= mongoose.model("User",userSchema);
export default UserModel;