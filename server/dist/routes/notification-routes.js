"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const notificationRouter = express.Router();
const jwt = require('jsonwebtoken');
const verify_jwt_1 = __importDefault(require("../middlewares/verify-jwt"));
const { createNotification, getNotificationsForUser, markAsRead } = require('../controllers/notifications-controller');
notificationRouter.post('/addnotification/', verify_jwt_1.default, createNotification);
notificationRouter.get('/notifications/:userId', verify_jwt_1.default, getNotificationsForUser);
notificationRouter.put('/notifications/:notificationId/seen', verify_jwt_1.default, markAsRead);
module.exports = notificationRouter;
//# sourceMappingURL=notification-routes.js.map