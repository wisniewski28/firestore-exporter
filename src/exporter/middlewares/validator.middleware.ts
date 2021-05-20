import { ValidationResult } from 'app/exporter/commons/interfaces/validation-result.interface';
import { AbstractDto } from 'app/exporter/dtos/abstract.dto';
import { ValidatedRequest } from 'app/exporter/requests/validated.request';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';
import { NextFunction, Response } from 'express';

export const validator = (dto: ClassConstructor<AbstractDto>) => {
  return (req: ValidatedRequest, res: Response, next: NextFunction): void =>
    validatorHandler(dto, req, res, next);
};

const validatorHandler = (
  dto: ClassConstructor<AbstractDto>,
  req: ValidatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  console.log(dto);
  console.log(req.files);

  const classDto = plainToClass(dto, req.files);
  console.log(classDto);

  validateDto(classDto).then((errors) => {
    if (errors.length > 0) {
      if (req.session) {
        req.session.validationErrors = errors;
      }
      res.redirect('back');
    } else {
      req.validated = classDto;
      next();
    }
  });
};

const validateDto = async (
  dto: AbstractDto,
  options: ValidatorOptions = {
    whitelist: true,
    stopAtFirstError: true,
  },
): Promise<ValidationResult[]> => {
  console.log(dto);

  const validationErrors = await validate(dto, options);
  const errors: ValidationResult[] = [];

  for (const error of validationErrors) {
    const messages: string[] = [];

    if (error.constraints) {
      for (const message of Object.keys(error.constraints)) {
        const errMsg = error.constraints[message];
        messages.push(errMsg.substr(errMsg.indexOf(' ') + 1));
      }
    }

    errors.push({ field: error.property, value: error.value, messages });
  }

  return errors;
};
