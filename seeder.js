const colors = require("colors");
const dotenv = require("dotenv");
const fs = require("fs");
const mongoose = require("mongoose");

// LOAD ENV VARS
dotenv.config({ path: "./config/config.env" });

// LOAD MODELS
const Bootcamp = require("./models/bootcamp-model");
const Course = require("./models/course-model");
const User = require("./models/user-model");
const Review = require("./models/review-model");

// CONNECT TO DATABASE
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// READ JSON FILE
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8"));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8"));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8"));

// IMPORT INTO DATABASE
const importData = async () => {
  // https://www.itsolutionstuff.com/post/node-js-how-to-delete-all-files-in-directoryexample.html
  fs.readdir(process.env.FILE_UPLOAD_PATH, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      console.log(`${file}: File deleted...`.red);
      fs.unlinkSync(`${process.env.FILE_UPLOAD_PATH}/${file}`);
    }
  });

  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);
    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// DESTROY DATA FROM DATABASE
const destroyData = async () => {
  fs.readdir(process.env.FILE_UPLOAD_PATH, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      console.log(`${file}: File deleted...`.red);
      fs.unlinkSync(`${process.env.FILE_UPLOAD_PATH}/${file}`);
    }
  });

  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  destroyData();
}
