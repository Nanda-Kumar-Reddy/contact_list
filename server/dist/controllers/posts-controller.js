"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const posts_1 = require("../model/posts");
const userInfo_1 = __importDefault(require("../model/userInfo"));
const { request } = require("request");
const { v4 } = require('uuid');
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
require('dotenv').config();
const fs = require('fs');
const qs = require('qs');
const S3 = require('aws-sdk/clients/s3');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_BUCKET_REGION,
});
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "post-assets-entinno",
        metadata: function (_req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (_req, file, cb) {
            const ext = file.mimetype.split("/")[1];
            const fileName = `${file.fieldname}-${Date.now()}.${ext}`;
            cb(null, fileName);
        },
    }),
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: function (_req, file, cb) {
        if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
            cb(null, true);
        }
        else {
            cb(new Error("Invalid file type, only images and videos are allowed!"), false);
        }
    },
}).fields([
    { name: 'CroppedImage', maxCount: 1 },
    { name: 'CroppedVideo', maxCount: 1 }
]);
exports.postingContent = async (req, res) => {
    console.log("came for postingConetn controller");
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        console.log('posting content req', req.files);
        try {
            const userId = req.userId;
            const contentText = req.body.contentText || "";
            let contentImage = null;
            let contentVideo = null;
            if (req.files && !Array.isArray(req.files) && "CroppedImage" in req.files) {
                const croppedImageFiles = req.files["CroppedImage"];
                if (croppedImageFiles && croppedImageFiles.length > 0) {
                    contentImage = croppedImageFiles[0]?.location || null;
                }
            }
            if (req.files && !Array.isArray(req.files) && "CroppedVideo" in req.files) {
                const croppedVideoFiles = req.files["CroppedVideo"];
                if (croppedVideoFiles && croppedVideoFiles.length > 0) {
                    contentVideo = croppedVideoFiles[0]?.location || null;
                }
            }
            const userInfo = await userInfo_1.default.findById(userId);
            const userImage = userInfo.profileImageUrl || "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg";
            const userName = userInfo.firstName + userInfo.lastName || "unknown";
            const newPost = new posts_1.Posts({
                userId,
                userImage,
                userName,
                contentText,
                contentImage,
                contentVideo,
            });
            await newPost.save();
            return res.status(200).json({ id: newPost._id, message: 'Post created successfully!' });
        }
        catch (error) {
            console.error('Error saving post:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
};
exports.postingImage = async (req, res) => {
    console.log("came for the posting the post image");
    const userId = req.userId;
    console.log('postingImage request 1', req.file);
    console.log(req.body);
    const uploadSingle = upload("post", "post-images-entinno", Date.now()).single("CroppedImage");
    uploadSingle(req, res, async (err) => {
        if (err) {
            console.log("error in uploading single", err);
            return res.status(400).json({ success: false, message: err.message });
        }
        console.log("completed upload single fumcion");
        console.log('postingImage request 2', req.file);
        try {
            const newPost = new posts_1.Posts({
                userId,
                contentImage: req.file.location,
            });
            console.log("new", newPost);
            await newPost.save();
            console.log("saved the post");
            return res.status(200).json({ data: req.file.location, id: newPost.id, message: 'Post created successfully!' });
        }
        catch (error) {
            console.error('Error updating post image url:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
    console.log('postingImage request 3', req.file);
};
exports.postingData = async (req, res) => {
    console.log("came for the posting the post data");
    const userId = req.userId;
    const postData = req.body;
    console.log(postData);
    const { userImage, userName, contentText = " ", id } = req.body;
    console.log(userImage, userName, contentText, id);
    try {
        const updatedPost = await posts_1.Posts.findByIdAndUpdate(id, { $set: { userName, userImage, contentText } }, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json({ post: updatedPost, message: 'Post updated successfully!' });
    }
    catch (error) {
        console.error('Error updating post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.repost = async (req, res) => {
    console.log("came to repost repost controller");
    const { postId } = req.params;
    const userId = req.userId;
    const { repostContent = " ", userImage, userName } = req.body;
    try {
        console.log(postId);
        const originalPost = await posts_1.Posts.findById(postId);
        console.log('orginalPostbefore');
        if (!originalPost) {
            console.log('no original post');
            return res.status(404).json({ message: 'Post not found' });
        }
        if (originalPost.reposts.users.includes(userId)) {
            return res.status(400).json({ message: 'You already reposted this post' });
        }
        const newPost = new posts_1.Posts({
            userId,
            userName,
            userImage,
            contentText: repostContent
        });
        const savedRepost = await newPost.save();
        console.log("not reposted before");
        const repostDetails = {
            originalUserId: originalPost.userId,
            originalUserImage: originalPost.userImage,
            originalUserName: originalPost.userName,
            contentText: originalPost.contentText,
            contentImage: originalPost.contentImage,
            contentVideo: originalPost.contentVideo,
            createdAt: originalPost.createdAt,
        };
        console.log('repostDetails', repostDetails);
        originalPost.reposts.count++;
        originalPost.reposts.users.push(userId);
        savedRepost.reposts.details.push(repostDetails);
        await originalPost.save();
        await savedRepost.save();
        console.log('orginal post', originalPost);
        console.log('saved rePost', savedRepost);
        return res.status(200).json({ message: 'Post reposted successfully', data: savedRepost });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error reposting post' });
    }
};
exports.getPosts = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await userInfo_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const posts = await posts_1.Posts.find({ _id: { $nin: user.hiddenPosts } });
        return res.status(200).json({ posts });
    }
    catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getPostByUserId = async (req, res) => {
    console.log("came for getpostbyUserid controller");
    const userId = req.params.id;
    try {
        const userPosts = await posts_1.Posts.find({ userId });
        return res.status(200).json({ message: 'Posts retrieved successfully', posts: userPosts });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching posts' });
    }
};
exports.getPostCountByUserId = async (req, res) => {
    console.log("came for get post count by user id controller");
    const userId = req.params.userId;
    try {
        const postCount = await posts_1.Posts.countDocuments({ userId });
        return res.status(200).json({ message: 'Post count retrieved successfully', postCount });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching post count' });
    }
};
exports.getPostById = async (req, res) => {
    console.log("came for getpostbyid controller");
    const { postId } = req.params;
    try {
        const post = await posts_1.Posts.findById(postId).populate('comments.userId', 'userName userImage');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json(post);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.likePost = async (req, res) => {
    console.log("came for liking the post");
    const userId = req.userId;
    const userName = req.body.userName;
    console.log(req.params.id);
    console.log(req.body);
    const post = await posts_1.Posts.findById(req.params.id);
    try {
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const alreadyLiked = post.likes.some((like) => like.userId === userId);
        console.log(alreadyLiked);
        if (alreadyLiked) {
            return res.status(400).json({ message: 'Already liked this post' });
        }
        const newLike = { userId, userName };
        post.likes.push(newLike);
        await post.save();
        return res.status(200).json({ message: 'Post liked successfully', updatedPost: post });
    }
    catch (err) {
        console.error('Error liking post:', err);
        return res.status(500).json({ message: 'Error liking post' });
    }
};
exports.unLikePost = async (req, res) => {
    console.log('came for unliking the post');
    console.log(req.params.id);
    const userId = req.userId;
    try {
        const post = await posts_1.Posts.findById(req.params.id);
        if (!post) {
            console.log('post not found for unliking');
            return res.status(404).json({ message: 'Post not found' });
        }
        const likeIndex = post.likes.findIndex((like) => like.userId === userId);
        if (likeIndex === -1) {
            console.log('post already unliked');
            return res.status(400).json({ message: 'Post not already liked' });
        }
        post.likes.splice(likeIndex, 1);
        await post.save();
        console.log(post);
        return res.status(200).json({ message: 'Post unliked successfully', updatedPost: post });
    }
    catch (err) {
        console.error('Error unliking post:', err);
        return res.status(500).json({ message: 'Error unliking post' });
    }
};
exports.saveComment = async (req, res) => {
    console.log("came to saveComment controller");
    const { commentText, userName, userImageUrl } = req.body;
    const userId = req.userId;
    const post = await posts_1.Posts.findById(req.params.id);
    if (!post) {
        console.log("there is no post with this id");
        return res.status(404).json({ message: 'Post not found' });
    }
    try {
        const newComment = {
            userId,
            userImageUrl,
            userName,
            commentText,
            createdAt: Date.now(),
        };
        post.comments.push(newComment);
        await post.save();
        return res.status(200).json({ message: 'Comment created successfully', updatedPost: post });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error creating comment' });
    }
};
exports.updateShares = async (req, res) => {
    console.log('came to updateShares controller');
    const postId = req.params.postId;
    const { userIds } = req.body;
    console.log(userIds);
    try {
        const post = await posts_1.Posts.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const existingUserIds = new Set(post.shares);
        const uniqueUserIds = userIds.filter((userId) => !existingUserIds.has(userId));
        post.shares.push(...uniqueUserIds);
        await post.save();
        console.log(post);
        return res.status(200).json({ message: 'Post shared successfully', updatedPost: post });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating post shares' });
    }
};
exports.deletePost = async (req, res) => {
    console.log("came to deletePost controller");
    const { postId } = req.params;
    const userId = req.userId;
    try {
        const post = await posts_1.Posts.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this post' });
        }
        await posts_1.Posts.findByIdAndDelete(postId);
        return res.status(200).json({ message: 'Post deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ message: 'Error deleting post' });
    }
};
exports.markAsNotInterested = async (req, res) => {
    const userId = req.userId;
    const { postId } = req.body;
    try {
        const user = await userInfo_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.hiddenPosts.includes(postId)) {
            user.hiddenPosts.push(postId);
            await user.save();
        }
        return res.status(200).json({ message: 'Post marked as not interested' });
    }
    catch (error) {
        console.error('Error marking post as not interested:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
//# sourceMappingURL=posts-controller.js.map