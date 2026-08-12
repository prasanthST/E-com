import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/productSlice"
import userReducer from "../features/User/userSlice";
import cartReducer from "../features/Cart/cartSlice";
import checkOutReducer from "../features/Checkout/checkOutSlice";
import orderReducer from "../features/Orders/orderSlice"


export const store = configureStore({
    reducer:{
        product: productReducer,
        user:userReducer,
        cart:cartReducer,
        checkout:checkOutReducer,
        order: orderReducer,
    }
})