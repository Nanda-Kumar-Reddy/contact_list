import { Document, Model } from 'mongoose';
export interface GroupMember {
    userId: string;
    name: string;
    profileImageUrl: string;
}
export interface IGroup extends Document {
    members: GroupMember[];
    name: string;
    profileImageUrl?: string;
    admin: string;
    createdAt?: Date;
    updatedAt?: Date;
}
declare const Group: Model<IGroup>;
export default Group;
//# sourceMappingURL=Group.d.ts.map