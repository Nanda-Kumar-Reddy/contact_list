import { Request, Response, NextFunction } from 'express';
declare const verifyJWT: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export default verifyJWT;
//# sourceMappingURL=verify-jwt.d.ts.map