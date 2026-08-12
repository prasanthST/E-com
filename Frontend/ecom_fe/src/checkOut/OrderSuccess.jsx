import  { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Clock, CheckCircle2 } from 'lucide-react';
import PageTitle from '../Components.jsx/PageTitle';
import Navbar from '../Components.jsx/Navbar';
import Footer from '../Components.jsx/Footer';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { order, success } = useSelector((state) => state.checkout);

    // If no order, redirect to home
    useEffect(() => {
        if (!order && !success) {
            navigate('/');
        }
    }, [order, success, navigate]);

    // Format date
    const formatDate = (dateString) => {
        if (!dateString)
         return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <PageTitle title="Order Placed Successfully" />
            <Navbar />
            
            <main className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-3xl">
                    {/* Success Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        {/* Success Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-12 h-12 text-green-500" />
                            </div>
                        </div>
                        
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">
                            Order Placed Successfully! 🎉
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Thank you for your order. Your order has been confirmed and will be processed soon.
                        </p>

                        {/* Order Details */}
                        <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Order ID</p>
                                    <p className="font-bold text-slate-800 text-sm break-all">
                                        #{order?._id || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Order Date</p>
                                    <p className="font-medium text-slate-800">
                                        {formatDate(order?.createdAt || order?.paidAt)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Payment Method</p>
                                    <p className="font-medium text-slate-800">
                                        {order?.paymentInfo?.method || 'Cash on Delivery'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Order Status</p>
                                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                        {order?.orderStatus || 'Processing'}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-500">Shipping Address</p>
                                <p className="text-slate-800">
                                    {order?.shippingAddress?.address},<br />
                                    {order?.shippingAddress?.city}, {order?.shippingAddress?.state} - {order?.shippingAddress?.pinCode},<br />
                                    Phone: {order?.shippingAddress?.phoneNo}
                                </p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <div>
                                        
                                    <p className="text-2xl font-bold text-amber-600 flex justify-center items-center">
                                        ₹{order?.totalPrice?.toFixed(2) || '0.00'}
                                    </p>
                                     <p className='text-sm text-gray-500'> Included all tax & shipping charges</p>

                                    
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items Summary */}
                        {order?.orderItems && order.orderItems.length > 0 && (
                            <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
                                <h3 className="font-bold text-slate-800 mb-3">Order Items</h3>
                                <div className="space-y-3">
                                    {order.orderItems.map((item, index) => (
                                        <div key={index} className="flex items-center gap-3 pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-800 text-sm">{item.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    ₹{item.price} × {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-bold text-amber-600 text-sm">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                                
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                             <Link
                                to="/orders/user"
                                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg 
                                hover:bg-blue-700 transition text-center font-medium"
                            >
                                📋 View My Orders
                            </Link>
                            <Link
                                to="/"
                                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg 
                                hover:bg-gray-300 transition text-center font-medium"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </>
    );
};

export default OrderSuccess;