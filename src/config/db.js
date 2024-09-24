import 'dotenv/config'
import mongoose from "mongoose";

const {
    PRODUCTION,
    MONGODB_PROD_URL,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
} = process.env;

const connectDB = async () => {    
    try {
        if (PRODUCTION == true) {
            // var mongourl = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`
            var mongourl = MONGODB_PROD_URL;
        } else {
            // var mongourl = "mongodb+srv://dhavalkoradiya:1zsuaG058yFKCxJ6@cluster0.ambhqqq.mongodb.net/services";
            var mongourl = MONGODB_DEV_URL;
        }
        // console.log(mongourl);
        await mongoose.connect(mongourl)
        console.log("connected to database")
    } catch (error) {
        console.log(`error while connecting ${error.message}`)
        process.exit(1)
    }
}

export default connectDB