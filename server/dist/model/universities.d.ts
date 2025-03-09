import { Document, Model } from 'mongoose';
export interface IUniversity extends Document {
    country: string;
    name: string;
    url: string;
}
declare const UniversityModel: Model<IUniversity>;
export default UniversityModel;
//# sourceMappingURL=universities.d.ts.map