const express = require("express");
const contactRouter = express.Router();

import {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
} from "./contact.controller";

contactRouter.post("/create", createContact);
contactRouter.get("/getContacts", getContacts);
contactRouter.get("/getContact/:id", getContact);
contactRouter.put("/updateContact/:id", updateContact);
contactRouter.delete("/deleteContact/:id", deleteContact);

module.exports = contactRouter;
