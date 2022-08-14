const mongoose = require("mongoose");

const connectDB = async () => {
  const response = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${response.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;
