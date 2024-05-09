//On the dbConnect we need to use the mongoose library to connect to the database
import mongoose from "mongoose";

const connectDB = async () => 
{
    try
    {
      await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
      })
    } catch(err) {
        console.error(err)
    }
}

export default connectDB;