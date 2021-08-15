import constants from "../config/dev";
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(constants.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
let db = mongoose.connection;
db.on("error", (e: ErrorConstructor) => {
  throw new Error("> UNABLE TO CONNECT TO THE DATABASE! CHECK CONNECTION");
});
