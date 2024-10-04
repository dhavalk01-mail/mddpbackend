import 'dotenv/config'
import mongoose from "mongoose";

const {
    ENVIRONMENT,
    MONGODB_PROD_URL,
    MONGODB_DEV_URL,
    MONGO_URL,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
} = process.env;

const connectDB = async () => {
    try {
        if (ENVIRONMENT === 'PROD') {
            // var mongourl = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`
            var mongourl = MONGO_URL || MONGODB_PROD_URL;
        } else {
            // var mongourl = "mongodb+srv://dhavalkoradiya:1zsuaG058yFKCxJ6@cluster0.ambhqqq.mongodb.net/services";
            var mongourl = MONGODB_DEV_URL;
        }
        
        // Database mongoose.connection
        await mongoose.connect(mongourl)
            .then(() => {
                console.log('Connection successful!');
            }).catch((e) => {
                console.log('Connection failed!', e.message);
            });

    } catch (error) {
        console.log(`error while connecting ${error.message}`)
        process.exit(1)
    }
}

export default connectDB