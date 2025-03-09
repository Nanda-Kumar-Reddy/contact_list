import { Document, Types, Model } from 'mongoose';
export interface ILike {
    userId: string;
    userName: string;
    createdAt?: Date;
}
interface IComment {
    userId: string;
    userImageUrl: string;
    userName: string;
    commentText: string;
    createdAt?: Date;
}
interface IRepostDetail {
    originalUserId: string;
    originalUserImage: string;
    originalUserName: string;
    contentText?: string;
    contentImage?: string;
    contentVideo?: string;
    createdAt?: string;
}
export interface IPost extends Document {
    userId: Types.ObjectId;
    userImage?: string;
    userName?: string;
    contentText?: string;
    contentImage?: string;
    contentVideo?: string;
    likes: ILike[];
    comments: IComment[];
    reposts: {
        count: number;
        users: string[];
        details: IRepostDetail[];
    };
    shares: string[];
    createdAt?: Date;
    updatedAt?: Date;
    numLikes?: number;
    numComments?: number;
}
declare const PostModel: Model<IPost>;
export default PostModel;
//# sourceMappingURL=posts.d.ts.map