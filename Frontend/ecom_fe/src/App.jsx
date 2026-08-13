import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import Register from './User/Register'
import Contact from './Pages/Contact'
import ProductDetail from './Pages/ProductDetail'
import Products from './Pages/Products'
import Login from './User/Login'
import {useDispatch, useSelector } from "react-redux"
import { useEffect } from 'react'
import { loadUser } from './features/User/userSlice'
import Profile from './User/Profile'
import UpdateProfile from './User/UpdateProfile'
import ProtectedRoute from './Components.jsx/ProtectedRoute'
import UpdatePassword from './User/UpdatePassword'
import ForgetPassword from './User/ForgetPassword'
import ResetPassword from './User/ResetPassword'
import Cart from './cart/Cart'
import CheckOut from './checkout/CheckOut'
import OrderSuccess from './checkout/OrderSuccess'
import SingleOrderDetail from "./orders/SingleOrderDetail"
import Orders from './orders/Orders'

const App = () => {
  //LoadUser , its used for user Authentication 
  const {isAuthenticated ,user }= useSelector((state)=>state.user)
  const dispatch = useDispatch();
 useEffect(()=>{
  if(isAuthenticated){
    dispatch(loadUser());
  }
 },[dispatch]);
//  console.log(isAuthenticated,user);
 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/product/:id" element={<ProductDetail/>}/>
        <Route path="/products" element={<Products/>}/>
        <Route path="/about-us" element={<About/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/contact-us" element={<Contact/>}/>
        <Route path="/profile" element={<ProtectedRoute element={<Profile/>}/>}/>
        <Route path="/update/profile" element={<ProtectedRoute element={<UpdateProfile/>}/>}/>
        <Route path="/password/update" element={<ProtectedRoute element={<UpdatePassword/>}/>}/>
        <Route path="/password/forget" element={<ForgetPassword/>}/>
        <Route path="/reset/:token" element={<ResetPassword/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/checkout" element={<ProtectedRoute element={<CheckOut/>}/>}/>
        {/* <Route path="/ordersuccess/:id" element={<ProtectedRoute element={<OrderSuccess/>}/>}/> */}
        <Route path="/ordersuccess/:id"  element={<OrderSuccess/>}/>
        <Route path="/orders/user"  element={<Orders/>}/>
        <Route path="/order/:id"  element={<SingleOrderDetail/>}/>

      </Routes>
    </BrowserRouter>
  )
}

export default App ;