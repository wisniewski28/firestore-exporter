import { ObjectSchemaDefinition } from 'yup';

interface ValidatorRules<T extends object> {
  rules?: ObjectSchemaDefinition<T>;
  filesRules?: ObjectSchemaDefinition<T>;
}
