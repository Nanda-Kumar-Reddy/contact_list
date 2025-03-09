"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const userInfo_1 = require("../model/userInfo");
const posts_1 = require("../model/posts");
const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const Cookies = require('js-cookie');
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
require('dotenv').config();
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
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
exports.setProfileImage = async (req, res) => {
    console.log("came to setProfileImage controller");
    const userId = req.userId;
    const uploadSingle = upload("profile", "profile-images-entinno", userId).single("croppedImage");
    uploadSingle(req, res, async (err) => {
        if (err) {
            console.log("error in uploading single", err);
            return res.status(400).json({ success: false, message: err.message });
        }
        console.log("completed upload single fumcion");
        try {
            const userId = req.userId;
            const user = await userInfo_1.UserInfo.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            console.log(req.file);
            user.profileImageUrl = req.file.location;
            await user.save();
            return res.status(200).json({ data: req.file.location });
        }
        catch (error) {
            console.error('Error updating photo url:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
};
exports.signup = async (req, res) => {
    console.log("came for signup");
    try {
        const { email, password } = req.body;
        const existingUser = await userInfo_1.UserInfo.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'email already exists!' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const username = email.split('@')[0];
        const existingUsername = await userInfo_1.UserInfo.findOne({ username });
        if (existingUsername) {
            const username = v4();
        }
        console.log('username', username);
        const user = new userInfo_1.UserInfo({ email, password: hashedPassword, username });
        await user.save();
        console.log("user saved sucessfully");
        const jwtSecret = process.env.JWT_SECRET;
        const user_id = user._id;
        const jwt_token = jwt.sign({ userId: user._id }, jwtSecret);
        return res.status(201).json({ message: 'User created successfully!', jwt_token, user_id });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error!' });
    }
};
exports.resetPassword = async (req, res) => {
    console.log("came to resetPassweored conteroller");
    try {
        const { password, userId } = req.body;
        if (!password || !userId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const existingUser = await userInfo_1.UserInfo.findById(userId);
        if (!existingUser) {
            return res.status(400).json({ message: 'user Do not exists!' });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        existingUser.password = hashedPassword;
        await existingUser.save();
        console.log("user saved sucessfully");
        return res.status(201).json({ message: 'User Passwared updated successfully!' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error!' });
    }
};
exports.login = async (req, res) => {
    console.log("came for login");
    try {
        const { email, password } = req.body;
        const user = await userInfo_1.UserInfo.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password!' });
        }
        if (!user.password) {
            return res.status(401).json({
                message: 'This account is linked to Google OAuth. Please log in using Google.'
            });
        }
        const user_id = user._id;
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('came');
            return res.status(401).json({ message: 'Invalid email or password!' });
        }
        const jwt_token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        return res.status(200).json({
            message: 'Login successful!',
            jwt_token,
            user_id
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error!' });
    }
};
exports.getAllUsers = async (req, res) => {
    console.log("came to getAllUsers controller");
    try {
        const users = await userInfo_1.UserInfo.find();
        if (!users) {
            return res.status(404).json({ message: 'no users found' });
        }
        const usersinfo = users.map((user) => ({
            id: user._id,
            name: user.firstName + ' ' + user.lastName,
            profession: user.profession,
            location: user.location,
            title: user.title,
            skills: user.skills,
            education: user.education,
            about: user.about,
            coverImageUrl: user.coverImageUrl,
            profileImageUrl: user.profileImageUrl,
            headline: user.headline,
        }));
        return res.status(200).json(usersinfo);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error!' });
    }
};
exports.addUserInfo = async (req, res) => {
    {
        console.log("Came for adding userinfo controller");
    }
    try {
        const userId = req.userId;
        console.log("userid", userId);
        const { firstName, lastName, country, title, profession = "" } = req.body;
        const updatedUserInfo = await userInfo_1.UserInfo.findByIdAndUpdate(userId, {
            firstName,
            lastName,
            location: country,
            title,
            profession,
        }, { new: true });
        if (!updatedUserInfo) {
            return res.status(404).json({ message: 'User not found!' });
        }
        return res.status(200).json({
            message: 'User information updated successfully!',
            user: updatedUserInfo,
        });
    }
    catch (err) {
        console.error('Error updating user information:', err);
        return res.status(500).json({ message: 'Error updating user information!' });
    }
};
exports.addSkills = async (req, res) => {
    try {
        const userId = req.userId;
        const user_skills = req.body;
        console.log("user skills", user_skills);
        const user = await userInfo_1.UserInfo.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.skills = user.skills.concat(user_skills.map((skill) => ({ name: skill })));
        console.log(user.skills);
        await user.save();
        return res.status(200).json({ message: 'Skills saved successfully!', userSkills: user.skills });
    }
    catch (error) {
        console.error('Error saving skills:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateSkills = async (req, res) => {
    try {
        const userId = req.userId;
        const updated_Skills = req.body;
        const user = await userInfo_1.UserInfo.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.skills = updated_Skills;
        await user.save();
        return res.status(200).json({ message: 'Skills updated successfully!' });
    }
    catch (error) {
        console.error('Error updating skills:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.addUniversites = async (req, res) => {
    try {
        const userId = req.userId;
        const user_education = req.body;
        console.log("user education", user_education);
        const user = await userInfo_1.UserInfo.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.education = user.education.concat(user_education.map((education) => ({ name: education })));
        console.log(user.education);
        await user.save();
        return res.status(200).json({ message: 'Education saved successfully!', updatedUniversities: user.education });
    }
    catch (error) {
        console.error('Error saving skills:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateUniversities = async (req, res) => {
    try {
        const userId = req.userId;
        const updated_Education = req.body;
        const user = await userInfo_1.UserInfo.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.education = updated_Education;
        await user.save();
        return res.status(200).json({ message: 'Universities updated successfully!' });
    }
    catch (error) {
        console.error('Error updating education:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateAbout = async (req, res) => {
    console.log("came for updateAbout controller");
    try {
        const userId = req.userId;
        const updated_details = req.body;
        const updated_About = updated_details.updated_About;
        console.log(updated_details.updated_About);
        const user = await userInfo_1.UserInfo.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.about = updated_About;
        await user.save();
        return res.status(200).json({ message: 'About updated successfully!' });
    }
    catch (error) {
        console.error('Error updating about:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateUserInfo = async (req, res) => {
    console.log("came for updateUserInfo controller");
    try {
        const userId = req.userId;
        const { firstName, lastName, location, headline, profession = "" } = req.body;
        const updatedUserInfo = await userInfo_1.UserInfo.findByIdAndUpdate(userId, {
            firstName,
            lastName,
            location,
            profession,
            headline,
        }, { new: true });
        if (!updatedUserInfo) {
            return res.status(404).json({ message: 'User not found!' });
        }
        await posts_1.Posts.updateMany({ userId }, { $set: { userName: updatedUserInfo.firstName + updatedUserInfo.lastName, userImage: updatedUserInfo.profileImageUrl } });
        return res.status(200).json({
            message: 'User information updated successfully!',
            user: updatedUserInfo,
        });
    }
    catch (err) {
        console.error('Error updating user information:', err);
        return res.status(500).json({ message: 'Error updating user information!' });
    }
};
exports.getInteractions = async (req, res) => {
    console.log("came for getInteractions controller");
    try {
        const userId = req.userId;
        console.log(userId);
        const userInfos = await userInfo_1.UserInfo.find({
            _id: { $ne: userId },
        });
        const interactions = userInfos.map((user) => ({
            id: user._id,
            username: user.username,
            title: user.title,
            profileImageUrl: user.profileImageUrl,
            coverImageUrl: user.coverImageUrl,
            name: user.firstName + ' ' + user.lastName,
            headline: user.headline,
            connections: user.connections
        }));
        return res.status(200).json(interactions);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Error fetching user info');
    }
};
exports.getUsersBasedOnUserText = async (req, res) => {
    console.log("came to getUsersBasedOnUserText controller");
    const { text } = req.query;
    try {
        let users = await userInfo_1.UserInfo.find({
            $or: [
                { firstName: { $regex: `.*${text}.*`, $options: 'i' } },
                { lastName: { $regex: `.*${text}.*`, $options: 'i' } }
            ]
        })
            .limit(10)
            .exec();
        if (users.length === 0) {
            users = await userInfo_1.UserInfo.find({
                username: { $regex: `.*${text}.*`, $options: 'i' }
            })
                .limit(10)
                .exec();
        }
        const updatedUsers = users.map((user) => ({
            id: user._id,
            username: user.username,
            title: user.title,
            profileImageUrl: user.profileImageUrl,
            name: user.firstName || 'unkown' + user.lastName || '',
        }));
        return res.status(200).json(updatedUsers);
    }
    catch (err) {
        console.error('Error searching users:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateUserInfoConnections = async (req, res) => {
    console.log('came to updateUserInfoConnections controller');
    const { interactionUserId } = req.params;
    const userId = req.userId;
    try {
        const user1 = await userInfo_1.UserInfo.findById(interactionUserId);
        const user2 = await userInfo_1.UserInfo.findById(userId);
        if (!user1) {
            return res.status(404).json({ message: 'User or connection not found' });
        }
        const existingConnection = user2.connections.find((connection) => connection.userId.equals(interactionUserId) && (connection.status === 'Pending' || connection.status === 'Connected'));
        console.log('existingConncection', existingConnection);
        if (existingConnection) {
            console.log('connection already exists');
            return res.status(409).json({ message: 'connection already created' });
        }
        console.log("connection dosn't exists ");
        user2.connections.push({ userId: interactionUserId, status: 'Pending' });
        await user1.save();
        await user2.save();
        console.log('user1', user1);
        console.log('user2', user2);
        return res.status(200).json({ message: 'Connection updated successfully!', updatedUser: user2 });
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Error updating user connections');
    }
};
exports.updateUserInfoConnectionsLastlyAccepted = async (req, res) => {
    console.log('came to updateUserInfoConnectionslastlyAccepted controller');
    const { interactionUserId } = req.params;
    const userId = req.userId;
    try {
        const user1 = await userInfo_1.UserInfo.findById(interactionUserId);
        const user2 = await userInfo_1.UserInfo.findById(userId);
        if (!user1 || !user2) {
            return res.status(404).json({ message: 'User or connection not found' });
        }
        const existingConnection = user1.connections.find((connection) => connection.userId.equals(userId));
        console.log('existingConncection', existingConnection);
        if (existingConnection?.status === 'Connected') {
            console.log("connection1 aleardy present");
            return res.status(400).json({ message: 'Connection already exists' });
        }
        else if (existingConnection?.status === 'Pending') {
            console.log("connection1 is updated to connected");
            existingConnection.status = 'Connected';
            const existingConnection2 = user2.connections.find((connection) => connection.userId.equals(interactionUserId));
            console.log('existingConncection2', existingConnection2);
            if (existingConnection2) {
                if (existingConnection2?.status === 'Connected') {
                    console.log("connection2 aleardy present");
                    return res.status(400).json({ message: 'Connection already exists' });
                }
                else if (existingConnection2?.status === 'Pending') {
                    console.log("connection2 is updated to connected");
                    existingConnection2.status = 'Connected';
                }
                await user2.save();
            }
            else {
                console.log("there is no existing connectio so updated using push");
                user2.connections.push({ userId: interactionUserId, status: 'Connected' });
                await user2.save();
            }
            await user1.save();
            console.log(user1);
            console.log(user2);
            return res.json({ message: 'Connection updated successfully!' });
        }
        return res.status(200).json({ message: 'error Connection updated successfully!' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Error updating user connections');
    }
};
exports.updateUserInfoConnectionsLastlyRejected = async (req, res) => {
    console.log('came to updateUserInfoConnectionsLastlyRejected controller');
    const { interactionUserId } = req.params;
    const userId = req.userId;
    try {
        const user1 = await userInfo_1.UserInfo.findById(interactionUserId);
        const user2 = await userInfo_1.UserInfo.findById(userId);
        if (!user1) {
            return res.status(404).json({ message: 'User or connection not found' });
        }
        const existingConnection = user1.connections.find((connection) => connection.userId.equals(userId));
        console.log('existingConncection', existingConnection);
        if (!existingConnection) {
            console.log("connecion1 does exists");
            return res.json({ message: 'Connection does not exist' });
        }
        if (existingConnection.status === 'Connected') {
            console.log("connecion1 connect already");
            return res.status(400).json({ message: 'Connection already established' });
        }
        else if (existingConnection.status === 'Pending') {
            existingConnection.status = 'No Connection';
            console.log("updated connection1");
            const existingConnection2 = user2.connections.find((connection) => connection.userId.equals(interactionUserId));
            console.log('existingConncection2', existingConnection);
            if (existingConnection2?.status === 'Connected') {
                console.log("connecion2 connect already");
                return res.status(400).json({ message: 'Connection already established' });
            }
            else if (existingConnection2?.status === 'Pending') {
                existingConnection2.status = 'No Connection';
                console.log("updated connection2");
                await user2.save();
            }
            await user1.save();
            console.log('user1', user1);
            console.log('user2', user2);
            return res.json({ message: 'Connection request rejected successfully!' });
        }
        return res.status(200).json({ message: 'No connection request to reject' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Error updating user connections');
    }
};
exports.setCoverImage = async (req, res) => {
    console.log("came to setCoverImage controller");
    const userId = req.userId;
    const uploadSingle = upload("background", "background-images-entinno", userId).single("croppedImage");
    uploadSingle(req, res, async (err) => {
        if (err) {
            console.log("error in uploading single", err);
            return res.status(400).json({ success: false, message: err.message });
        }
        console.log("completed upload single fumcion");
        try {
            const userId = req.userId;
            const user = await userInfo_1.UserInfo.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            user.coverImageUrl = req.file.location;
            await user.save();
            return res.status(200).json({ data: req.file.location });
        }
        catch (error) {
            console.error('Error updating cover image url:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
};
exports.getUserInfo = async (req, res) => {
    {
        console.log("came for getUserInfo controller");
    }
    try {
        const { id } = req.params;
        console.log(id);
        const userInfo = await userInfo_1.UserInfo.findById(id);
        if (!userInfo) {
            return res.status(404).json({ message: 'User not found' });
        }
        const response = {
            id: userInfo._id,
            name: userInfo.firstName + ' ' + userInfo.lastName,
            profession: userInfo.profession,
            location: userInfo.location,
            username: userInfo.username,
            title: userInfo.title,
            skills: userInfo.skills,
            education: userInfo.education,
            about: userInfo.about,
            coverImageUrl: userInfo.coverImageUrl,
            profileImageUrl: userInfo.profileImageUrl,
            headline: userInfo.headline,
            bookmarks: userInfo.bookmarks,
            connections: userInfo.connections,
        };
        return res.status(200).json(response);
    }
    catch (err) {
        console.error('Error fetching user information:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUserInfoByUsername = async (req, res) => {
    console.log("came for getUserInfoByUsername controller");
    try {
        const { username } = req.params;
        console.log(username);
        const userInfo = await userInfo_1.UserInfo.findOne({ username });
        console.log(userInfo);
        if (!userInfo) {
            return res.status(404).json({ message: 'User not found' });
        }
        const response = {
            id: userInfo._id,
            name: userInfo.firstName + ' ' + userInfo.lastName,
            profession: userInfo.profession,
            location: userInfo.location,
            username: userInfo.username,
            title: userInfo.title,
            skills: userInfo.skills,
            education: userInfo.education,
            about: userInfo.about,
            coverImageUrl: userInfo.coverImageUrl,
            profileImageUrl: userInfo.profileImageUrl,
            headline: userInfo.headline,
            connections: userInfo.connections,
        };
        return res.status(200).json(response);
    }
    catch (err) {
        console.error('Error fetching user information:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.oAuthRequest = async (req, res, next) => {
    {
        console.log("came for the oauthRequest controller");
    }
    res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header("Referrer-Policy", "no-referrer-when-downgrade");
    const data = req.body.use;
    const redirectURL = `http://localhost:3000/${data}`;
    const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirectURL);
    try {
        const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid ',
            prompt: 'consent'
        });
        res.json({ url: authorizeUrl });
    }
    catch (error) {
        console.log("error occured in generating url", error);
    }
};
exports.oAuthHandler = async (req, res, next) => {
    {
        console.log("came for the oauthHandler controller");
    }
    const code = req.body.code;
    const data = req.body.use;
    try {
        const redirectURL = `http://localhost:3000/${data}`;
        const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirectURL);
        const response = await oAuth2Client.getToken(code);
        await oAuth2Client.setCredentials(response.tokens);
        const user = oAuth2Client.credentials;
        const ticket = await oAuth2Client.verifyIdToken({ idToken: user.id_token, audience: process.env.CLIENT_ID });
        const payload = ticket.getPayload();
        let existingUser = await userInfo_1.UserInfo.findOne({ email: payload.email });
        const isGoogleIdPresentInExsitingUser = existingUser?.googleId;
        if (!existingUser) {
            existingUser = new userInfo_1.UserInfo({
                googleId: payload.sub,
                email: payload.email,
                username: payload.email.split('@')[0],
                firstName: payload.given_name,
                lastName: payload.family_name,
                profilePicture: payload.picture,
            });
            await existingUser.save();
        }
        else if (!existingUser.googleId) {
            existingUser.googleId = payload.sub;
            await existingUser.save();
        }
        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });
        return res.status(200).json({
            success: true,
            to: isGoogleIdPresentInExsitingUser ? "home" : "info",
            jwt_token: token,
            user_id: existingUser._id,
            message: "Successfully authenticated",
        });
    }
    catch (err) {
        console.log('Error logging in with OAuth2 user', err);
        return res.status(500).json({ message: 'Error logging in' });
    }
};
exports.addBookMark = async (req, res) => {
    console.log('came to add bookmark controller');
    const { userId } = req.params;
    const { postId } = req.body;
    try {
        const user = await userInfo_1.UserInfo.findById(userId);
        if (!user) {
            console.log('user not found');
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.bookmarks.includes(postId)) {
            console.log('post already bookmarked');
            return res.status(400).json({ message: 'Post already bookmarked' });
        }
        user.bookmarks.push(postId);
        await user.save();
        console.log('bookmarks after adding', user.bookmarks);
        return res.status(200).json({ message: 'Post bookmarked successfully', user });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.removeBookMark = async (req, res) => {
    console.log('came to remove bookmark controller');
    const { userId } = req.params;
    const { postId } = req.body;
    console.log(postId);
    try {
        const user = await userInfo_1.UserInfo.findById(userId);
        if (!user) {
            console.log('user not found');
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.bookmarks.includes(postId)) {
            console.log('Post not bookmarked');
            return res.status(400).json({ message: 'Post not bookmarked' });
        }
        user.bookmarks = user.bookmarks.filter((id) => id.toString() !== postId.toString());
        console.log('bookmarks after removeal', user.bookmarks);
        await user.save();
        return res.status(200).json({ message: 'Post removed from bookmarks', user });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.getBookMarks = async (req, res) => {
    console.log("came to getBookmarks controller");
    const { userId } = req.params;
    try {
        const user = await userInfo_1.UserInfo.findById(userId).populate('bookmarks');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const bookmarks = user.bookmarks;
        console.log('bookmars', bookmarks);
        return res.status(200).json({ bookmarks });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
//# sourceMappingURL=userInfo-controller.js.map