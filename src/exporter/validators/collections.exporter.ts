import * as yup from 'yup';
import { ObjectSchemaDefinition } from 'yup';

class CollectionsExporter<T extends object> {
  static rules: ObjectSchemaDefinition<CollectionsExporter<object>> = {
    collections: yup.mixed().required('At least one collection is required'),
    format: yup.string().required('Format is required'),
  };
}

export default CollectionsExporter;
