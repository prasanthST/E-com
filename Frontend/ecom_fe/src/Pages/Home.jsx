import { useEffect } from 'react'
import Navbar from '../Components.jsx/Navbar';
import ImageSlider from '../Components.jsx/ImageSlider';
import Footer from '../Components.jsx/Footer';
import Product from '../Components.jsx/Product';
import PageTitle from '../Components.jsx/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, removeErrors } from '../feathures/products/productSlice';
import Loader from '../Components.jsx/Loader';
import toast from "react-hot-toast"


const Home = () => {

  const {products, productCount, loading, error} = useSelector((state)=>state.product)
  const dispatch = useDispatch()

  useEffect(()=>{
   dispatch(getProduct({ keyword: '' }))
  },[dispatch])

  useEffect(()=>{
    if(error){
      toast.error(error);
      dispatch(removeErrors())
    }
  },[dispatch, error])
  
  useEffect(() => {
    console.log("Current Home State:", { products: products.length, productCount, loading, error });
  }, [products, productCount, loading, error]);

  return (
    loading?(<Loader/>):(
    <>  
    <PageTitle title= {"Home | E-com"}/>
    <Navbar/>
    <ImageSlider />
    <div className='mt-12 p-8 flex flex-col items-center justify-around text-gray-900'>
      <h1 className='text-4xl font-semibold mb-8 text-blue-700 text-center drop-shadow-sm'>Latest Collection</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
        {products.map((product,index)=>(<Product key={index} product = {product}/>))}
      </div>
    </div>
    <Footer />
    </>
    )
    )
}

export default Home;
