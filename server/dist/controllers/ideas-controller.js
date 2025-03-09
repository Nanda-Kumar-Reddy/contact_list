"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ideas_1 = require("../model/ideas");
function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unknown error occurred.';
}
exports.createIdea = async (req, res) => {
    console.log("came for createIdea controller");
    const { user, heading, description } = req.body;
    try {
        const newIdea = new ideas_1.Ideas({
            user,
            heading,
            description,
        });
        console.log('created the idea but not saved', newIdea);
        const savedIdea = await newIdea.save();
        console.log("saved the idea");
        return res.status(201).json({ message: 'Idea created successfully!', data: savedIdea });
    }
    catch (err) {
        console.error('Error creating idea:', err);
        if (getErrorMessage(err) === 'Invalid token') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        return res.status(500).json({ message: 'Error creating idea!' });
    }
};
exports.getIdeas = async (req, res) => {
    console.log("came for getIdeas controller");
    try {
        const ideas = await ideas_1.Ideas.find({});
        return res.status(200).json({ ideas });
    }
    catch (err) {
        console.error('Error fetching ideas:', err);
        return res.status(500).json({ message: 'Error fetching ideas' });
    }
};
//# sourceMappingURL=ideas-controller.js.map