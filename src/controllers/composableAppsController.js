import { CompsableApp } from "../models/composableAppsModel.js";
import { Notification } from "../models/notificationModel.js";

const publishComposableApp = async (req, res) => {
    try {
        const { title, description, designPattern, commonServices, languagesUsed, demoVideoLink, demoLink, userId, appOwner } = req.body;
        const newComposableApp = new CompsableApp({
            title,
            description,
            designPattern,
            commonServices,
            languagesUsed,
            demoVideoLink,
            demoLink,
            userId,
            appOwner
        });
        const savedComposableApp = await newComposableApp.save();
        if (!savedComposableApp) {
            return res.status(400).json({ message: 'Failed to publish composable app' });
        } else {
            //create notification
            const notificationMessage = {
                id: savedComposableApp._id.toString(),
                title: savedComposableApp.title,
                status: savedComposableApp.status,
                fullname: savedComposableApp.appOwner,
            }
            const newNotification = new Notification({
                senderId: userId,
                receiverId: 0,
                type: 'apps',
                message: notificationMessage
            });
            await newNotification.save();
        }

        res.status(200).json({ message: 'Composable app published successfully', composableApp: savedComposableApp });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// edit composable app
const updateComposableApp = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, designPattern, commonServices, languagesUsed, demoVideoLink, demoLink, status } = req.body;
        const updatedComposableApp = await CompsableApp.findByIdAndUpdate(id, {
            title,
            description,
            designPattern,
            commonServices,
            languagesUsed,
            demoVideoLink,
            demoLink,
            status
        }, { new: true });
        if (!updatedComposableApp) {
            return res.status(400).json({ message: 'Failed to update composable app' });
        }
        res.status(200).json({ message: 'Composable app updated successfully', composableApp: updatedComposableApp });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// get composable app by id
const getComposableAppById = async (req, res) => {
    try {
        const { id } = req.params;
        const composableApp = await CompsableApp.findById(id).populate('commonServices', ["_id", "title"]);
        if (!composableApp) {
            return res.status(400).json({ message: 'Failed to get composable app' });
        }
        res.status(200).json({ message: 'Composable app fetched successfully', composableApp });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// delete composable app
const deleteComposableApp = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedComposableApp = await CompsableApp.findByIdAndDelete(id);
        if (!deletedComposableApp) {
            return res.status(400).json({ message: 'Failed to delete composable app' });
        }
        res.status(200).json({ message: 'Composable app deleted successfully', composableApp: deletedComposableApp });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// get inactive apps and add filer by user_id
const getInactiveApps = async (req, res) => {
    try {
        const { userId } = req.query;
        const query = { status: 'inactive' };
        if (userId) query.userId = userId;
        const inactiveApps = await CompsableApp.find(query).populate('commonServices', ["_id", "title"]);
        const totalCount = await CompsableApp.countDocuments(query);
        res.status(200).json({ message: 'Inactive apps fetched successfully', totalCount, composableApp: inactiveApps });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getActiveApps = async (req, res) => {
    try {
        const { userId } = req.query;
        const query = { status: 'active' };
        if (userId) query.userId = userId;
        const activeApps = await CompsableApp.find(query).populate('commonServices', ["_id", "title"]);
        const totalCount = await CompsableApp.countDocuments(query);
        res.status(200).json({ message: 'Active apps fetched successfully', totalCount, composableApp: activeApps });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// publish inactive app by admin
const publishInactiveApp = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedComposableApp = await CompsableApp.findByIdAndUpdate(id, { status: 'active' }, { new: true });
        if (!updatedComposableApp) {
            return res.status(400).json({ message: 'Failed to publish composable app' });
        } else {
            // notify to user
            const notificationMessage = {
                id: updatedComposableApp._id.toString(),
                title: updatedComposableApp.title,
                status: updatedComposableApp.status,
                fullname: updatedComposableApp.appOwner,
            }
            const newNotification = new Notification({
                senderId: 0,
                receiverId: updatedComposableApp.userId,
                type: 'apps',
                message: notificationMessage
            });
            await newNotification.save();
        }

        res.status(200).json({ message: 'Composable app published successfully', composableApp: updatedComposableApp });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


export {
    publishComposableApp,
    getInactiveApps,
    getActiveApps,
    publishInactiveApp,
    updateComposableApp,
    deleteComposableApp,
    getComposableAppById
}