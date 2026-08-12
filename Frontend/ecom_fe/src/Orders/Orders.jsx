import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../feathures/Orders/orderSlice';
import { Loader2, Package, Clock, Truck, CheckCircle, ShoppingBag } from 'lucide-react';
import PageTitle from '../Components.jsx/PageTitle';
import Navbar from '../Components.jsx/Navbar';
import Footer from '../Components.jsx/Footer';

const Orders = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.order);

    // Fetch all orders when component mounts
    useEffect(() => {
        dispatch(getMyOrders());
    }, [dispatch]);

    // Get status color for badge
    const getStatusColor = (status) => {
        if (!status) return 'bg-gray-100 text-gray-800';
        
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        if (!status) return <Package className="w-4 h-4" />;
        
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'processing':
                return <Clock className="w-4 h-4" />;
            case 'shipped':
                return <Truck className="w-4 h-4" />;
            case 'delivered':
                return <CheckCircle className="w-4 h-4" />;
            default:
                return <Package className="w-4 h-4" />;
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Show loading state
    if (loading) {
        return (
            <>
                <PageTitle title="My Orders" />
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="animate-spin text-blue-600 mx-auto" size={48} />
                        <p className="mt-4 text-gray-600">Loading your orders...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Show error state
    if (error) {
        return (
            <>
                <PageTitle title="My Orders" />
                <Navbar />
                <div className="min-h-screen bg-gray-50 py-12">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                            <div className="text-red-500 text-6xl mb-4">⚠️</div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Error Loading Orders</h2>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <button
                                onClick={() => dispatch(getMyOrders())}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <PageTitle title="My Orders" />
            <Navbar />
            
            <main className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-slate-800">My Orders</h1>
                        <Link
                            to="/"
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                            Continue Shopping →
                        </Link>
                    </div>

                    {/* No Orders State */}
                    {orders?.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag className="w-10 h-10 text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">No Orders Yet</h2>
                            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                            <Link
                                to="/products"
                                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        // ✅ Orders List
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                                >
                                    {/* Order Header */}
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Order ID</p>
                                            <p className="font-bold text-slate-800 text-sm">
                                                #{order._id?.slice(-8) || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Date</p>
                                            <p className="font-medium text-slate-800">
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Items</p>
                                            <p className="font-medium text-slate-800">
                                                {order.orderItems?.length || 0} items
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Total</p>
                                            <p className="font-bold text-amber-600">
                                                ₹{order.totalPrice?.toFixed(2) || '0.00'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Status</p>
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                                                {getStatusIcon(order.orderStatus)}
                                                {order.orderStatus || 'Processing'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Order Items Preview */}
                                    {order.orderItems && order.orderItems.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex flex-wrap gap-2">
                                                {order.orderItems.slice(0, 5).map((item, index) => (
                                                    <img
                                                        key={index}
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                                    />
                                                ))}
                                                {order.orderItems.length > 5 && (
                                                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                                                        +{order.orderItems.length - 5}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Button - View Details */}
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <Link
                                            to={`/order/${order._id}`}
                                            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                                        >
                                            View Order Details →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            
            <Footer />
        </>
    );
};

export default Orders;