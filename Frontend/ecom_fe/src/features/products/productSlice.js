import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'


// ✅ Add this at the top of every slice file
const API_URL = import.meta.env.VITE_API_URL || '';
// product details for products page 
export const getProduct = createAsyncThunk("product/getProduct",async ({keyword , page=1, category},{rejectWithValue})=>{
    try {
        //  const link =  keyword ?`/api/v1/products?keyword=${encodeURIComponent(keyword)}&page=${page}`
        //  :`/api/v1/products?page=${page}` 
        let link = `${API_URL}/api/v1/products?page=${page}`;
        if(category){
          link += `&category=${category}`; 
        }
        if(keyword){
          link += `&keyword=${keyword}`;
        }
         const {data} = await axios.get(link)
         console.log(data)
         return data; 
    } catch (error) {
       return rejectWithValue(error.response?.date || "somthing went wrong...!")         
    }
})


//All product details for home page 
export const getProductDetails = createAsyncThunk("product/getProductDetails",async (id,{rejectWithValue})=>{
    try {
         const link =`${API_URL}/api/v1/product/${id}`;
         const {data} = await axios.get(link)
        //  console.log(data)
         return data; 
    } catch (error) {
       return rejectWithValue(error.response?.data || "somthing went wrong...!")         
    }
})
// productSlice
const productSlice = createSlice({
    name: "product",
    initialState:{
        products:[],
        productCount:0,
        loading:false,
        error: null,
        product: null,
        resultPerPage:4,
        totalPages:0,
    },
    reducers:{ 
        removeErrors:(state)=>{
            state.error = null;
        }
    },
    extraReducers:(builder)=>{
      builder
      .addCase(getProduct.pending,(state)=>{
        state.loading = true;
        state.error = null ; 
      })
      .addCase(getProduct.fulfilled,(state,action)=>{
        console.log("fullfilled action payload", action.payload);
        state.loading = false;
        state.error = null; 
        state.products = action.payload.products;
        state.productCount = action.payload.productCount;
        state.resultPerPage = action.payload.resultPerPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getProduct.rejected,(state, action)=>{
        state.loading = false;
        state.products = [];
        state.error = action.payload || "somthing went wrong" ; 
      })

      builder
      .addCase(getProductDetails.pending,(state)=>{
        state.loading = true;
        state.error = null ; 
      })
      .addCase(getProductDetails.fulfilled,(state,action)=>{
        console.log("fullfilled action payload", action.payload);
        state.loading = false;
        state.error = null ; 
        state.product = action.payload.product;
      })
      .addCase(getProductDetails.rejected,(state, action)=>{
        state.loading = false;
        state.error = action.payload || "somthing went wrong" ; 
      })

    }
});


export const {removeErrors} = productSlice.actions; 
export default productSlice.reducer