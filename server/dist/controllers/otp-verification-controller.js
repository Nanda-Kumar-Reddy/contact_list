"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const otpVerificaton_1 = __importDefault(require("../model/otpVerificaton"));
const userInfo_1 = __importDefault(require("../model/userInfo"));
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_ID
    }
});
exports.requestOtp = async (req, res) => {
    console.log("came for otp request");
    const email = req.body.email;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const token = crypto.randomBytes(16).toString('hex');
    try {
        let existingOtp = await otpVerificaton_1.default.findOne({ email });
        if (existingOtp) {
            existingOtp.otp = otp;
            existingOtp.token = token;
            existingOtp.createdAt = Date.now();
            await existingOtp.save();
        }
        else {
            const newOtp = new otpVerificaton_1.default({ email, otp, token });
            await newOtp.save();
        }
        const mailOptions = {
            from: {
                name: 'businessSphere',
                address: process.env.SMTP_USER
            },
            to: email,
            subject: 'Your OTP for Verification',
            text: `Your one-time password (OTP) is: ${otp}`
        };
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'OTP sent successfully!' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error sending OTP' });
    }
};
exports.verifyForgotPassworedOtp = async (req, res) => {
    console.log("came for verifyforgotPasswored otp request");
    const email = req.body.email;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const token = crypto.randomBytes(16).toString('hex');
    try {
        const user = await userInfo_1.default.findOne({ email });
        if (!user) {
            console.log("user Not Found");
            return res.status(404).json({
                message: 'email not found'
            });
        }
        let existingOtp = await otpVerificaton_1.default.findOne({ email });
        if (existingOtp) {
            console.log("there is an existing user");
            existingOtp.otp = otp;
            existingOtp.token = token;
            existingOtp.createdAt = Date.now();
            await existingOtp.save();
        }
        else {
            console.log("creating the new otp ");
            const newOtp = new otpVerificaton_1.default({ email, otp, token });
            await newOtp.save();
        }
        const mailOptions = {
            from: {
                name: 'businessSphere',
                address: process.env.SMTP_USER
            },
            to: email,
            subject: 'Your OTP for Verification',
            text: `Your one-time password (OTP) is: ${otp}`
        };
        await transporter.sendMail(mailOptions);
        console.log("otp send successfully");
        return res.status(200).json({ message: 'OTP sent successfully!' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error sending OTP' });
    }
};
exports.verifyOtp = async (req, res) => {
    console.log("came for otp verification");
    const email = req.body.email;
    const otp = req.body.otp;
    const token = req.body.token;
    console.log("verify otp token", token);
    try {
        const storedOtp = await otpVerificaton_1.default.findOne({ email });
        if (storedOtp && storedOtp.otp === otp && (token ? storedOtp.token === token : true)) {
            await otpVerificaton_1.default.deleteOne({ _id: storedOtp._id });
            return res.status(200).json({ message: 'OTP verified successfully!' });
        }
        else {
            return res.status(401).json({ message: 'Invalid OTP' });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error verifying OTP' });
    }
};
exports.forgotpasswordverifyotpsubmit = async (req, res) => {
    console.log("Came for forgotpasswordverifyotpsubmit request");
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }
    try {
        const storedOtp = await otpVerificaton_1.default.findOne({ email });
        if (!storedOtp) {
            console.log("No OTP record found for this email");
            return res.status(404).json({ message: 'OTP not found or expired' });
        }
        if (storedOtp.otp !== otp) {
            console.log("Invalid OTP entered");
            return res.status(401).json({ message: 'Invalid OTP. Please try again.' });
        }
        const user = await userInfo_1.default.findOne({ email });
        if (!user) {
            console.log("User not found for this email");
            return res.status(404).json({ message: 'User not found' });
        }
        console.log("OTP verified successfully");
        await otpVerificaton_1.default.deleteOne({ _id: storedOtp._id });
        return res.status(200).json({ message: 'OTP verified successfully. Proceed to reset your password.', userId: user._id });
    }
    catch (error) {
        console.error("Error during OTP submission:", error);
        return res.status(500).json({ message: 'An error occurred during OTP verification. Please try again later.' });
    }
};
//# sourceMappingURL=otp-verification-controller.js.map