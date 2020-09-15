require('module-alias/register');
require('config/modules');

import express, { Application } from 'express';
import router from 'app/routes/router';
import session from 'express-session';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';

const app: Application = express();

const HALF_HOUR = 1000 * 60 * 60 * 0.5;
const SESS_LIFETIME = HALF_HOUR;

app.set('view engine', 'pug');
app.use(express.static('public'));

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: SESS_LIFETIME,
    },
  })
);
app.use(router);

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000);
