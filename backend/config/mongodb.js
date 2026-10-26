import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on('connected', () => console.log("Database Connected"));

  let uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  if (!uri.includes('/prescripto')) {
    if (uri.includes('?')) {
      uri = uri.replace('?', '/prescripto?');
    } else {
      uri = `${uri}/prescripto`;
    }
  }

  await mongoose.connect(uri);
};

export default connectDB;
