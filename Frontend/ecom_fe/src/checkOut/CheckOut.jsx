import  { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { 
    createNewOrder,
    setShippingAddress,
    setPaymentMethod,
    setOrderItems,
    removeErrors,
    resetSuccess,
    loadFromStorage,
} from '../features/checkoutF/checkOutSlice';
import { clearCart } from '../features/cartF/cartSlice';
import PageTitle from '../Components.jsx/PageTitle';
import Navbar from '../Components.jsx/Navbar';
import Footer from '../Components.jsx/Footer';

const CheckOut = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const checkoutState = useSelector((state) => state.checkout) || {};
    const { 
        shippingAddress = {},
        orderItems = [],
        paymentInfo = { method: "COD" },
        itemPrice = 0,
        taxPrice = 0,
        shippingPrice = 0,
        totalPrice = 0,
        loading = false,
        error = null,
        success = false,
        order = null,
    } = checkoutState;
    
    const { cartItems = [] } = useSelector((state) => state.cart) || {};
    const user = useSelector((state) => state.user?.user || null);

    // ✅ Added email back (required by backend)
    const [formData, setFormData] = useState({
        address: shippingAddress.address || "",
        city: shippingAddress.city || "",
        state: shippingAddress.state || "",
        pincode: shippingAddress.pincode || "",
        phoneNo: shippingAddress.phoneNo || user?.phone || user?.phoneNo || "",
        email: shippingAddress.email || user?.email || "", // ✅ Added email
    });

    useEffect(() => {
        dispatch(loadFromStorage());
    }, [dispatch]);

    useEffect(() => {
        if (cartItems.length > 0) {
            const items = cartItems?.map(item => ({
                name: item.name,
                price: Number(item.price),
                quantity: Number(item.quantity),
                image: item.image,
                product: item.product,
            }));
            dispatch(setOrderItems(items));
        }
    }, [cartItems, dispatch]);

    useEffect(() => {
        if (cartItems.length === 0 && orderItems.length === 0) {
            toast.error("Your cart is empty!");
            navigate('/cart');
        }
    }, [cartItems, orderItems, navigate]);

    useEffect(() => {
        if (success && order) {
            toast.success("Order placed successfully! 🎉");
            dispatch(clearCart());
            dispatch(resetSuccess());
            navigate(`/ordersuccess/${order._id}`);
        }
    }, [success, order, dispatch, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(removeErrors());
        }
    }, [error, dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        dispatch(setShippingAddress({ [name]: value }));
    };

    const handlePaymentChange = (method) => {
        dispatch(setPaymentMethod(method));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log("📋 Current form data:", formData);

        // ✅ Added email to validation
        const requiredFields = ['address', 'city', 'state', 'pincode', 'phoneNo', 'email'];
        const missingFields = requiredFields.filter((field) => {
            const value = formData[field];
            return !value || value.trim() === '';
        });

        if (missingFields.length > 0) {
            toast.error(`Please fill all required fields: ${missingFields.join(', ')}`);
            return;
        }

        if (!/^\d{6}$/.test(formData.pincode)) {
            toast.error("Please enter a valid 6-digit pincode");
            return;
        }

        if (!/^\d{10}$/.test(formData.phoneNo)) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (orderItems.length === 0) {
            toast.error("No items in your order!");
            return;
        }

        // ✅ Added email to orderData
        const orderData = {
            shippingAddress: {
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pinCode: Number(formData.pincode),
                phoneNo: Number(formData.phoneNo),
                email: formData.email, // ✅ Added email
            },
            orderItems: orderItems?.map(item => ({
                name: item.name,
                price: Number(item.price),
                quantity: Number(item.quantity),
                image: item.image,
                product: item.product,
            })),
            paymentInfo: {
                id: paymentInfo.id || "COD_" + Date.now(),
                status: paymentInfo.method === "COD" ? "Pending" : "Completed",
            },
            paidAt: new Date().toISOString(),
            itemPrice: Number(itemPrice),
            taxPrice: Number(taxPrice),
            shippingPrice: Number(shippingPrice),
            totalPrice: Number(totalPrice),
        };

        console.log("Sending order data to backend:", JSON.stringify(orderData, null, 2));
        
        dispatch(createNewOrder(orderData));
    };

    return (
        <>
            <PageTitle title="Checkout" />
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h1 className="text-3xl font-bold text-slate-800 text-center mb-8">Checkout</h1>

                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
                        {/* Shipping Information */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                                Shipping Information
                            </h2>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address *
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                                    focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Street address, apartment, etc."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                                        focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="City"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                                        focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="State"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pincode *
                                    </label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                                        focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="123456"
                                        maxLength="6"
                                        pattern="\d{6}"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNo"
                                        value={formData.phoneNo}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                                        focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="9876543210"
                                        maxLength="10"
                                        pattern="\d{10}"
                                        required
                                    />
                                </div>
                            </div>

                            {/* ✅ Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                                    focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                                Payment Method
                            </h2>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="COD"
                                        checked={paymentInfo.method === 'COD'}
                                        onChange={() => handlePaymentChange('COD')}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="font-medium text-sm">Cash on Delivery</span>
                                    <span className="ml-auto text-xs text-gray-500">Pay when you receive</span>
                                </label>

                                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Card"
                                        checked={paymentInfo.method === 'Card'}
                                        onChange={() => handlePaymentChange('Card')}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="font-medium text-sm">Credit/Debit Card</span>
                                    <span className="ml-auto text-xs text-gray-500">Pay online</span>
                                </label>

                                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="UPI"
                                        checked={paymentInfo.method === 'UPI'}
                                        onChange={() => handlePaymentChange('UPI')}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="font-medium text-sm">UPI</span>
                                    <span className="ml-auto text-xs text-gray-500">Google Pay, PhonePe, etc.</span>
                                </label>
                            </div>
                        </div>

                        {/* Place Order Button */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={loading || orderItems.length === 0}
                                className="w-full bg-blue-600 text-white text-lg font-semibold px-6 py-4 rounded-lg 
                                hover:bg-blue-700 transition disabled:bg-blue-400 
                                disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        Processing...
                                    </>
                                ) : (
                                    `Place Order (₹${totalPrice.toFixed(2)})`
                                )}
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => navigate('/cart')}
                                className="w-full mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                                ← Back to Cart
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CheckOut;