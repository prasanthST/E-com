import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/productSlice"
import userReducer from "../features/User/userSlice";
import cartReducer from "../features/cartF/cartSlice";
import checkOutReducer from "../features/checkoutF/CheckOutSlice";
import orderReducer from "../features/ordersF/orderSlice"


export const store = configureStore({
    reducer:{
        product: productReducer,
        user:userReducer,
        cart:cartReducer,
        checkout:checkOutReducer,
        order: orderReducer,
    }
})