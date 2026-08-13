import { useEffect, useState } from 'react'
import PageTitle from '../Components.jsx/PageTitle'
import Navbar from '../Components.jsx/Navbar'
import Footer from '../Components.jsx/Footer'
import Rating from '../Components.jsx/Rating'
import { Calendar, MessageSquare, Minus, PackageCheck, PackageX, Plus, ShoppingCart } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getProductDetails, removeErrors } from '../features/products/productSlice'
import toast from 'react-hot-toast'
import { calculateDiscount, formatDate } from '../utils/formatter'
import { addToCartItems, removeMessage } from '../features/cartF/cartSlice'

const ProductDetail = () => {
    const { userRating, setUserRating } = useState(0)
    const [quantity , setQuantity]=useState(1);
    const { loading, error, product } = useSelector((state) => state.product);
    const {loading:cartLoading , error:cartError,cart,success,message}=useSelector((state)=>state.cart)


    const { id } = useParams();
    const dispatch = useDispatch()
     
    useEffect(() => {
        if (id) {
            dispatch(getProductDetails(id));
        }
    }, [dispatch, id])

    useEffect(() => {
        if (error)
            toast.error(error.message);
        dispatch(removeErrors());
    }, [dispatch, error]);

    useEffect(()=>{
        if(success){
           toast.success(message,{position:"top-center" , autoClose:3000})
           dispatch(removeMessage());
        }
    },[dispatch,success,message])

    const increaseQuantity =()=>{
        if(product.stock <= quantity){
            toast.error("Cannot exceed available stock" ,
                {position:"top-center" , autoClose:3000})
            dispatch(removeErrors());
            return;
        }
        setQuantity(quantity + 1);
    }

    const decreasQuantity =()=>{
        if(quantity<=1){
            toast.error("Quantity cannot be less then 1 ",
                {Position:"top-center" ,autoClose:3000})
            dispatch(removeErrors())
            return;
        }
        setQuantity(quantity - 1);
    }

    const addToCartHandler=()=>{
        dispatch(addToCartItems({id,quantity}))
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <PageTitle title={`${product?.name}`} />
            <Navbar />
            <main className='max-w-7xl mx-auto px-4 py-8 md:py-12'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8' >
                    {/* image Gallery */}
                    <div>
                        <div className='aspect-square overflow-hidden rounded-xl'>
                            <img src={product?.image[0].url}
                                alt={product?.name}
                                className='w-full h-full object-cover transition-transform hover:scale-150 duration-700'
                                title={product?.name} />
                        </div>
                    </div>
                    {/* product info */}
                    <div className='flex flex-col'>
                        <h3 className='text-3xl font-semibold text-gray-900 mb-2'>{product?.name}</h3>
                        <div className='flex items-center gap-4 mb-4'>
                            <Rating value={product?.ratings} disable={true} />
                            <span className='text-sm text-gray-500 font-medium'>{product?.numOfReviews} Verified Reviews </span>
                        </div>
                        <div className='mb-6 flex items-baseline gap-3'>
                            <span className='text-4xl font-semibold text-amber-600'>₹ {product?.price}</span>
                            <span className='text-lg text-gray-400 line-through'>₹ {product?.mrp}</span>
                            <span className='text-sm font-bold text-green-600 bg-green-50 px-2 py-1
                            rounded'>{calculateDiscount(product?.price, product?.mrp)}% OFF</span>
                        </div>
                        <p className='text-gray-600 leading-relaxed mb-8 text-lg'>{product?.description}
                        </p>
                        <div className='border-t border-gray-100 pt-8 mb-8'>
                            <div className='flex items-center gap-2 mb-6'>
                                {product?.stock > 1 ? (<>
                                    <PackageCheck className='text-green-600 w-5 h-5' />
                                    <span className='font-semibold text-green-700 text-sm'>IN STOCK ({product?.stock} Available)</span></>
                                ) : (<>
                                    <PackageX className='text-red-600 w-5 h-5' />
                                    <span className='font-semibold text-red-700 text-sm'>OUT OF STOCK</span>
                                </>)}
                            </div>

                            {product?.stock > 0 && (<div className='flex flex-wrap items-center gap-4'>
                                <div className='flex items-center border-2 border-gray-100 
                                    rounded-xl bg-white overflow-hidden '>
                                    <button onClick={decreasQuantity} className='p-4 hover:bg-gray-50 hover:text-amber-600 
                                        transition-colors'><Minus size={18} /></button>
                                    <span className='w-10 text-center font-bold text-gray-800'>{quantity}</span>
                                    <button onClick={increaseQuantity} className='p-4 hover:bg-gray-50 hover:text-amber-600 
                                        transition-colors'>
                                            <Plus size={18} /></button>
                                </div>
                                <button onClick={addToCartHandler}
                                 disabled={cartLoading}
                                 className={`flex-1 bg-blue-600 hover:bg-blue-700 
                                    text-white font-bold py-4 px-8 rounded-xl flex items-center
                                    justify-center gap-3 transition-all shadow-xl shadow-blue-100 
                                    active:scale-95 ${cartLoading ? "opacity-50 cursor-not-allowed":" "}`}>
                                        {cartLoading ? ("Adding..."):(<><ShoppingCart /> Add to Cart</>)}
  
                                </button>
                            </div>

                            )}
                        </div>
                        <form className='bg-slate-50 p-6 rounded-2xl border border-slate-100'>
                            <h3 className='text-md font-bold mb-4 flex items-center
                             gap-2 text-slate-800 uppercase tracking-tight'>
                                <MessageSquare className='text-amber-500' size={18} />Share Your Feedback
                            </h3>
                            <div className='mb-4'>
                                <Rating value={0} disable={false}
                                    onRatingChange={(r) => setUserRating(r)} />
                            </div>
                            <textarea placeholder='How was the product quality and delivery 
                            'className='w-full p-4 rounded-xl border-2 border-white 
                            focus:border-amber-400 focus:ring-0 outline-none min-h-24
                            text-sm bg-white shadow-sm transition-all'></textarea>
                            <button className='mt-4 w-full bg-slate-900 text-white
                            py-3 rounded-xl font-bold hover:bg-black transition-all 
                            shadow-lg shadow-slate-200'>Post Review</button>
                        </form>

                    </div>
                </div>
                {/* Customer Review Section */}
                <section className='mt-20'>
                    <div className='mb-10'>
                        <h3 className='text-2xl font-bold text-gray-900
                        border-l-4 border-amber-500 pl-4'>Customer Stories</h3>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        {product?.reviews.map((rev, index) => (
                            <div key={index} className='bg-white p-8 rounded-2xl shadow-sm border 
                     border-gray-100 hover:border-amber-200 transition-colors groups'>
                                <div className='flex justify-between items-start mb-6'>
                                    <div className='flex items-center gap-4'>
                                        <div className='w-14 h-14 rounded-full 
                                        overflow-hidden ring-4 ring-gray-50 
                                        group-hover:ring-amber-50
                                        transition-all'>
                                            <img src={rev?.avatar} alt={rev?.avatar} className='w-full h-full 
                                            object-cover'/>
                                        </div>
                                        <div>
                                        <h4 className='font-bold text-gray-900 text-lg'>{rev?.name}</h4>
                                        <div className='mt-1'>
                                            <Rating value={rev?.rating} />
                                        </div>
                                    </div>
                                    </div>
                                    <div className='flex items-center gap-1.5 text-xs font-bold 
                                    text-gray-400 bg-gray-50 px-3 py-1.5 
                                    rounded-full border border-gray-100 '>
                                        <Calendar size={12} />
                                        {formatDate(rev?.createdAt)}
                                    </div>
                                </div>
                                <p className='text-gray-600 leading-relaxed italic 
                                font-medium'>"{rev?.comment}"</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

export default ProductDetail
