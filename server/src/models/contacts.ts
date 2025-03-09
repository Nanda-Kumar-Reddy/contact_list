import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContact extends Document {
  contactId: string;
  email: string;
  phone: string;
  name: string;
}

const ContactSchema: Schema<IContact> = new Schema(
  {
    contactId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Contact: Model<IContact> = mongoose.model<IContact>(
  "Contact",
  ContactSchema
);
export default Contact;
