"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const messageRouter = express.Router();
const jwt = require('jsonwebtoken');
const verify_jwt_1 = __importDefault(require("../middlewares/verify-jwt"));
const { addMessage, getMessages, addMessageImage, addMessageWithoutImage } = require('../controllers/message-controller');
messageRouter.post('/message/', verify_jwt_1.default, addMessage);
messageRouter.get('/message/:chatId', verify_jwt_1.default, getMessages);
messageRouter.post('/messageimagepost', verify_jwt_1.default, addMessageImage);
messageRouter.post('/messagewithoutimage', verify_jwt_1.default, addMessageWithoutImage);
module.exports = messageRouter;
//# sourceMappingURL=message-routes.js.map