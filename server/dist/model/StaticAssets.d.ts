import mongoose, { Document } from 'mongoose';
interface IStaticAsset extends Document {
    key: string;
    url: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const StaticAsset: mongoose.Model<IStaticAsset, {}, {}, {}, mongoose.Document<unknown, {}, IStaticAsset> & IStaticAsset & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default StaticAsset;
//# sourceMappingURL=StaticAssets.d.ts.map