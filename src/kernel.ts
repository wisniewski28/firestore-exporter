import * as moduleAlias from 'module-alias';
import 'module-alias/register';
import * as path from 'path';

export const boot = (): void => {
  globalImports();
};

function globalImports(): void {
  if (process.env.APP_ENV === 'dev') {
    moduleAlias.addAlias('app', path.join(__dirname, '..', 'src'));
  } else {
    moduleAlias.addAlias('app', path.join(__dirname, '..', 'dist'));
  }

  moduleAlias();
}
