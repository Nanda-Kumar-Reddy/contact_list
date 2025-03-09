import { Document, Model } from "mongoose";
export interface IChat extends Document {
    members: string[];
    createdAt?: Date;
    updatedAt?: Date;
}
declare const Chat: Model<IChat>;
export default Chat;
//# sourceMappingURL=chat.d.ts.map