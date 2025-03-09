import { Document, Model } from 'mongoose';
export interface ISkill extends Document {
    name: string;
}
declare const SkillModel: Model<ISkill>;
export default SkillModel;
//# sourceMappingURL=skills.d.ts.map