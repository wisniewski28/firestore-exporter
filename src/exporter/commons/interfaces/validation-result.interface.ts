import { UploadedFile } from 'express-fileupload';

export interface ValidationResult {
  field: string;
  value: string | number | UploadedFile;
  messages: string[];
}
