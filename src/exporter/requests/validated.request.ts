import { Request } from 'express';
import * as core from 'express-serve-static-core';

export interface ValidatedRequest<
  DtoClass = any,
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = qs.ParsedQs
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  validated: DtoClass;
}
