"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chat_1 = require("../model/chat");
exports.createChat = async (req, res) => {
    console.log("came to create Chat controller");
    console.log(req.body);
    const newChat = new chat_1.Chat({
        members: [req.body.senderId, req.body.receiverId],
    });
    try {
        const result = await newChat.save();
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json(error);
    }
};
exports.userChats = async (req, res) => {
    console.log("came to userChats controller");
    try {
        const chat = await chat_1.Chat.find({
            members: { $in: [req.params.userId] },
        });
        console.log(chat);
        return res.status(200).json(chat);
    }
    catch (error) {
        return res.status(500).json(error);
    }
};
exports.findChat = async (req, res) => {
    console.log("came to findChat controller");
    try {
        const chat = await chat_1.Chat.findOne({
            members: { $all: [req.params.firstId, req.params.secondId] },
        });
        return res.status(200).json(chat);
    }
    catch (error) {
        return res.status(500).json(error);
    }
};
//# sourceMappingURL=chats-controller.js.map