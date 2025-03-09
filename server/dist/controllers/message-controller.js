"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = require("../model/message");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
require('dotenv').config();
const s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_BUCKET_REGION,
});
const upload = (name, bucketName, userId) => multer({
    storage: multerS3({
        s3: s3,
        bucket: bucketName,
        metadata: function (_req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, `${name}Image-${userId}.jpeg`);
        },
    }),
});
function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unknown error occurred.';
}
exports.addMessageImage = async (req, res) => {
    console.log("came for the add message image controller");
    const userId = req.userId;
    const uploadSingle = upload("post", "message-images-entinno", Date.now()).single("CroppedImage");
    uploadSingle(req, res, async (err) => {
        if (err) {
            console.log("error in uploading single", err);
            return res.status(400).json({ success: false, message: err.message });
        }
        console.log("completed upload single fumcion");
        console.log(req.file);
        try {
            const newMessage = new message_1.Message({
                imageUrl: req.file.location,
            });
            console.log('newmessage', newMessage);
            await newMessage.save();
            return res.status(200).json({ data: req.file.location, id: newMessage.id, message: 'message created successfully!' });
        }
        catch (err) {
            console.error('Error updating message image url:', getErrorMessage(err));
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
};
exports.addMessage = async (req, res) => {
    console.log("came to addMessage controller");
    const { chatId, senderId, text, messageId } = req.body;
    try {
        const updatedMessage = await message_1.Message.findOneAndUpdate({ _id: messageId }, { $set: { chatId, senderId, text } }, { new: true });
        const result = await updatedMessage.save();
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json(error);
    }
};
exports.addMessageWithoutImage = async (req, res) => {
    console.log("came to addMessagewithourImage controller");
    const { chatId, senderId, text } = req.body;
    const message = new message_1.Message({
        chatId,
        senderId,
        text,
    });
    try {
        const result = await message.save();
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json(error);
    }
};
exports.getMessages = async (req, res) => {
    const { chatId } = req.params;
    try {
        const result = await message_1.Message.find({ chatId });
        console.log(result);
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json(error);
    }
};
//# sourceMappingURL=message-controller.js.map