import mongoose, { Document } from "mongoose";
export interface IExperience {
    title: string;
    company?: string;
    location?: string;
    startDate?: Date;
    endDate?: Date;
    description?: string;
}
export interface IConnection {
    userId: mongoose.Types.ObjectId;
    status?: string;
}
export interface ISkill {
    name: string;
}
export interface IEducation {
    name: string;
}
export interface IUserInfo extends Document {
    firstName?: string;
    lastName?: string;
    email: string;
    password?: string;
    googleId?: string;
    username: string;
    profileImageUrl?: string;
    coverImageUrl?: string;
    profession?: string;
    headline?: string;
    about?: string;
    title?: string;
    summary?: string;
    location?: string;
    website?: string;
    industry?: string;
    company?: string;
    jobTitle?: string;
    experience?: IExperience[];
    connections?: IConnection[];
    following?: mongoose.Types.ObjectId[];
    skills?: ISkill[];
    education?: IEducation[];
    bookmarks?: mongoose.Types.ObjectId[];
    hiddenPosts?: mongoose.Types.ObjectId[];
    [key: string]: any;
}
declare const UserInfo: mongoose.Model<IUserInfo, {}, {}, {}, mongoose.Document<unknown, {}, IUserInfo> & IUserInfo & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default UserInfo;
//# sourceMappingURL=userInfo.d.ts.map