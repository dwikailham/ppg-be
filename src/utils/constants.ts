export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const HTTP_MESSAGE = {
  OK: 'Success',
  CREATED: 'Created successfully',
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  CONFLICT: 'Conflict detected',
  INTERNAL_SERVER_ERROR: 'Internal server error',
};

export const SCOPE_TYPE = {
  KELOMPOK: 'KELOMPOK',
  DESA: 'DESA',
};

type HttpStatusKey = keyof typeof HTTP_STATUS;

export type ScopeType = keyof typeof SCOPE_TYPE;
