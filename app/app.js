var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
var morgan = require("morgan");
var fs = require("fs");
const rfs = require("rotating-file-stream");
const basicAuth = require("express-basic-auth");

var indexRouter = require("./routes/index");

//
var dashboardRouter = require("./routes/dashboard");

var projectRouter = require("./routes/project");

const _config = require("./appSetting.js");

var app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
swaggerDocument.host = _config.host + ":" + _config.port;
app.use(
  "/api-docs",
  basicAuth({
    users: { TTT: _config.passwordSwagger },
    challenge: true,
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// enable files upload
var fileUpload = require("express-fileupload");
app.use(
  fileUpload({
    createParentPath: true,
  })
);

//setup log file
const pad = (num) => (num > 9 ? "" : "0") + num;
const formatDate = (time) => {
  var year = time.getFullYear();
  var month = pad(time.getMonth() + 1);
  var day = pad(time.getDate());
  var hour = pad(time.getHours());
  var minute = pad(time.getMinutes());

  return [year, month, day].join("-");
};

function log_file_name(time, index) {
  if (!time) return "access.log";

  return [formatDate(time), index, "access.log"].join("-");
}
if (app.get("env") == "production") {
  let accessLogStream = rfs.createStream(log_file_name, {
    size: "2M",
    interval: "1d",
    path: _config.logAccessPath,
  });
  app.use(morgan({ stream: accessLogStream }));
} else {
  app.use(morgan("dev")); //log to console on development
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
// app.use(express.limit('20M'));
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static('/uploads'));
app.use("/", indexRouter);

app.use("/dashboard", dashboardRouter);

app.use("/project", projectRouter);



// app.use('/static',  express.static('uploads'))
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.disable("x-powered-by");

module.exports = app;
