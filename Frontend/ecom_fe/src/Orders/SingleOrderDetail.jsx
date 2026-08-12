import  { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getOrderDetail, clearOrders } from '../feathures/Orders/orderSlice';
import { Loader2, MapPin, CreditCard, Calendar, Package } from 'lucide-react';
import PageTitle from '../Components.jsx/PageTitle';
import Navbar from '../Components.jsx/Navbar';
import Footer from '../Components.jsx/Footer';

const SingleOrderDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { order, loading, error } = useSelector((state) => state.order) || {};

    useEffect(() => {
        if (id) {
            dispatch(getOrderDetail(id));
        }
        return () => {
            dispatch(clearOrders());
        };
    }, [id, dispatch]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        if (!status) return 'bg-gray-100 text-gray-800';
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'processing': return 'bg-yellow-100 text-yellow-800';
            case 'shipped': return 'bg-blue-100 text-blue-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <>
                <PageTitle title="Loading Order..." />
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <PageTitle title="Error" />
                <Navbar />
                <div className="min-h-screen bg-gray-50 py-12">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Order</h2>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <Link to="/orders/user" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                                Back to Orders
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!order) {
        return (
            <>
                <PageTitle title="Order Not Found" />
                <Navbar />
                <div className="min-h-screen bg-gray-50 py-12">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Not Found</h2>
                            <Link to="/orders/user" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                                Back to Orders
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <PageTitle title={`Order #${order._id?.slice(-8)}`} />
            <Navbar />
            
            <main className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Back Button */}
                    <Link 
                        to="/orders/user" 
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium"
                    >
                        ← Back to Orders
                    </Link>

                    {/* Order Header */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">
                                    Order #{order._id?.slice(-8)}
                                </h1>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                    <Calendar className="w-4 h-4" />
                                    Placed on {formatDate(order.createdAt || order.paidAt)}
                                </div>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                                {order.orderStatus || 'Processing'}
                            </span>
                        </div>
                    </div>

                    {/* ✅ TWO CARDS IN ROW - 2 COLUMN LAYOUT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* CARD 1: Order Details & Shipping */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                            {/* Customer Info */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                    Customer Details
                                </h3>
                                <p className="font-medium text-slate-800">
                                    {order?.user?.name || 'Guest User'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {order?.user?.email || 'No email provided'}
                                </p>
                            </div>

                            {/* Payment Info */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                    Payment Method
                                </h3>
                                <p className="font-medium text-slate-800">
                                    {order?.paymentInfo?.method || 'Cash on Delivery'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Status: {order?.paymentInfo?.status || 'Pending'}
                                </p>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                    Shipping Address
                                </h3>
                                <p className="text-slate-800">
                                    {order?.shippingAddress?.address},<br />
                                    {order?.shippingAddress?.city}, {order?.shippingAddress?.state} - {order?.shippingAddress?.pinCode},<br />
                                    Phone: {order?.shippingAddress?.phoneNo}
                                </p>
                            </div>
                        </div>

                        {/* CARD 2: Order Summary & Items */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                            {/* Order Summary */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                    Order Summary
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Item Price</span>
                                        <span className="font-medium">₹{order?.itemPrice?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax (18%)</span>
                                        <span className="font-medium">₹{order?.taxPrice?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium">₹{order?.shippingPrice?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2 mt-2">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-slate-800">Total</span>
                                            <span className="text-xl font-bold text-amber-600">
                                                ₹{order?.totalPrice?.toFixed(2) || '0.00'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                    Order Items ({order?.orderItems?.length || 0})
                                </h3>
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                    {order?.orderItems?.map((item, index) => (
                                        <div key={index} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-slate-800 text-sm truncate">
                                                    {item.name}
                                                </p>
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
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </>
    );
};

export default SingleOrderDetail;