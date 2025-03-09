import mongoose, { Document, Model } from 'mongoose';
export interface IEvent extends Document {
    user: mongoose.Types.ObjectId;
    eventImage: string;
    title: string;
    location?: string;
    country?: string;
    state?: string;
    registrationLink: string;
    domain: string;
    status?: string;
    description: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    attendees?: mongoose.Types.ObjectId[];
    createdAt?: Date;
}
declare const Event: Model<IEvent>;
export default Event;
//# sourceMappingURL=events.d.ts.map