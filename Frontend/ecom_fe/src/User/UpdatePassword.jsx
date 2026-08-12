import { useEffect, useState } from "react"
import Navbar from "../Components.jsx/Navbar"
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { removeErrors, removeSuccess, updatePassword } from "../features/User/userSlice";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {error,success , loading}=useSelector((state)=>state.user);

    const [oldPassword , setOldPassword]= useState("");
    const [newPassword , setNewPassword]= useState("");
    const [confirmPassword , setConfirmPassword]= useState("");

    useEffect(()=>{
        if(success){
            toast.success("Password updated successfully",{position:"top-center",
                autoClose:3000})
            dispatch(removeSuccess());
            navigate("/profile")
        }

        if(error){
            toast.error(error,{position:"top-center",autoClose:3000});
            dispatch(removeErrors());
        }

    },[dispatch,success,error]);

    const handleSubmit =(e)=>{
        e.preventDefault()
        if(newPassword !== confirmPassword){
            toast.error("New password and confirm Password does't match",
                {position:"top-center", autoClose:3000});
                return;
        }
        dispatch(updatePassword({oldPassword,newPassword,confirmPassword}))

    }
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12
    sm:px-6 lg:px-8 pt-24">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold texxt-gray-900 
            drop-shadow-sm">Update Password</h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md ">
            <div className="bg-white py-10 px-6 shadow-xl rounded-2xl sm:px-10
            border border-gray-100">
                <form className="space-y-6" onSubmit={handleSubmit} >
                    <div>
                        <label className ="block text-sm font-semibold 
                        text-gray-700 ml-1">Old password</label>
                        <div>
                            <input type="password" value={oldPassword} placeholder="Enter old password"
                            required onChange={(e)=>setOldPassword(e.target.value)} 
                            className="appearance-none block w-full px-4 py-3 
                            border border-gray-200 rounded-xl shadow-sm 
                            placeholder-gray-400 focus: outline-none focus:ring-2
                            focus:ring-indigo-500 focus:border-transparent transition-all"/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold 
                        text-gray-700 ml-1">New password</label>
                        <div>
                            <input type="password" value={newPassword} placeholder="Enter new password"
                            required onChange={(e)=>setNewPassword(e.target.value)}  
                            className="appearance-none block w-full px-4 py-3  
                            border border-gray-200 rounded-xl shadow-sm 
                            placeholder-gray-400 focus: outline-none focus:ring-2
                            focus:ring-indigo-500 focus:border-transparent transition-all" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold 
                        text-gray-700 ml-1">Confirm password</label>
                        <div>
                            <input type="password" value={confirmPassword} placeholder="Enter confirm password" 
                            required onChange={(e)=>setConfirmPassword(e.target.value)}  
                            className="appearance-none block w-full px-4 py-3 
                            border border-gray-200 rounded-xl shadow-sm 
                            placeholder-gray-400 focus: outline-none focus:ring-2
                            focus:ring-indigo-500 focus:border-transparent transition-all"/>
                        </div>
                    </div>
                    <div>
                        <button className="w-full bg-indigo-600 text-white py-2 px-4 
                        rounded hover:bg-indigo-700 action:scale-[0.98]">Change Password</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    </>
  )
}

export default UpdatePassword