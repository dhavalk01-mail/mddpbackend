import 'dotenv/config'
import mongoose from "mongoose";

const {
    ENVIRONMENT,
    MONGODB_PROD_URL,
    MONGODB_DEV_URL,
    MONGODB_TEST_URL,
    MONGO_URL
} = process.env;

const connectDB = async () => {
    try {
        if (ENVIRONMENT === 'PROD') {
            var mongourl = MONGO_URL || MONGODB_PROD_URL;
        } else if (ENVIRONMENT === 'TEST') {
            var mongourl = MONGO_URL || MONGODB_TEST_URL;
        } else {
            var mongourl = MONGODB_DEV_URL;
        }
        
        // Database mongoose.connection
        await mongoose.connect(mongourl)
            .then(() => {
                console.log('Database connection successful!');
                console.log('ENVIRONMENT: ' + ENVIRONMENT);
                console.log('CONNECTION URL: ' + mongourl);
            }).catch((e) => {
                console.log('Database connection failed!');
                console.log('ERROR: ' + e.message);
                console.log('ENVIRONMENT: ' + ENVIRONMENT);
                console.log('CONNECTION URL: ' + mongourl);
            });
    } catch (error) {
        console.log(`error while connecting ${error.message}`)
        process.exit(1)
    }
}

export default connectDB