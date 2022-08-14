// LOAD ENV VARS...
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

// EXPRESS...
const express = require("express");
const app = express();
app.use(express.json());

// DATABASE...
const connectDB = require("./config/connect-db");
connectDB();

// SUPPORT LIBRARY / MODULE...
// ... Colors the console
const colors = require("colors");
// ... Set static folder
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
// ... Cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());
// ... Logs in console
const morgan = require("morgan");
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
// ... Handle image upload
const fileupload = require("express-fileupload");
app.use(fileupload());
// ... Sanitize data
const mongoSanitize = require("express-mongo-sanitize");
app.use(mongoSanitize());
// ... Set security headers
const helmet = require("helmet");
app.use(helmet());
// ... Prevent XSS attacks
const xss = require("xss-clean");
app.use(xss());
// ... Enable CORS
const cors = require("cors");
app.use(cors());
// ... Prevent http param pollution
const hpp = require("hpp");
app.use(hpp());
// ... Rate limiting
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10mins
  max: 100, // 100 request for 10 mins
});
app.use(limiter);

// ROUTE FILES...
const BootcampsRoutes = require("./routes/bootcamps-routes");
const CoursesRoutes = require("./routes/courses-routes");
const AuthRoutes = require("./routes/auth-routes");
const UserRoutes = require("./routes/users-routes");
const ReviewRoutes = require("./routes/reviews-routes");
// MOUNT ROUTERS...
app.use("/api/v1/bootcamps", BootcampsRoutes);
app.use("/api/v1/courses", CoursesRoutes);
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/reviews", ReviewRoutes);

// MIDDLEWARE...
const errorHandler = require("./middleware/error-handler");
app.use(errorHandler);

// CONNECTION...
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server listening in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
// handle unhandled promise rejections
process.on("unhandledRejection", (error, promise) => {
  console.log(`Error: ${error.message}`.red);
  // close server & exit process
  server.close(() => process.exit(1));
});
