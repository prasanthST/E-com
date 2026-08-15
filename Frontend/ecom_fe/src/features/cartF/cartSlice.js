import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || '';

export const addToCartItems = createAsyncThunk("cart/addToCart",async({id , quantity},
{rejectWithValue})=>{

    try {
        const {data}=await axios.get(`${API_URL}/api/v1/product/${id}`);
        return {
            product:data.product._id,
            name:data.product.name,
            price:data.product.price,
            image:data.product.image[0].url,
            stock:data.product.stock,
            quantity,
        }
    } catch (error) {
        return rejectWithValue(error.response?.date || "An Error Occurred while add to card");
    }
})

const initialState ={
    cartItems:JSON.parse(localStorage.getItem("cartItems")) || [] ,
    loading:false,
    error:null,
    success:false,
    message:false
};

const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers:{
        removeErrors:(state)=>{
            state.error = null ; 
        },
        removeMessage:(state)=>{
            state.message = null; 
        },
        clearCart:(state)=>{
            state.cartItems=[];
            localStorage.removeItem("cartItems");
        },
        removeItemsFromcart:(state,action)=>{
            state.cartItems = state.cartItems.filter((i)=>i.product !== action.payload);
            localStorage.setItem("cartItems",JSON.stringify(state.cartItems));
        }
    },
    extraReducers:(builder)=>{

        builder.addCase(addToCartItems.pending,(state)=>{
            state.loading= true;
            state.error= null;
        })
        builder.addCase(addToCartItems.fulfilled,(state,action)=>{
            const item = action.payload;
            const exisitingItem = state.cartItems.find((i)=>i.product === item.product);
            if(exisitingItem){
                exisitingItem.quantity = item.quantity;
                state.message = `updated ${item.name} quantity in the cart`;
            }else{
             state.cartItems.push(item) 
             state.message = `${action.payload.name} added to cart`
            }
            state.loading = false;
            state.error=null;
            state.success = true;
            localStorage.setItem("cartItems",JSON.stringify(state.cartItems));
            
        })
        builder.addCase(addToCartItems.rejected,(state,action)=>{
            state.loading =false;
            state.error = action.payload || "Somthing went wrong";
        })
    },

});
export const {removeErrors,clearCart,removeMessage,removeItemsFromcart} = cartSlice.actions;
export default cartSlice.reducer;