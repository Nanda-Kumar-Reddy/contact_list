"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require('request');
const skills_1 = require("../model/skills");
exports.getSkills = async (req, res) => {
    console.log("came for getSkills controller");
    const search_details = req.body;
    const searchText = search_details.search_text;
    console.log(searchText);
    {
    }
    try {
        {
        }
        const searchResult = await skills_1.Skill.find({
            $text: { $search: `${searchText}/i` }
        }).limit(10);
        console.log(searchResult);
        return res.status(200).json(searchResult);
    }
    catch (error) {
        console.error("Error parsing response body:", error);
        return res.status(500).send({ message: "Error retrieving skills" });
    }
};
//# sourceMappingURL=skills-controller.js.map