import { Request, Response, NextFunction } from "express";
const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (
  err: {
    message: any;
    name: string;
    code: number;
    errors: { [s: string]: unknown } | ArrayLike<unknown>;
    statusCode: number;
  },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // copying the error message to a new object
  let error = { ...err };
  // copying the message
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found `;
    error = new ErrorResponse(message, 404);
  }

  //Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    //mapping over all the values
    const message = Object.values(err.errors).map((val: any) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

export default errorHandler;
