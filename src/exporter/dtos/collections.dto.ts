import { AbstractDto } from 'app/exporter/dtos/abstract.dto';
import { IsArray, IsBoolean } from 'class-validator';

export class CollectionsDto extends AbstractDto {
  @IsBoolean()
  zipped?: boolean;

  @IsArray()
  collections?: string[];
}
