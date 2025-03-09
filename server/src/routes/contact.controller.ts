// import { Request, Response } from 'express';
import Contact from "../models/contacts";
import { Request, Response } from "express";
export const createContact = async (req: Request, res: Response) => {
  console.log("came to createContact");
  const { email, phone, name } = req.body;
  console.log(email, phone, name);
  try {
    // console.log('req.body', req.body)
    const contact = await Contact.create({
      contactId: new Date().getTime().toString(),
      email,
      phone,
      name,
    });
    // await contact.save();
    console.log("contact", contact);
    res.status(201).send(contact);
  } catch (error: any) {
    console.log("error", error);
    res.status(500).send(error.message);
  }
};

export const getContacts = async (req: Request, res: Response) => {
  console.log("came to getContacts");
  try {
    const contacts = await Contact.find();
    res.status(200).send(contacts);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const getContact = async (req: Request, res: Response) => {
  console.log("came to createContact");
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).send("Contact not found");
    }
    res.status(200).send(contact);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const updateContact = async (req: Request, res: Response) => {
  console.log("came to updateContact");
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!contact) {
      return res.status(404).send("Contact not found");
    }
    res.status(200).send(contact);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  console.log("came to deleteContact");
  console.log(req.params.id);
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).send("Contact not found");
    }
    res.status(200).send(contact);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};
