import mongoose, { Document, Model } from 'mongoose';
export interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    fromUser: mongoose.Types.ObjectId;
    profileImage?: string;
    name?: string;
    message: string;
    type: string;
    createdAt?: Date;
    seen: boolean;
}
declare const Notification: Model<INotification>;
export default Notification;
//# sourceMappingURL=notifications.d.ts.map