import Movie, { MovieSchemaType } from "../models/Movie";
import Booking, { BookingSchemaType } from "../models/Booking";
import Timing, { TimingSchemaType } from "../models/Timing";
import User, { UserSchemaType } from "../models/User";

import { validationResult, ValidationError } from "express-validator";
import { NextFunction, Request, Response } from "express";

interface ResponseError extends Error {
  statusCode?: number;
  data?: ValidationError[];
}

const getMovieBookings = (req: Request, res: Response, next: NextFunction) => {
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
        Booking.find({ movie: movieId }).then((result: BookingSchemaType[]) => {
          res.status(200).json({
            message: "Movie bookings fetched successfully",
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

const getBookingsAtSpecificTiming = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { timingId } = req.params;
  const errors = validationResult(req);
  Timing.findById(timingId)
    .then((result: TimingSchemaType) => {
      if (!result) {
        const error = new Error(
          "No movie timing with this id, exists"
        ) as ResponseError;
        error.statusCode = 401;
        error.data = errors.array();
        throw error;
      } else {
        Booking.find({ timing: timingId }).then(
          (result: BookingSchemaType[]) => {
            res.status(200).json({
              message:
                "Movie booking at the specified time fetched successfully",
              result: result,
            });
          }
        );
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const createBooking = (req: Request, res: Response, next: NextFunction) => {
  const { timing, user, movie } = req.body;
  const errors = validationResult(req);

  User.findById(user)
    .then((result: UserSchemaType) => {
      if (!result) {
        const error = new Error(
          "User with this id, doesn't exist"
        ) as ResponseError;
        error.statusCode = 401;
        error.data = errors.array();
        throw error;
      } else {
        Movie.findById(movie).then((result: MovieSchemaType) => {
          if (result) {
            const error = new Error(
              "User with this id, doesn't exist"
            ) as ResponseError;
            error.statusCode = 401;
            error.data = errors.array();
            throw error;
          } else {
            Timing.findById(timing).then((result: TimingSchemaType) => {
              if (!result) {
                const error = new Error(
                  "No movie timing with this id, exists"
                ) as ResponseError;
                error.statusCode = 401;
                error.data = errors.array();
                throw error;
              } else {
                const booking = new Booking({ user, movie, timing });
                if (result.totalTickets > 0) result.totalTickets -= 1;
                result.save();
                booking.save().then((result) => {
                  res.status(200).json({
                    message: "New booking successful",
                    result: booking,
                  });
                });
              }
            });
          }
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

const BookingController = {
  getMovieBookings,
  getBookingsAtSpecificTiming,
  createBooking,
};

export default BookingController;
