/**
 * Standardized API response helpers.
 */

export function success(res, data, message = null, statusCode = 200, meta = null) {
  const body = { success: true, data };
  if (message) body.message = message;
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

export function created(res, data, message = 'Created successfully') {
  return success(res, data, message, 201);
}

export function noContent(res) {
  return res.status(204).send();
}
