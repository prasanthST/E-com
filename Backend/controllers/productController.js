import Products from "../models/productSchema.js";
import HandleError from "../helper/handleError.js";
import APIHelper from "../helper/APIHelper.js";

//create Product
export const createProduct = async (req, res) => {
  try {
    //add new key as a user ,use to store who creates the product
    req.body;
    const product = await Products.create(req.body);
    console.log("new product");
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.log(error);
  }
};

//Update Product
export const productUpdate = async (req, res, next) => {
  try {
    const productId = req.params.id.trim();
    const product = await Products.findByIdAndUpdate(productId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      //   res.status(404).json({ message: "product not found" });
      return next(new HandleError("Product not found", 404));
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.log(error);
  }
};

//Get All Product
export const getAllProducts = async (req, res, next) => {
  try {
    // const products = await Products.find();
    const resultPerPage = 6;
    const apiHelper = new APIHelper(Products.find(), req.query)
      .search()
      .filter(); //new obj for apihelper
    const filteredQuery = apiHelper.query.clone(); // copy of the query after the filter&search /
    const productCount = await filteredQuery.countDocuments(); // count of the product after get

    const totalPages = Math.ceil(productCount / resultPerPage); // how many pages required
    const page = Number(req.query.page) || 1; //check current page

    if (totalPages > 0 && page > totalPages) {
      return next(new HandleError("This page doesn't exist", 404));
    }
    apiHelper.pagenation(resultPerPage);
    const products = await apiHelper.query;
    res.status(200).json({
      success: true,
      products,
      productCount,
      resultPerPage,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Get Single Product
export const getSingleProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Products.findById(id);
    if (!product) {
      //   return res.status(500).json({ message: " Internal server error " });
      return next(new HandleError("Product not found ", 404));
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.log(error);
  }
};

//Delete Product
export const deleteProduct = async (req, res, next) => {
  try {
    const delId = req.params.id;
    const product = await Products.findByIdAndDelete(delId);
    if (!product) {
      //return res.status(500).json({message:"product not found"})
      return next(new HandleError(404, "Product not found"));
    }
    res.status(200).json({ success: true, message: "product was deleted" });
  } catch (error) {
    console.log(error);
  }
};

// Review given by user
export const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, productId } = req.body;

    // Validate input
    if (!rating || !comment || !productId) {
      return next(
        new HandleError("Please provide rating, comment and productId", 400),
      );
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      avatar: req.user.avatar.url,
      rating: Number(rating),
      comment: comment,
    };

    const product = await Products.findById(productId);

    if (!product) {
      return next(new HandleError("Product not found", 400));
    }

    // Check if review already exists
    const reviewExists = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString(),
    );

    // Update or add review
    if (reviewExists) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.user._id.toString()) {
          review.rating = Number(rating);
          review.comment = comment;
          review.avatar = req.user.avatar.url; // Update avatar too
        }
      });
    } else {
      product.reviews.push(review);
    }

    // Update Review Count
    product.numOfReviews = product.reviews.length;

    // Update Rating - Calculate average
    let sum = 0;
    product.reviews.forEach((review) => {
      sum = sum + review.rating;
    });
    product.ratings =
      product.reviews.length > 0 ? sum / product.reviews.length : 0;

    // Save product
    await product.save({ validateBeforeSave: false });

    // Populate the reviews before sending response
    await product.populate({
      path: "reviews.user",
      select: "avatar",
    });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    return next(new HandleError(error.message, 500));
  }
};
// Review can seen by Admin
export const viewProductReview = async (req, res, next) => {
  const product = await Products.findById(req.query.id);
  if (!product) {
    return next(new HandleError("product not found", 400));
  }
  res.status(200).json({
    sucess: true,
    reviews: product.reviews,
  });
};

//Admin view All products
export const getAllProductsByAdmin = async (req, res, next) => {
  const products = await Products.find();

  res.status(200).json({ success: true, products });
};

// Admin only Delete the review

// export const adminDeleteReview = async (req,res,next)=>{

//   const{productId , reviewId}=req.query;

//   const product = await Products.findById(productId)

//   if(!product){
//     return next(new HandleError("Product not found" , 400 ))
//   }
//    // Filter out the review to delete
//   const reviews = product.reviews.filter((review)=>review._id.toString() !== reviewId.toString());
//   // adding rating count given by each user
//   let sum = 0
//   reviews.forEach((review)=>{
//     sum+=review.rating
//   })
//   // find average rating                //eg: 10/2 = 5
//   const ratings = reviews.length > 0 ? sum/reviews.length : 0
//   const numOfReviews = reviews.length

//   await Products.findByIdAndUpdate(productId,{reviews,ratings,numOfReviews}, {new:true,runValidators:true})

//   res.status(200).json({
//     success:true,
//     message:"Review Deleted successfully"
//   })
// }

export const adminDeleteReview = async (req, res, next) => {
  try {
    // Get IDs from query parameters
    const { productId, reviewId } = req.query; // Changed from _id to reviewId for clarity

    // Check if both IDs are provided
    if (!productId || !reviewId) {
      return next(
        new HandleError("Product ID and Review ID are required", 400),
      );
    }

    const product = await Products.findById(productId);

    if (!product) {
      return next(new HandleError("Product not found", 400));
    }

    // Filter out the review to delete
    const reviews = product.reviews.filter(
      (review) => review._id.toString() !== reviewId.toString(), // Use reviewId instead of _id
    );

    // Check if review was actually deleted
    if (reviews.length === product.reviews.length) {
      return next(new HandleError("Review not found", 404));
    }

    // Calculate new average rating
    let sum = 0;
    reviews.forEach((review) => {
      sum += review.rating;
    });

    const ratings = reviews.length > 0 ? sum / reviews.length : 0;
    const numOfReviews = reviews.length;

    // Update product with new reviews array
    await Products.findByIdAndUpdate(
      productId,
      { reviews, ratings, numOfReviews },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return next(new HandleError(error.message, 500));
  }
};
