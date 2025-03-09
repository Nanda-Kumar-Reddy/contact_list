import { Document, Model } from 'mongoose';
export interface ICountry extends Document {
    name: string;
    code?: string;
    region?: string;
}
declare const Country: Model<ICountry>;
export default Country;
//# sourceMappingURL=country.d.ts.map