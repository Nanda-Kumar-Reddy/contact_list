"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Notification = require("../model/notifications");
exports.createNotification = async (req, res) => {
    console.log("came to createNotificaitions controller");
    const { userId, fromUserId, message, notificationType, image, name } = req.body;
    console.log({ userId, fromUserId, message, notificationType, image, name });
    try {
        const newNotification = new Notification({
            user: userId,
            fromUser: fromUserId,
            type: notificationType,
            profileImage: image,
            name,
            message
        });
        await newNotification.save();
        return res.json({ message: 'Notification created successfully' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error creating notification' });
    }
};
exports.getNotificationsForUser = async (req, res) => {
    console.log("came to getNotifaciotnForUser controller");
    const userId = req.params.userId;
    try {
        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
        return res.status(200).json(notifications);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error retrieving notifications' });
    }
};
exports.markAsRead = async (req, res) => {
    console.log("Came to markAsRead controller");
    const notificationId = req.params.notificationId;
    try {
        const updatedNotification = await Notification.findByIdAndUpdate(notificationId, { seen: true }, { new: true });
        if (!updatedNotification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }
        return res.status(200).json(updatedNotification);
    }
    catch (err) {
        console.error("Error marking notification as seen:", err);
        return res.status(500).json({
            success: false,
            message: "Error marking notification as seen",
        });
    }
};
//# sourceMappingURL=notifications-controller.js.map