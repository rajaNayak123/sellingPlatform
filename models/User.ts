import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser{
    email:string;
    password:string;
    role:"user"|"admin",
    _id?:mongoose.Types.ObjectId,
    createdAt?:Date,
    updatedAt?:Date
}

const userSchema = new mongoose.Schema<IUser>({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["admin", "user"],
        default:"user"
    }
},{timestamps:true});

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,100)
    }
    next();
})

const User = mongoose.models?.User || mongoose.model<IUser>("User",userSchema)
export default User;