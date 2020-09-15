import { NextFunction, Request, Response } from 'express';
import { ObjectSchema, ObjectSchemaDefinition, Shape } from 'yup';
import * as yup from 'yup';
import { ValidatorRules } from 'app/core/index';

async function handle<T extends object>(
  req: Request,
  res: Response,
  next: NextFunction,
  validatorRules: ValidatorRules<T>
): Promise<Response | void> {
  let bodyValidationErrors = [];
  let fileValidationErrors = [];

  let bodyValidatedData = {};
  let fileValidatedData = {};

  if (validatorRules.rules) {
    try {
      bodyValidatedData = await contextValidation(
        req,
        validatorRules.rules,
        'body'
      );
    } catch (errors) {
      bodyValidationErrors = errors;
    }
  }

  if (validatorRules.filesRules) {
    try {
      fileValidatedData = await contextValidation(
        req,
        validatorRules.filesRules,
        'files'
      );
    } catch (errors) {
      fileValidationErrors = errors;
    }
  }

  const validationErrors = [...bodyValidationErrors, ...fileValidationErrors];

  if (validationErrors.length > 0) {
    req!.session!.validationErrors = validationErrors;
    res.redirect('back');
  } else {
    req.validated = {
      ...bodyValidatedData,
      ...fileValidatedData,
    };
    next();
  }
}

async function contextValidation<T extends object>(
  req: Request,
  rules: ObjectSchemaDefinition<T>,
  context: 'body' | 'files'
) {
  try {
    const validationRules: ObjectSchema<Shape<
      object | undefined,
      T
    >> = yup.object().shape<T>(rules);

    const fields = Object.keys(validationRules.describe().fields);

    if (context === 'files' && req.files === null) {
      req.files = undefined;
    }

    const validatedData: any = await validationRules.validate(req[context], {
      abortEarly: false,
    });

    const validated: any = {};
    fields.forEach((key) => {
      validated[key] = validatedData[key];
    });
    return validated;
  } catch (error) {
    throw error.errors;
  }
}

function validate<T extends object>(validatorRules: ValidatorRules<T>) {
  return function (req: Request, res: Response, next: NextFunction) {
    return handle(req, res, next, validatorRules);
  };
}

export default validate;
