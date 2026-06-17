import { ZodError } from 'zod';
import { ValidationError } from '../utils/apiError.js';

/**
 * Request validation middleware factory using Zod schemas.
 * Validates req.body, req.query, and/or req.params based on the schema keys.
 *
 * Usage:
 *   validate({ body: createItemSchema })
 *   validate({ body: loginSchema, query: paginationSchema })
 */
export function validate(schemas) {
  return (req, res, next) => {
    try {
      if (schemas.body) {
        Object.defineProperty(req, 'body', {
          value: schemas.body.parse(req.body),
          enumerable: true,
          configurable: true,
          writable: true
        });
      }
      if (schemas.query) {
        Object.defineProperty(req, 'query', {
          value: schemas.query.parse(req.query),
          enumerable: true,
          configurable: true,
          writable: true
        });
      }
      if (schemas.params) {
        Object.defineProperty(req, 'params', {
          value: schemas.params.parse(req.params),
          enumerable: true,
          configurable: true,
          writable: true
        });
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        throw new ValidationError(details);
      }
      throw err;
    }
  };
}
