"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const aws = require("aws-sdk");
const multer = require('multer');
const multerS3 = require('multer-s3');
const Group_1 = require("../model/Group");
const s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_BUCKET_REGION,
});
function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unknown error occurred.';
}
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
exports.createGroup = async (req, res) => {
    console.log('came to createGroup controller');
    try {
        const { name, members } = req.body;
        console.log('req.body', req.body);
        if (!name || !members) {
            return res.status(400).json({ success: false, error: 'Group name and members are required.' });
        }
        const admin = req.userId;
        const memberDetails = members.map((member) => ({
            userId: member.userId,
            name: member.name,
            profileImageUrl: member.profileImageUrl,
        }));
        const newGroup = new Group_1.Group({
            name,
            members: memberDetails,
            admin,
        });
        const savedGroup = await newGroup.save();
        return res.status(200).json({ success: true, group: savedGroup });
    }
    catch (error) {
        console.error('Error creating group:', error);
        return res.status(500).json({ success: false, error: getErrorMessage(error) });
    }
};
exports.deleteGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.userId;
        const group = await Group_1.Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ success: false, error: 'Group not found.' });
        }
        if (group.admin !== userId) {
            return res.status(403).json({ success: false, error: 'Only the admin can delete this group.' });
        }
        await Group_1.Group.findByIdAndDelete(groupId);
        return res.status(200).json({ success: true, message: 'Group deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting group:', error);
        return res.status(500).json({ success: false, error: getErrorMessage(error) });
    }
};
exports.updateGroupImage = async (req, res) => {
    console.log('came to upage the group image');
    const groupId = req.params.groupId;
    if (!groupId) {
        return res.status(400).json({ success: false, error: 'Group ID is required.' });
    }
    const uploadSingle = upload('group', 'group-images-entinno', groupId).single('profileImage');
    uploadSingle(req, res, async (err) => {
        if (err) {
            console.error('Error uploading image:', err);
            if (err.message.includes('Invalid file type')) {
                return res.status(400).json({ success: false, message: 'Invalid file type. Please upload an image.' });
            }
            if (err.message.includes('File too large')) {
                return res.status(400).json({ success: false, message: 'File size exceeds the limit. Maximum size is 100MB.' });
            }
            return res.status(500).json({
                success: false,
                message: 'An error occurred during file upload. Please try again later.',
            });
        }
        try {
            console.log('came to upage the after completing the aws');
            const profileImageUrl = req.file ? req.file.location : '';
            const group = await Group_1.Group.findByIdAndUpdate(groupId, { profileImageUrl }, { new: true });
            if (!group) {
                return res.status(404).json({ success: false, error: 'Group not found.' });
            }
            return res.status(200).json({ success: true, group });
        }
        catch (error) {
            console.error('Error updating group image:', error);
            return res.status(500).json({ success: false, error: getErrorMessage(error) });
        }
    });
    return res.status(500).json({
        success: false,
        message: 'Internal server error. The request could not be completed due to server issues.',
    });
};
exports.getGroups = async (req, res) => {
    try {
        const groups = await Group_1.Group.find();
        console.log(groups);
        return res.status(200).json(groups);
    }
    catch (error) {
        console.error("Error fetching groups:", error);
        return res.status(500).json({ error: "Error fetching groups." });
    }
};
exports.getGroupById = async (req, res) => {
    const { groupId } = req.params;
    if (!groupId) {
        return res.status(400).json({ success: false, error: 'Please provide a group ID.' });
    }
    try {
        const group = await Group_1.Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ success: false, error: 'Group not found.' });
        }
        return res.status(200).json(group);
    }
    catch (error) {
        console.error("Error fetching group:", error);
        return res.status(500).json({ error: "Error fetching group." });
    }
};
exports.getUserGroups = async (req, res) => {
    console.log("came to getUserGroups controller");
    try {
        const groups = await Group_1.Group.find({
            members: { $elemMatch: { userId: req.params.userId } }
        });
        console.log('user groups data in getUserGroups controller', groups);
        return res.status(200).json(groups);
    }
    catch (error) {
        console.error('Error fetching user groups:', error);
        return res.status(500).json({ error: "Error fetching user groups." });
    }
};
exports.updateGroup = async (req, res) => {
    console.log("Came to updateGroup controller");
    const groupId = req.params.groupId;
    const { name, members } = req.body;
    const userId = req.userId;
    if (!groupId) {
        return res.status(400).json({ success: false, error: "Group ID is required." });
    }
    try {
        const group = await Group_1.Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ success: false, error: "Group not found." });
        }
        if (group.admin.toString() !== userId) {
            return res.status(403).json({ success: false, error: "Only the admin can update this group." });
        }
        group.name = name || group.name;
        if (members && Array.isArray(members)) {
            group.members = members;
        }
        const updatedGroup = await group.save();
        return res.status(200).json({ success: true, group: updatedGroup });
    }
    catch (error) {
        console.error("Error updating group:", error);
        return res.status(500).json({ success: false, error: "Error updating group." });
    }
};
//# sourceMappingURL=groups-controller.js.map