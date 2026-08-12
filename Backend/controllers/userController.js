import { log } from "console";
import HandleError from "../helper/handleError.js";
import { sendToken } from "../helper/jwttoken.js";
import User from "../models/userSchema.js";
import { sendEmail } from "../helper/sendEmail.js";
import crypto from "crypto";
import {v2 as cloudinary} from "cloudinary"

// User Registor
export const userRegister = async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return next(
        new HandleError("Name , email or Password cannot be empty", 400)
      );
    }
     
   const myCloud = await cloudinary.uploader.upload(avatar,{
    folder:"avatars",
    width:150,
    crop:"scale", 
   })

    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
    sendToken(user, 201, res);
  } catch (error) {
    console.log(error);
  }
};

//User Login
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new HandleError("Email or password cannot be Empty", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if(!user){
    return next(new HandleError("Invalid email or password",401))
  }
  const isValidPassword = await user.verifyPassword(password);
  if (!isValidPassword) {
    return next(new HandleError("Invalid Email or password", 401));
  }
  sendToken(user, 200, res);
};


//Logout
export const logout = async(req, res, next) => {
  const options = { expires: new Date(Date.now()), httpOnly: true };
  res.cookie("token", null, options);
  res.status(200).json({
    success: true,
    message: "Successfully logged out",
  });
};

//ResetPassword / send mail to email 
export const forgetPassword = async(req, res, next)=>{
   const {email}= req.body;
  //console.log(email);
   const user = await User.findOne({email});
   if(!user){
    return next(new HandleError("user does not exists", 400))
   } 
   //create resetToken 
   let resetToken ;
   try {
    resetToken = user.createPasswordResetToken();
    await user.save()
    //console.log(resetToken); a1512b26dfe41bee083f1f299065cbbe2a554a87
   } catch (error) {
    // console.log(error);
    return next(new HandleError("Could not save reset token, try again later..",500)) 
   }
   // resetPasswordURL
   const resetPasswordURL = `${req.protocol}://${req.host}/reset/${resetToken}`;
  //console.log(resetpasswordURL);
   const message = `Reset your password using the link below :\n${resetPasswordURL}\n\n The link expires in 30 mins .\n\n if this was't you , please ignore this message .`

   const messageHTML=`
   <div style="font-family: Arial, sans-serif; padding: 20px; background:#f4f4f4;">
<div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
<h2 style="color: #333;">Password Reset Request</h2>
<p>Hello,</p>
<p>You requested to reset your password. Click the button below to continue:</p>
<a href="${resetPasswordURL}"
style="display: inline-block; padding: 12px 20px; background: #067bff; color: white;
 text-decoration: none; border-radius: 5px; margin-top: 10px;">
Reset Password
</a>
<p style="margin-top: 20px;">
Or copy and paste this link in your browser:<br>
<a href="${resetPasswordURL}">${resetPasswordURL}</a>
</p>
<p style="color: red; font-weight: bold;">
This link will expire in 30 minutes.
</p>
<p>If you didn't request a password reset, please ignore this email.</p>
<br>
<p>Regards, <br>Shopping time</p>
</div>
</div>`;
   try {
    await sendEmail({email:user.email , subject : "Password Reset Request", message,htmlMessage:messageHTML});
    res.status(200).json(
      {success:"true", 
      message:`email send to ${email} successfully`
      })
   } 
   catch (error) {
    console.log(error);
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save();
    await user.save({validationBeforeSave : false });
    return next(new HandleError("email could not be send try again later...",500))
   }
}
 
//PasswordReset
export const resetPassword = async (req, res , next)=>{
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  console.log(resetPasswordToken);
   const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {$gt: Date.now()}
  })
  if(!user){
    return next(new HandleError("Invalid or reset code Expired", 400))
  }
  const {password , confirmPassword} = req.body
  if(password!== confirmPassword){
    return next(new HandleError("password does't match please check both password", 400))
  }  
  user.password = password
  user.resetPasswordExpire = undefined
  user.resetPasswordToken = undefined
  await user.save();
  sendToken(user, 200, res);  
}


// profile
//checking user profile detailes after login 
export const profile = async (req , res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({success:true , user} )
}

//updatePassword
export const updatePassword = async(req,res,next)=>{
  const {oldPassword , newPassword , confirmPassword}=req.body;
  const user = await User.findById(req.user.id).select("+password");
  const isCorrect = await user.verifyPassword(oldPassword)
  if(!isCorrect){
     return next(new HandleError("Old password is not correct... ", 400))
  }
  if(newPassword !== confirmPassword){
    return next(new HandleError("Confirm passWord must  be same as a newpassword",400))
  }
  user.password = newPassword
  await user.save()
  sendToken(user, 200, res); 
}
//upDate profile 
export const profileUpdate = async (req,res,next)=>{
  const {name , email,avatar }=req.body ;
  const updatedUserDetails = {name , email }

  // Check if avatar is provided and is not empty
  if(avatar && avatar!==""){
    const user = await User.findById(req.user.id)
    const imageId = user.avatar?.public_id;
    
      // Delete old avatar from cloudinary if it exists
    if(imageId){
      await cloudinary.uploader.destroy(imageId)
    }
     
    // Upload new avatar to cloudinary
    const myCloud = await cloudinary.uploader.upload(avatar,{
      folder:"avatar",
      width:150,
      crop:"scale"
    });

    updatedUserDetails.avatar={
      public_id : myCloud.public_id,
      url : myCloud.secure_url,
    }
  }
  const user = await User.findByIdAndUpdate(req.user.id ,
     updatedUserDetails ,{ new:true , runValidators: true,},)
  res.status(200).json({
    success:true,
    message:"Profile update successfully"
  })
}

//get All Users using only by (admin) role 
export const getUsers =async (req,res,next)=>{
  const users = await User.find();
  res.status(200).json({
    success:true,
    users
  })
}

//Get single user using only by (admin) role
export const getSingleUser = async(req,res,next)=>{
  const id = req.params.id
  const user = await User.findById(id);
  if(!user){
    return next(new HandleError("User doesn't exist", 400))
  }
  res.status(200).json({success:true , user})
}

//change user role using only by (admin) role
export const updateUserRole = async ( req,res,next )=>{
    const id = req.params.id
    const { role } = req.body
    const updatedRole = { role }
    const user = await User.findByIdAndUpdate(id , updatedRole ,{new:true});
    if(!user){
      return next(new HandleError("user Does't Exit ", 400));
    }
    res.status(200).json({success:true , user})
}

//Delete user using only by (admin) role
export const deleteUser = async (req,res,next)=>{
  const id = req.params.id 
  const user = await User.findById(id)
  if(!user){
    return next(new HandleError("User does't exist",400))
  }
  await User.findByIdAndDelete(id)
  res.status(200).json({success:true, message: "User detail delete" })
}