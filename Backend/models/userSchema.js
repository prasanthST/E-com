import validator from "validator";
import mongoose from "mongoose";
import bcryptjs, { hash } from "bcryptjs";
import jwt from "jsonwebtoken"
import crypto from "crypto";
import dotenv from "dotenv"
dotenv.config()

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter your name "],
      maxLength: [
        25,
        "Invalid name. please enter a name with fewer then 25 character",
      ],
      minLength: [3, "Name should contain more then 3 characters "],
    },
    email: {
      type: String,
      required: [true, "please Enter your Email "],
      unique: true,
      validate: [validator.isEmail, " Please enter the valid email "],
    },
    password: {
      type: String,
      required: [true, "please Enter your Password"],
      minLength: [8, "password should be greater then 8 characters"],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return;
  }
  // it will hash when we modified any user  data
  this.password = await bcryptjs.hash(this.password, 10);
});
 
// JWT token generator
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY , {
        expiresIn :process.env.JWT_EXPIRE
    })
}
// verify bcrypt password
userSchema.methods.verifyPassword = async function(userPassword){
    return await bcryptjs.compare(userPassword, this.password)
}
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  return resetToken;
}

export default mongoose.model("User", userSchema);
