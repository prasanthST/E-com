import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useSelector , useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { register, removeSuccess } from "../features/User/userSlice";
import { removeErrors } from "../features/products/productSlice";

const Register = () => {

  const [preview, setPreview] = useState("https://ui-avatars.com/api/?name=User&background=random")
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [avatar, setAvatar] = useState("");
  const { name, email, password } = user;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {success ,error , loading}=useSelector((state)=>state.user)

  const handleChange = (e) => {
    if (e.target.name == "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setPreview(reader.result)
          setAvatar(reader.result);  
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value })
    }
  };
  const registerNow = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill out all the required fields", {
        position: "top-center", autoClose: 3000
      })
      return;
    }
    const myForm = new FormData();
    myForm.set("name", name)
    myForm.set("email", email)
    myForm.set("password", password)
    myForm.set("avatar", avatar)
    // console.log(myForm.entries());
    // for (let pair of myForm.entries()) {
    //   console.log(pair[0] + ":" + pair[1]);
    // } 

    dispatch(register(myForm));
  };

  useEffect(()=>{
    if(error){
      toast.error(error,{position:"top-center", autoClose:3000});
      dispatch(removeErrors());
    }
  },[dispatch,error]);

  useEffect(()=>{
    if(success){
      toast.success("Registration Successfully" ,{position:"top-center" , autoClose:3000});
      dispatch(removeSuccess());
      navigate("/login")
    }
  }, [dispatch, success, navigate])


  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
        <form encType="multiPart/form-data" onSubmit={registerNow} className="space-y-6">
          <div className="text-center">
            <h2 className="font-bold text-3xl text-gray-800">Create Account</h2>
            <p className="mt-2 text-sm text-gray-500">Join us and start your journey</p>
          </div>
          <div className="space-y-1">
            <label className=" block text-sm font-medium text-gray-700
            ml-1">Username</label>
            <input onChange={handleChange} type="username" value={name} name="name" placeholder="Name" className="w-full px-4 py-3 rounded-xl border
            border-gray-200 focus:ring-2 focus:ring-indigo-500 focus-border-transparent
            outline-none transition-all" />
          </div>
          <div className="space-y-1">
            <label className=" block text-sm font-medium text-gray-700
            ml-1">Email</label>
            <input onChange={handleChange} type="email" value={email} name="email" placeholder="Email" className="w-full px-4 py-3 rounded-xl border
            border-gray-200 focus:ring-2 focus:ring-indigo-500 focus-border-transparent
            outline-none transition-all" />
          </div>
          <div className="space-y-1">
            <label className=" block text-sm font-medium text-gray-700
            ml-1">Password</label>
            <input onChange={handleChange} type="password" value={password} name="password" placeholder="Password" className="w-full px-4 py-3 rounded-xl border
            border-gray-200 focus:ring-2 focus:ring-indigo-500 focus-border-transparent
            outline-none transition-all" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <img id="preview" src={preview} alt="" className="h-12 w-12 object-cover 
            rounded-sm bg-gray-100"/>
            </div>
            <label className="block">
              <span className="sr-only">Choose Profile Photo</span>
              <input onChange={handleChange} type="file" name="avatar" accept="image/*"
                className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm  
              file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            </label>
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white
           font-semibold py-3 rounded-xl shadow-lg shadow-indigo-200
            transition-all active:scale-[0.98]">{loading ? "please wait":"Sign Up"}</button>
          <p className="text-center text-sm text-gray-600">
            Already have an account?
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline"> Sign in Here</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Register
