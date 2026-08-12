// this is a middleware use to handle error , its located inbetween the req,res
import HandleError from "../helper/handleError.js";

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Product not Found";

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
