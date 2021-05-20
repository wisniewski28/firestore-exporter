import { SERVICE_ACCOUNT_KEY_MIME_TYPES } from 'app/exporter/commons/enums/files-mime-types.enum';
import { AbstractDto } from 'app/exporter/dtos/abstract.dto';
import { registerDecorator, ValidationOptions } from 'class-validator';
import { UploadedFile } from 'express-fileupload';

export function IsJsonFile(validationOptions?: ValidationOptions) {
  return function (object: AbstractDto, propertyName: string): void {
    registerDecorator({
      name: 'isJsonFile',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: UploadedFile) {
          return SERVICE_ACCOUNT_KEY_MIME_TYPES.includes(value.mimetype);
        },
      },
    });
  };
}
