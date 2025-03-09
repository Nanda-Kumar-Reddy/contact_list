import { Document, Model } from 'mongoose';
export interface IOtpVerification extends Document {
    email: string;
    otp: string;
    token: string;
    createdAt?: Date;
    expiresAt?: Date;
}
declare const OtpVerification: Model<IOtpVerification>;
export default OtpVerification;
//# sourceMappingURL=otpVerificaton.d.ts.map