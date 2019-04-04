const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const cookie = require("cookie-parser");
const createError = require("http-errors");
const config = require("./config/database");
var MongoStore = require('connect-mongo')(session);
app.use(cors());

const api = require("./routes/api");


mongoose.Promise = global.Promise;

mongoose.connect(
  config.database,
  {
    useNewUrlParser: true,
    useFindAndModify: false
  }
);

const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to DB on port...??");
});

// // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
//express validator
app.use(cookie());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "microsoft",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  })
);

app.use("/api", api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("errors");
});

module.exports = app;
