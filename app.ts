require("./db/conn");

import express, { Application, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./middleware/error";

// App routes
import UserRoutes from "./routes/user";
import MovieRoutes from "./routes/movie";
import BookingRoutes from "./routes/booking";
import TimingRoutes from "./routes/timing";

const app: Application = express();

app.use(
  cors({
    origin: "*",
    preflightContinue: true,
    methods: "GET, HEAD, PUT, POST, DELETE",
  })
);

app.use(cors());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false })); //x-www-form-urlencoded
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(cookieParser());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS,GET,POST,PUT,PATCH,DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.use("/user", UserRoutes);
app.use("/movie", MovieRoutes);
app.use("/timing", TimingRoutes);
app.use("/booking", BookingRoutes);

app.use(errorHandler);

let port: string | number = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

export default app;
