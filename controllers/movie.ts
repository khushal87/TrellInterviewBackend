import Movie, { MovieSchemaType } from "../models/Movie";
import { validationResult, ValidationError } from "express-validator";
import { NextFunction, Request, Response } from "express";

interface ResponseError extends Error {
  statusCode?: number;
  data?: ValidationError[];
}

const getAllMovies = (req: Request, res: Response, next: NextFunction) => {
  Movie.find()
    .then((result: MovieSchemaType[]) => {
      if (result) {
        res.status(200).json({ message: "Movies fetched", result: result });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const createMovie = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation error") as ResponseError;
    error.statusCode = 401;
    error.data = errors.array();
    throw error;
  }
  const { name, description, director, duration } = req.body;
  const movie = new Movie({ name, description, director, duration });
  movie
    .save()
    .then((result: MovieSchemaType) => {
      res
        .status(200)
        .json({ message: "Movie created successfully", result: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const MovieController = {
  getAllMovies,
  createMovie,
};

export default MovieController;
