import express from "express";
import UserController from "../controllers/user";

const Router = express.Router();

Router.get("/get-all-users", UserController.getAllUsers);
Router.get("/get-specific-user/:userId", UserController.getSpecificUser);
Router.post("/user-sign-up", UserController.userSignUp);
Router.post("/user-login", UserController.userLogin);

export default Router;
