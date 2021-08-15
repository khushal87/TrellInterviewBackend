import User, { UserSchemaType } from "../models/User";
import { validationResult, ValidationError } from "express-validator";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface ResponseError extends Error {
  statusCode?: number;
  data?: ValidationError[];
}

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find()
    .then((result: UserSchemaType[]) => {
      if (result) {
        res.status(200).json({ message: "Users fetched", result: result });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const getSpecificUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const errors = validationResult(req);
  User.findById(userId)
    .then((result: UserSchemaType) => {
      if (!result) {
        const error = new Error(
          "Validation failed, user with this id do not exist"
        ) as ResponseError;
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      } else {
        res
          .status(200)
          .json({ message: "User successfully fetched", result: result });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const userSignUp = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(
      "Validation failed, entered data is incorrect."
    ) as ResponseError;
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { email, password, name } = req.body;
  User.find({ email: email })
    .then((result) => {
      if (result.length > 0) {
        const error = new Error(
          "User already exists with the same email id."
        ) as ResponseError;
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      } else {
        // To hash the password we use bcrypt
        bcrypt.genSalt(15, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            const user = new User({ name, email, password: hash });
            user.save().then((result) => {
              res.status(200).json({
                message: "New user created successfully",
                result: result,
              });
            });
          });
        });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const userLogin = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  const { email, password } = req.body;
  User.find({ email: email })
    .then((result: UserSchemaType[]) => {
      if (result.length > 0) {
        const error = new Error(
          "User with the credentials do not exist."
        ) as ResponseError;
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      } else {
        const passwordMatch = bcrypt.compare(password, result[0].password);
        if (!passwordMatch) {
          const error = new Error(
            "User password do not match."
          ) as ResponseError;
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
        }
        const token = jwt.sign(
          {
            email: result[0].email,
            passwordMatch: result[0].password,
          },
          "trellproject",
          { expiresIn: "1h" }
        );
        res.status(200).json({
          message: "User Logged in successfuly",
          result: result[0],
          token: token,
        });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const UserController = {
  getAllUsers,
  getSpecificUser,
  userSignUp,
  userLogin,
};

export default UserController;
