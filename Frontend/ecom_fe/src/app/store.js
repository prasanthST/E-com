import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../feathures/products/productSlice"
import userReducer from "../feathures/User/userSlice";
import cartReducer from "../feathures/Cart/cartSlice";
import checkOutReducer from "../feathures/Checkout/checkOutSlice";
import orderReducer from "../feathures/Orders/orderSlice"


export const store = configureStore({
    reducer:{
        product: productReducer,
        user:userReducer,
        cart:cartReducer,
        checkout:checkOutReducer,
        order: orderReducer,
    }
})