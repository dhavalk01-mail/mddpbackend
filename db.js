import mongoose from "mongoose";

const connectDB = async () => {

    try {
        await mongoose.connect("mongodb+srv://dhavalkoradiya:1zsuaG058yFKCxJ6@cluster0.ambhqqq.mongodb.net/?retryWrites=true&w=majority?directConnection:true")
        console.log("connected to database")
    } catch (error) {
        console.log(`error while connecting ${error.message}`)
        process.exit(1)        
    }
}


export default connectDB