import { useDispatch, useSelector } from "react-redux"
import Footer from "../Components.jsx/Footer"
import Navbar from "../Components.jsx/Navbar"
import PageTitle from "../Components.jsx/PageTitle"
import { useEffect, useState } from "react"
import { getProduct, removeErrors } from "../feathures/products/productSlice"
import toast from "react-hot-toast"
import Loader from "../Components.jsx/Loader"
import Product from "../Components.jsx/Product"
import Pagination from "../Components.jsx/Pagination"
import { useNavigate, useSearchParams } from "react-router-dom"

const Products = () => {
  const {products, productCount, loading, error ,resultPerPage, } = useSelector((state)=>state.product)
  const dispatch = useDispatch()
  const navigate = useNavigate()
// search function 
const [searchParams]= useSearchParams();
const keyword = searchParams.get("keyword") || ""
// 
//pagination function
const pageFromURL = parseInt(searchParams.get('page'), 10) || 1 ;
const [currentPage , setCurrentPage]=useState(pageFromURL)
const totalPages = Math.ceil(productCount / (resultPerPage || 8))
//
const category = searchParams.get("category")||"";
// onclick for pagination
const handlePageChange = (pageNumber)=>{
  if(pageNumber !== currentPage){
     setCurrentPage(pageNumber);
     const newSearchParams = new URLSearchParams(location.search);
     if(pageNumber ===1)
      newSearchParams.delete("page");
  }else{
    newSearchParams.set("page", pageNumber); 
  }
  navigate(`?${newSearchParams.toString()}`);
}
// onclick for categories
const handleCategory=(cat)=>{
  const newSearchParams = new URLSearchParams(location.search);
  if(cat == "All"){
    newSearchParams.delete("category")
  }else{
   newSearchParams.set("category",cat);
  }
  newSearchParams.delete("page");
  navigate(`?${newSearchParams.toString()}`);
}


  useEffect(()=>{
   dispatch(getProduct({keyword , page:currentPage , category}))
  },[dispatch, keyword,currentPage,category])

  useEffect(()=>{
    if(error){
      toast.error(error.message);
      dispatch(removeErrors())
    }
  },[dispatch, error])

  return loading ? (<Loader/>): (
    <>
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PageTitle title={"products | E-commerce"}/>
      <Navbar />
      <main className="grow container mx-auto px-4 py-8">
       <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
        <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b 
          border-slate-200 pb-2">Categories</h3>
          <ul className="space-y-2">
            {["All","Electronic", "Dress","Kitchen","Toys","Sports","Accessories"].map((cat)=>(
              <li key={cat}>
                <button onClick={()=>handleCategory(cat)} className="text-gray-600 hover:text-blue-600
                 transition-colors">{cat}</button>
              </li>
            ))} 
          </ul>
        </div>
        </aside>
        <section className="w-full md:3/4 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 ">Our products</h3>
          <span className="text-gray-500 text-sm ">{products?.length || 0 } items found</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products && products.map((product)=><Product key={product._id} product={product}/>)}
      {/* No products found */}
      {products?.length === 0 && (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">{`product not found`}</p>
      </div>
      )}
        </div>
         </section>
       </div>
       {/* pagination */}
       <div className=" mt-12 flex justify-center">
      <Pagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
       </div>
      </main>
      <Footer />
    </div>
    </>
  )
}

export default Products
