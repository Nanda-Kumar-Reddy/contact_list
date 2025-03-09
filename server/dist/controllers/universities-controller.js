"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const universities_1 = require("../model/universities");
exports.getUniversities = async (req, res) => {
    const search_details = req.body;
    const searchText = search_details.search_text;
    console.log(searchText);
    try {
        const searchResult = await universities_1.Universities.find({
            $text: { $search: `${searchText}/i` }
        }).limit(10);
        return res.status(200).json(searchResult);
    }
    catch (error) {
        console.error('Error searching universities:', error);
        return res.status(500).json({ message: 'Error searching universities' });
    }
};
//# sourceMappingURL=universities-controller.js.map