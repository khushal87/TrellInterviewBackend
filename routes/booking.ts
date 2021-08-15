import express from "express";
import BookingController from "../controllers/booking";

const Router = express.Router();

Router.get("/get-movie-bookings/:movieId", BookingController.getMovieBookings);
Router.get(
  "/get-bookings-at-specific-timing/:timingId",
  BookingController.getBookingsAtSpecificTiming
);

Router.post("/create-movie-timing", BookingController.createBooking);

export default Router;
