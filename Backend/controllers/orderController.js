import Order from "../models/orderSchema.js";
import Product from "../models/productSchema.js"
import HandleError from "../helper/handleError.js";
import orderSchema from "../models/orderSchema.js";

// Create New Order 
export const createNewOrder = async (req,res,next)=>{
    const {shippingAddress,orderItems,paymentInfo ,itemPrice,taxPrice,shippingPrice,totalPrice} = req.body;

    const order = await Order.create({
        shippingAddress,
        orderItems,
        paymentInfo ,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
    })
    res.status(201).json({
        success:true,
        order
    })
}
// get single Order Details
export const getOrderDetails = async(req,res,next)=>{
   const order = await Order.findById(req.params.id).populate("user" , "name email")
   if(!order){
    return next(new HandleError("Order not found" , 400))
   }
   res.status(200).json({
    success:true,
    order
   }) 
}
// get all order Details of single user (who logined)
export const getAllOrders = async(req,res,next)=>{
    const order = await Order.find({user:req.user._id})
    if(!order){
        return next(new HandleError( "Order not found",404 ))
    }
    res.status(200).json({
        success:true,
        order
    })
}
//get all order details by admin  
export const getAllOrdersByAdmin = async (req,res,next)=>{
    const orders = await Order.find().populate("user", "name email")
    if(!orders){
        return next(new HandleError("Order not found" , 404))
    } 
    let totalAmount = 0 ;
    orders.forEach((order) => totalAmount += order.totalPrice)
    res.status(200).json({
        success:true,
        orders,
        totalAmount
    })
} 
//Admin can delete Orders / after the orderStatus = delivered,
export const deleteOrder = async (req, res, next)=>{
 const order = await Order.findById(req.params.id);
 if(!order){
        return next(new HandleError("Order not found" , 404))
    }
    if(order.orderStatus !== "Delivered"){
         return next(new HandleError("This order is Under processing and can't be deleted" , 404))
    }
    await Order.deleteOne({_id:req.params.id});
    res.status(200).json({
        success: true ,
        message :"Order delete Successfully"
    })
} 
//Admin order update and stock 
export const updateOrderStatus =async (req,res,next)=>{
    const id = req.params.id;
    const order = await Order.findById(id);
    if(!order){
        return next(new HandleError("Order is not found",400))
    }
    if(order.orderStatus === "Delivered"){
        return next(new HandleError("This order is already been delivered",404))
    }
    // Update Stock
    await Promise.all(order.orderItems.map((item)=>updateQuantity(item.product , item.quantity)))

    order.orderStatus = req.body.status;
    if(order.orderStatus === "Delivered"){
        order.deliveredAt = Date.now();
    }
    await order.save({validateBeforeSave:false})
    res.status(200).json({
        success: true,
        order
    })
    async function updateQuantity(id , quantity) { 
        const product = await Product.findById(id)
        if(!product){
            throw new Error("product not found")
        }
        product.stock -= quantity;
        await product.save({validateBeforeSave:false})
    }
} 
