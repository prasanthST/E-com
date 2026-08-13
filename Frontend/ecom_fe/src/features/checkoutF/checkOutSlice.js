import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const createNewOrder = createAsyncThunk("checkout/createNewOrder",
async (orderData, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const { data } = await axios.post("/api/v1/new/order", orderData, config);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create order"
            );
        }
    }
);

const initialState = {
    shippingAddress: {
        address: "",
        city: "",
        state: "",
        pincode: "",
        phoneNo: "",
        email: "",
    },
    orderItems: [],
    paymentInfo: {
        id: "",
        status: "",
        method: "COD",
    },
    itemPrice: 0,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 0,
    loading: false,
    error: null,
    success: false,
    order: null,
};

const CheckOutSlice = createSlice({
    name: "checkout",
    initialState,
    reducers: {
        setShippingAddress: (state, action) => {
            state.shippingAddress = { ...state.shippingAddress, ...action.payload };
            localStorage.setItem("shippingAddress", JSON.stringify(state.shippingAddress));
        },
        setPaymentMethod: (state, action) => {
            state.paymentInfo.method = action.payload;
            if (action.payload === "COD") {
                state.paymentInfo.id = "COD_" + Date.now();
                state.paymentInfo.status = "Pending";
            }
        },
        setPaymentInfo: (state, action) => {
            state.paymentInfo = { ...state.paymentInfo, ...action.payload };
        },
        calculateTotals: (state) => {
            state.itemPrice = state.orderItems.reduce(
                (acc, item) => acc + item.price * item.quantity, 
                0
            );
            state.taxPrice = state.itemPrice * 0.18;
            state.shippingPrice = state.itemPrice > 5000 ? 0 : 50;
            state.totalPrice = state.itemPrice + state.taxPrice + state.shippingPrice;
            
            state.itemPrice = Number(state.itemPrice.toFixed(2));
            state.taxPrice = Number(state.taxPrice.toFixed(2));
            state.shippingPrice = Number(state.shippingPrice.toFixed(2));
            state.totalPrice = Number(state.totalPrice.toFixed(2));
        },
        setOrderItems: (state, action) => {
            state.orderItems = action.payload;
            CheckOutSlice.caseReducers.calculateTotals(state);
            localStorage.setItem("orderItems", JSON.stringify(state.orderItems));
        },
        clearCheckout: (state) => {
            state.shippingAddress = initialState.shippingAddress;
            state.orderItems = [];
            state.paymentInfo = initialState.paymentInfo;
            state.itemPrice = 0;
            state.taxPrice = 0;
            state.shippingPrice = 0;
            state.totalPrice = 0;
            state.loading = false;
            state.error = null;
            state.success = false;
            state.order = null;
            localStorage.removeItem("shippingAddress");
            localStorage.removeItem("orderItems");
        },
        resetSuccess: (state) => {
            state.success = false;
        },
        removeErrors: (state) => {
            state.error = null;
        },
        loadFromStorage: (state) => {
            const savedAddress = localStorage.getItem("shippingAddress");
            if (savedAddress) {
                state.shippingAddress = JSON.parse(savedAddress);
            }
            const savedItems = localStorage.getItem("orderItems");
            if (savedItems) {
                state.orderItems = JSON.parse(savedItems);
                CheckOutSlice.caseReducers.calculateTotals(state);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createNewOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createNewOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.order = action.payload.order;
                state.error = null;
            })
            .addCase(createNewOrder.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Failed to create order";
            });
    },
});

export const {
    setShippingAddress,
    setPaymentMethod,
    setPaymentInfo,
    calculateTotals,
    setOrderItems,
    clearCheckout,
    resetSuccess,
    removeErrors,
    loadFromStorage,
} = CheckOutSlice.actions;

export default CheckOutSlice.reducer;