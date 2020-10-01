import { Request } from 'express';

/**
 * Returns validation errors from a session and removes errors from the session.
 *
 * @param req
 */
export function validationErrorCheck(req: Request) {
  if (req.session && req.session.validationErrors) {
    let errors = req.session.validationErrors;
    req.session.validationErrors = [];
    return errors;
  } else {
    return [];
  }
}

export function clean(req: Request) {
  if (req.session) {
    if (req.session.validationErrors) {
      req.session.validationErrors = [];
    }

    if (req.session.serviceAccountJsonKey) {
      req.session.serviceAccountJsonKey = null;
    }
  }
}
