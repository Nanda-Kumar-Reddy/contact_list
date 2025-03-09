declare global {
    namespace Express {
        interface Request {
            files?: {
                [fieldname: string]: Multer.File[];
            } | Multer.File[];
        }
    }
}
export {};
//# sourceMappingURL=posts-controller.d.ts.map