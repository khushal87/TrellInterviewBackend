import Timing, { TimingSchemaType } from "../models/Timing";
import Movie, { MovieSchemaType } from "../models/Movie";

import { validationResult, ValidationError } from "express-validator";
import { NextFunction, Request, Response } from "express";

interface ResponseError extends Error {
  statusCode?: number;
  data?: ValidationError[];
}

const getMovieTimings = (req: Request, res: Response, next: NextFunction) => {
  const { movieId } = req.params;
  const errors = validationResult(req);
  Movie.findById(movieId)
    .then((result: MovieSchemaType) => {
      if (!result) {
        const error = new Error(
          "Movie with this id, doesn't exist"
        ) as ResponseError;
        error.statusCode = 401;
        error.data = errors.array();
        throw error;
      } else {
        Timing.find({
          $and: [{ movie: movieId, totalTickets: { $gt: 0 } }],
        }).then((result: TimingSchemaType[]) => {
          res.status(200).json({
            message: "Movie timings fetched successfully",
            result: result,
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

const createMovieTimings = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { timing, price, totalTickets, movie } = req.body;
  const errors = validationResult(req);
  Movie.findById(movie)
    .then((result: MovieSchemaType) => {
      if (!result) {
        const error = new Error(
          "Movie with this id, doesn't exist"
        ) as ResponseError;
        error.statusCode = 401;
        error.data = errors.array();
        throw error;
      } else {
        const timingInstance = new Timing({
          timing,
          price,
          totalTickets,
          movie,
        });
        timingInstance.save().then((result) => {
          res.status(200).json({
            message: "New movie timing created successfully",
            result: result,
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

const TimingController = {
  getMovieTimings,
  createMovieTimings,
};

export default TimingController;
