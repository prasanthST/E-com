import { useDispatch, useSelector } from "react-redux"
import PageTitle from "../Components.jsx/PageTitle";
import Navbar from "../Components.jsx/Navbar";
import Footer from "../Components.jsx/Footer";
import CartItem from "./CartItem";
import { clearCart } from "../features/Cart/cartSlice";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Cart = () => {
    const { success, loading, error, message, cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.18;
    const shippingcharges = cartItems.length === 0 ? 0 : subtotal > 5000 ? 0 : 50;
    const total = subtotal + tax + shippingcharges;

    const handleCheckOut =()=>{
        if(cartItems.length === 0 ){
            toast.error("Your cart is empty! Add items before checkOut");
            return; 
        }
        navigate("/checkOut")
    }

    return (
        <>
            <PageTitle title="Your Cart" />
            <Navbar />
            <main className="pt-20 pb-10 min-h-screen">
                <div className="container mx-auto px-4 ">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
                        {/* {Cart Details} */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex 
                                justify-between">Your Cart
                                    <button onClick={() => dispatch(clearCart())}
                                        className=" flex items-center text-sm text-red-500 hover:text-red-700
                                         transition-colors"><Trash2 />Clear Cart</button>
                                </h2>
                                <div className="space-y-4 ">
                                    {cartItems.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-gray-500">Your cart is empty</p>
                                        </div>
                                    ) : (cartItems.map((item) => <CartItem item={item} key={item.product} />)
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* {Amount Details} */}
                        <div className="lg:col-span-1">
                            <div className="bg-white  rounded-2xl shadow-lg p-6 sticky top-24">
                                <h2 className="text-2xl font-bold text-slate-800 mb-6 ">Order Summary</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-bold">₹ {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-bold">₹ {shippingcharges.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax 18%</span>
                                        <span className="font-bold">₹{tax.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-slate-800 text-xl font-bold">Total</span>
                                            <span className="text-xl font-bold text-amber-600">₹{total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                 <button onClick={handleCheckOut} to="/checkout" className="w-full bg-blue-600 text-white px-4 py-3 
                            rounded-lg hover:bg-blue-700 transition mt-5" disabled={cartItems.length === 0 }>Proceed to Checkout</button>
                            </div> 
                        </div>
                    </div>
                </div>

            </main>
            <Footer />
        </>
    )
}

export default Cart