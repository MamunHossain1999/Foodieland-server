import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape } from "zod";

export const validate = (schema: ZodObject<ZodRawShape>) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      res.status(400).json({ message: err.errors?.[0]?.message || "Validation Error" });
    }
  };
