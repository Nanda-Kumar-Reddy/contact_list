"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Events = require('../model/events');
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
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
exports.createEvent = async (req, res) => {
    console.log('came to create Event controller');
    const { eventName, eventLocation, eventCountry, eventState, eventRegistrationLink, eventDomain, eventStatus, eventSelectedStartDate, eventSelectedEndDate, eventSelectedStartTime, eventSelectedEndTime, eventDescription, user } = req.body;
    try {
        const newEvent = new Events({
            title: eventName,
            location: eventLocation,
            country: eventCountry,
            state: eventState,
            registrationLink: eventRegistrationLink,
            domain: eventDomain,
            status: eventStatus,
            startDate: eventSelectedStartDate,
            endDate: eventSelectedEndDate,
            startTime: eventSelectedStartTime,
            endTime: eventSelectedEndTime,
            user,
            description: eventDescription,
        });
        console.log('created the event but not saved', newEvent);
        const savedEvent = await newEvent.save();
        console.log("saved the event to database");
        console.log("saved Event", savedEvent);
        return res.status(201).json({ message: 'Event created successfully!', data: savedEvent });
    }
    catch (err) {
        console.error('Error creating event:', err);
        if (err instanceof Error) {
            if (err.message === 'Invalid token') {
                return res.status(403).json({ message: 'Forbidden' });
            }
        }
        return res.status(500).json({ message: 'Error creating event!' });
    }
};
exports.setEventImage = async (req, res) => {
    console.log("came to setEventImage controller");
    const { eventId } = req.params;
    console.log("eventId", eventId);
    const uploadSingle = upload("event", "event-background-images-entinno", Date.now()).single("croppedImage");
    uploadSingle(req, res, async (err) => {
        if (err) {
            console.error("Error in uploading single:", err);
            return res.status(400).json({ success: false, message: err.message });
        }
        console.log("Completed upload single function");
        try {
            const event = await Events.findById(eventId);
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }
            if (req.file && req.file.location) {
                event.eventImage = req.file.location;
            }
            else {
                return res.status(400).json({
                    message: "No file uploaded or file location missing",
                });
            }
            await event.save();
            return res.status(200).json({ data: req.file.location });
        }
        catch (error) {
            console.error("Error updating event image URL:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
};
exports.getEvents = async (req, res) => {
    console.log("came for getEventsController");
    try {
        const eventsInfo = await Events.find();
        const eventsInfos = eventsInfo.map((event) => ({
            id: event._id,
            eventImage: event.eventImage,
            title: event.title,
            country: event.country,
            startDate: event.startDate,
            startTime: event.startTime,
            status: event.status,
            domain: event.domain,
        }));
        console.log(eventsInfos);
        return res.status(200).json(eventsInfos);
    }
    catch (err) {
        console.log("error in extracting eventinfos", err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getEventById = async (req, res) => {
    console.log("came to getEventById controller");
    const { id } = req.params;
    try {
        const event = await Events.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        const response = {
            title: event.title,
            eventImage: event.eventImage,
            location: event.location,
            country: event.country,
            state: event.state,
            registrationLink: event.registrationLink,
            status: event.status,
            domain: event.domain,
            startDate: event.startDate,
            endDate: event.endDate,
            startTime: event.startTime,
            endTime: event.endTime,
            description: event.description,
            attendees: event.attendees,
        };
        console.log(response);
        return res.status(200).json(response);
    }
    catch (err) {
        console.log("error in getting event", err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.attendEvent = async (req, res) => {
    console.log("came to attendEvent controller");
    const { eventId } = req.params;
    const { userId } = req.body;
    try {
        const event = await Events.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.attendees.includes(userId)) {
            console.log("user already attending");
            return res.status(400).json({ message: 'User already attending' });
        }
        event.attendees.push(userId);
        await event.save();
        const updatedEvent = {
            title: event.title,
            eventImage: event.eventImage,
            location: event.location,
            country: event.country,
            state: event.state,
            registrationLink: event.registrationLink,
            status: event.status,
            domain: event.domain,
            startDate: event.startDate,
            endDate: event.endDate,
            startTime: event.startTime,
            endTime: event.endTime,
            description: event.description,
            attendees: event.attendees,
        };
        return res.status(200).json({ message: 'User added to attendees', updatedEvent });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error attending event' });
    }
};
exports.unAttendEvent = async (req, res) => {
    const { eventId } = req.params;
    const { userId } = req.body;
    try {
        const event = await Events.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        const index = event.attendees.indexOf(userId);
        if (index === -1) {
            return res.status(400).json({ message: 'User is not attending' });
        }
        event.attendees.splice(index, 1);
        await event.save();
        const updatedEvent = {
            title: event.title,
            eventImage: event.eventImage,
            location: event.location,
            country: event.country,
            state: event.state,
            registrationLink: event.registrationLink,
            status: event.status,
            domain: event.domain,
            startDate: event.startDate,
            endDate: event.endDate,
            startTime: event.startTime,
            endTime: event.endTime,
            description: event.description,
            attendees: event.attendees,
        };
        return res.status(200).json({ message: 'User removed from attendees', updatedEvent });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error unattending event' });
    }
};
//# sourceMappingURL=events-controller.js.map