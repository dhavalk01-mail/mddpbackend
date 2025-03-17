import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        senderId: {
            type: String,
            required: true //userId
        },
        receiverId: {
            type: String,
            required: true //admin 0
        },
        type: {
            type: String,
            enum: ['service', 'apps'],
            required: true,
            default: 'service'
        },
        message: {     // service title + status
            type: Object,
            required: true
        },
        read: {
            type: Boolean,
            default: false  //true = read  read on open notification
        }
    },
    { timestamps: true },
    { versionKey: false }
);

const Notification = mongoose.model('Notification', notificationSchema);

export {
    Notification
}