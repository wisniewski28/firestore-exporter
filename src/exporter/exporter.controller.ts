import { Request, Response } from 'express';
import firebase from 'firebase-admin';
import ConfigurationExporter from 'app/exporter/validators/configuration.exporter';
import CollectionsExporter from 'app/exporter/validators/collections.exporter';

class ExporterController {
  configurationRules = ConfigurationExporter;
  collectionsRules = CollectionsExporter;

  setupDbConnection = (jsonKey: JsonServiceAccountKey) => {
    firebase.initializeApp({
      credential: firebase.credential.cert({
        projectId: jsonKey.project_id,
        clientEmail: jsonKey.client_email,
        privateKey: jsonKey.private_key,
      }),
    });
    return firebase.firestore();
  };

  closeConnection = () =>
    firebase
      .app()
      .delete()
      .then(() => 'OK');

  validationErrorCheck = (req: Request) => {
    if (req.session && req.session.validationErrors) {
      let errors = req.session.validationErrors;
      req.session.validationErrors = [];
      return errors;
    } else {
      return [];
    }
  };

  configurationView = (req: Request, res: Response) => {
    res.status(200);
    res.render('pages/configuration', {
      title: 'Configuration',
      errors: { validationErrors: this.validationErrorCheck(req) },
    });
  };

  configuration = async (req: Request, res: Response) => {
    const saKey = req.validated.saKey;

    const serviceAccountJsonKey = JSON.parse(saKey.data.toString());

    try {
      const db = this.setupDbConnection(serviceAccountJsonKey);
      await db.listCollections();
      await this.closeConnection();

      if (req.session) {
        req.session.serviceAccountJsonKey = serviceAccountJsonKey;
      }
      res.redirect('/collections');
    } catch {
      res.status(422);
      res.render('pages/configuration', {
        title: 'Configuration',
        errors: { connection: true },
      });
    }
  };

  collectionsView = async (req: Request, res: Response) => {
    if (req.session && req.session.serviceAccountJsonKey) {
      const db = this.setupDbConnection(req.session.serviceAccountJsonKey);
      const listCollections = await db.listCollections();
      await this.closeConnection();

      res.status(200);
      res.render('pages/collections', {
        title: 'Collections',
        collections: listCollections.map((collection) => {
          return collection.path;
        }),
        errors: {
          validationErrors: this.validationErrorCheck(req),
        },
      });
    } else {
      res.status(400);
      res.render('pages/configuration', {
        title: 'Configuration',
        errors: {
          session: true,
        },
      });
    }
  };

  collections = async (req: Request, res: Response) => {
    if (req.session && req.session.serviceAccountJsonKey) {
      const db = this.setupDbConnection(req.session.serviceAccountJsonKey);
      const listCollections = await db.listCollections();

      const data = [];
      if (typeof req.validated.collections === 'string') {
        const snapshot = await db.collection(req.validated.collections).get();
        data[req.validated.collections] = snapshot.docs.map((doc) =>
          doc.data()
        );
      } else {
        for (let collection of req.validated.collections) {
          const snapshot = await db.collection(collection).get();
          data[collection] = snapshot.docs.map((doc) => doc.data());
        }
      }
      await this.closeConnection();

      for (let collection of req.validated.collections)
        console.log(collection, ': ', data[collection]);

      res.status(200);
      res.render('pages/collections', {
        title: 'Collections',
        collections: listCollections.map((collection) => {
          return collection.path;
        }),
      });
    } else {
      res.status(400);
      res.render('pages/configuration', {
        title: 'Configuration',
        errors: { session: true },
      });
    }
  };
}

export default new ExporterController();
