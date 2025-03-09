"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userInfoSchema = new mongoose_1.Schema({
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        },
        minlength: 6,
        trim: true,
    },
    googleId: { type: String },
    username: { type: String, unique: true, required: true },
    profileImageUrl: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg",
    },
    coverImageUrl: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg",
    },
    title: { type: String, trim: true },
    headline: { type: String, trim: true },
    profession: { type: String, trim: true },
    about: { type: String, trim: true },
    summary: { type: String, trim: true },
    location: { type: String, trim: true },
    website: { type: String, trim: true },
    industry: { type: String, trim: true },
    company: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    experience: [
        {
            title: { type: String, required: true, trim: true },
            company: { type: String, trim: true },
            location: { type: String, trim: true },
            startDate: { type: Date },
            endDate: { type: Date },
            description: { type: String, trim: true },
        },
    ],
    connections: [
        {
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "UserInfo" },
            status: { type: String, default: "No Connection" },
        },
    ],
    following: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "UserInfo" }],
    skills: [{ name: { type: String, required: true, trim: true } }],
    education: [{ name: { type: String, required: true, trim: true } }],
    bookmarks: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Posts" }],
    hiddenPosts: { type: [mongoose_1.Schema.Types.ObjectId], ref: "Posts", default: [] },
}, { timestamps: true });
const UserInfo = mongoose_1.default.model('UserInfo', userInfoSchema);
exports.default = UserInfo;
//# sourceMappingURL=userInfo.js.map