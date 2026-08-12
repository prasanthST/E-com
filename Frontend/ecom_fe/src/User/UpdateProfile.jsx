import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Components.jsx/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadUser, removeErrors, removeSuccess, updateProfile } from "../feathures/User/userSlice";
import toast from "react-hot-toast";

const UpdateProfile = () => {
   const {user , error , loading ,success} = useSelector((state)=>state.user);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [name ,setName]=useState("");
   const [email ,setEmail]=useState("");
   const [avatar ,setAvatar]=useState("");
   const [preview ,setPreview]= useState("..src/assets/profile.png")

   useEffect(()=>{
    if(user){
        setName(user.name);
        setEmail(user.email);
        if(user.avatar?.url){
            setPreview(user.avatar.url)
        }
    }
    if(error){
        toast.error(error,{position:"top-center" , autoclose:3000})
        dispatch(removeErrors())
    }
    if(success){
        toast.success("Profile update successfully",{position:"top-center" , autoclose:3000})
        dispatch(loadUser());
        navigate("/profile")
        dispatch(removeSuccess())
    }
   },[dispatch,user,error,success]);


   // image update 
   const handleChange =(e)=>{
    const reader = new FileReader();
    reader.onload = ()=>{
        if(reader.readyState ===2){
            setPreview(reader.result);
        setAvatar(reader.result);
        }
    };
    reader.readAsDataURL(e.target.files[0]);
   }

   const handleSubmit=(e)=>{
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name" , name);
    myForm.set("email", email);

    if(avatar){
        myForm.set("avatar",avatar);
    }
    // for(const [key ,value ] of myForm.entries()){
    //     console.log(key,value);
    // }
    dispatch(updateProfile(myForm));
   };

    return (
        <>
            <Navbar />
            <div className="min-h-screen  bg-gray-50 flex flex-col 
    items-center py-12 sm:px-6 lg:px-8 pt-5">
                <div className="sm:mx-auto sm-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold 
         text-gray-900">update Profile</h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-10 px-6 shadow-sm rounded 
            sm:px-12 flex flex-col items-center border border-gray-100">

                        <form encType="multipart/form-data" className="w-full space-y-6" onSubmit={handleSubmit}>
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-28 h-28 mb-4 ">
                                    <img
                                        src={preview}
                                        alt="" className="rounded-full  w-full h-full object-cover border-4 
                                        border-indigo-100 shadow-sm " />
                                </div>
                                <label className="block bg-indigo-50 text-indigo-700 px-4 
                                py-2 rounded-lg font-semibold text-sm cursor-pointer
                                hover:bg-indigo-100 transition">Change Photo
                                    <input type="file" className="hidden" name="avatar"
                                     accept="image/*" onChange={handleChange} />
                                </label>
                            </div>

                            <div>
                                <label htmlFor="name" className="block text-sm 
                                font-semibold text-gray-700 ml-1">Name</label>
                                <div className="mt-1">
                                    <input id="name" name="name" type="text" 
                                    value={name} required onChange={(e)=>setName(e.target.value)}
                                        className="appearance-none block w-full px-4 py-3
                                     border border-gray-200 rounded-xl shadow-sm placeholder-gray-400
                                    focus:outline-none focus:ring-2 focus:ring-indigo-500 
                                    focus:border-transparent transition-all"/>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="name" className="block text-sm 
                                font-semibold text-gray-700 ml-1">Email Address</label>
                                <div className="mt-1">
                                    <input id="email" name="email" value={email} 
                                    type="email" required onChange={(e)=>setEmail(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3
                                     border border-gray-200 rounded-xl shadow-sm placeholder-gray-400
                                    focus:outline-none focus:ring-2 focus:ring-indigo-500 
                                    focus:border-transparent transition-all"/>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border
                                    border-transparent rounded-xl shadow-md shadow-indigo-200
                                    text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 
                                    active:scale-[0.98]"
                                 > Update Details</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdateProfile