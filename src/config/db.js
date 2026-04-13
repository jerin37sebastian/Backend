const mongoose = require("mongoose");

const connectDB = async () => {
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      attempt++;
      console.error(`❌ MongoDB Error (attempt ${attempt}/${maxRetries}): ${error.message}`);
      if (attempt < maxRetries) {
        console.log(`⏳ Retrying in 5 seconds...`);
        await new Promise((res) => setTimeout(res, 5000));
      } else {
        console.error("❌ All connection attempts failed. Check MongoDB Atlas IP whitelist.");
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
