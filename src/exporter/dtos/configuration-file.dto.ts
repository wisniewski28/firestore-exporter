import { AbstractDto } from 'app/exporter/dtos/abstract.dto';
import { IsJsonFile } from 'app/exporter/validators/is-json-file';
import { UploadedFile } from 'express-fileupload';

export class ConfigurationFileDto extends AbstractDto {
  @IsJsonFile()
  saKey?: UploadedFile;
}
