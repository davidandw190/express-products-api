import { AnyZodObject, ZodError } from 'zod';
import { NextFunction, Request, Response } from 'express';

/**
 * Middleware function to validate incoming request data against a Zod schema.
 * @param schema Zod schema to validate against.
 */
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();

    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: 'Validation failed', errors: error.errors });
      } else {
        console.error('Validation middleware error:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
};
