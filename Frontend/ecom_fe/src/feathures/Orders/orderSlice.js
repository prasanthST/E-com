import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch All Orders for Logged-in User
export const getMyOrders = createAsyncThunk(
  "order/getMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/orders/user");
      console.log(data.order);
      return data.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders",
      );
    }
  },
);
// get Single order details
export const getOrderDetail = createAsyncThunk("order/getOrderDetail" , async(orderId ,{rejectWithValue})=>{
    try {
        const {data} = await axios.get(`/api/v1/order/${orderId}`)
        return data.order;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Failed to fetch order details"
        );
    }
} )


const initialState = {
  orders: [], // All orders for the user
  loading: false,
  error: null,
  success: false,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearOrders: (state) => {
            state.orders = [];
        },
  },
  extraReducers: (builder) => {
    builder
      // Get All Orders
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
        state.success = true;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch orders";
        state.success = false;
      })
      .addCase(getOrderDetail.pending,(state)=>{
        state.loading = true;
        state.error = null; 
      })
      //get Single Order details 
      .addCase(getOrderDetail.fulfilled,(state,action)=>{
        state.loading = false;
        state.order = action.payload;
        state.error = null;
        state.success = null;
      })
      .addCase(getOrderDetail.rejected ,(state,action)=>{
        state.loading = false;
        state.success = null ;
        state.error = action.payload || "Failed to fetch order details"
      })
  },
});

export const { clearErrors, clearSuccess ,clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
