import router from 'app/router';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as express from 'express';
import { Application } from 'express';
import * as fileUpload from 'express-fileupload';
import * as session from 'express-session';

const app: Application = express();
const port = Number(process.env.APP_PORT);

export const server = (): void => {
  app.set('view engine', 'pug');

  app.use(express.static('public'));
  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? '',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: Number(process.env.SESSION_LIFETIME) * 60 * 1000,
      },
    }),
  );
  app.use(
    fileUpload({
      createParentPath: true,
    }),
  );
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(compression());

  app.use(router);

  app.listen(port);

  console.log('App is running...');
};
