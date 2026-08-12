import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux"
import {login, removeErrors, removeSuccess} from "../features/User/userSlice"
import toast from "react-hot-toast";


const Login = () => {
      const [email ,setEmail]= useState("") 
      const [password ,setPassword]= useState("") 
      const dispatch = useDispatch();
      const navigate = useNavigate();

      const {error,loading,success,isAuthenticated}=useSelector((state)=>state.user);

      const loginSubmit =(e)=>{
        e.preventDefault();
        dispatch(login({email,password}))
      }

       useEffect(()=>{
    if(error){
      toast.error(error,{position:"top-center", autoClose:3000});
      dispatch(removeErrors());
    }
  },[dispatch,error]);

  useEffect(()=>{
    if(success){
      toast.success("Login Successfully" ,{position:"top-center" , autoClose:3000});
      dispatch(removeSuccess());
      navigate("/")
    }
  }, [dispatch, success, navigate])


  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
        <form onSubmit={loginSubmit}  className="space-y-6">
          <div className="text-center">
            <h2 className="font-bold text-3xl text-gray-800">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-500">Please enter your details to sign in </p>
          </div>
         
          <div className="space-y-1">
            <label className=" block text-sm font-medium text-gray-700
            ml-1">Email</label>
            <input  
            type="email"  
            name="email"
            value={email}
            placeholder="Email"
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border
            border-gray-200 focus:ring-2 focus:ring-indigo-500 focus-border-transparent
            outline-none transition-all" />
          </div>
          <div className="space-y-1">
            <label className=" block text-sm font-medium text-gray-700 ml-1">Password</label>
            <input  
            type="password" 
            name="password"
            value={password}
            placeholder="Password"
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border
            border-gray-200 focus:ring-2 focus:ring-indigo-500 focus-border-transparent
            outline-none transition-all" />
          </div>
          
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white
           font-semibold py-3 rounded-xl shadow-lg shadow-indigo-200
            transition-all active:scale-[0.98]">Login
            </button>

          <p className="text-center text-sm text-gray-600">
            Don't  have an account?
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline"> Sign up Here</Link>
            </p>
            <p className="text-center text-sm text-gray-600">Forget your Password?
              <Link to={"/password/forget"} className="text-indigo-600 font-semibold hover:underline"> Reset Password</Link>
            </p>
        </form>
      </div>
    </div>
  )
}

export default Login