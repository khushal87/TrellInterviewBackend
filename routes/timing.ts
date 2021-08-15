import express from "express";
import TimingController from "../controllers/timing";

const Router = express.Router();

Router.get("/get-movie-timings/:movieId", TimingController.getMovieTimings);
Router.post("/create-movie-timing", TimingController.createMovieTimings);

export default Router;
