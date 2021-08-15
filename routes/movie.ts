import express from "express";
import MovieController from "../controllers/movie";

const Router = express.Router();

Router.get("/get-all-movies", MovieController.getAllMovies);
Router.post("/create-movie", MovieController.createMovie);

export default Router;
