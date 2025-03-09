"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJWT = (req, res, next) => {
    console.log("came for user authorization in userInfo........");
    const authHeader = req.headers.authorization;
    console.log("authHeader", authHeader);
    if (!authHeader || authHeader === 'Bearer undefined') {
        console.log("Invalid or missing authorization header");
        return res.status(403).json({ message: 'Invalid JWT token' });
    }
    if (!authHeader.startsWith('Bearer ')) {
        console.log("Unauthorized access - Invalid token format");
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1] || '';
    console.log("jwt", token);
    try {
        console.log("decoding the jwt");
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("user id in auth", decoded.userId);
        req.userId = decoded.userId;
        console.log("completed the jwt decoding");
        return next();
    }
    catch (err) {
        console.log("error in authorization");
        console.error(err);
        return res.status(403).json({ message: 'Invalid JWT token' });
    }
};
exports.default = verifyJWT;
//# sourceMappingURL=verify-jwt.js.map