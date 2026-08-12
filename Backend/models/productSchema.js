import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter product name"],
  },
  description: {
    type: String,
    required: [true, "please enter product description"],
  },
  mrp:{
    type:Number,
    required:[true ,"please enter product price"],
    maxLength:[7,"price cannot exceed 7 digit"] 
  },
  price: {
    type: Number,
    required: [true, "please enter product price"],
  },
  ratings: {  // ✅ Fixed: was "reting"
    type: Number,
    default: 0,
  },
  image: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: { type: String, required: true },
    },
  ],
  category: {
    type: String,
    required: [true, "please enter your category"], 
  },
  stock: {
    type: Number,  
    required: [true, "please enter your stock"],
    default: 1,
  },
  numOfReviews: {
    type: Number,  
    default: 0
  },
  reviews: [
    {
      user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
      avatar:{ type:String, required:true },
      name: { type: String, required: true },
      rating: { type: Number, required: true },  
      comment: { type: String, required: true },
      createdAt:{
        type:Date,
        default:Date.now
      },
    }
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Products = mongoose.model('Products', productSchema); 

export default Products;
