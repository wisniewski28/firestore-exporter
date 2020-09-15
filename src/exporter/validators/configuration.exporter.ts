import * as yup from 'yup';
import { ObjectSchemaDefinition } from 'yup';

class ConfigurationExporter<T extends object> {
  static filesRules: ObjectSchemaDefinition<ConfigurationExporter<object>> = {
    saKey: yup
      .mixed()
      .required('A file is required')
      .test(
        'mimetype',
        'Unsupported Format',
        (value) => value && ['application/json'].includes(value.mimetype)
      ),
  };
}

export default ConfigurationExporter;
