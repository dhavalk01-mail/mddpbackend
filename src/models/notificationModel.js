import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        senderId: {
            required: true
        },
        receiverId: {
            required: true
        },
        type: {
            type: String,
            enum: ['service'],
            required: true,
            default: 'service'
        },
        message: {
            type: String,
            required: true
        },
        read: {
            type: Boolean,
            default: false  //true = read
        }
    },
    { timestamps: true },
    { versionKey: false }
);

const Notification = mongoose.model('Notification', notificationSchema);

export {
    Notification
}