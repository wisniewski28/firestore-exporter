import { Request, Response } from 'express';
import archiver from 'archiver';
import ConfigurationExporter from 'app/exporter/validators/configuration.exporter';
import CollectionsExporter from 'app/exporter/validators/collections.exporter';
import admin from 'firebase-admin';
import CollectionReference = admin.firestore.CollectionReference;
import { validationErrorCheck } from 'app/exporter/helpers/session.exporter';
import {
  closeConnection,
  retrieveDocs,
  setupDbConnection,
} from 'app/exporter/helpers/firestore.exporter';
import { prepareCsv } from 'app/exporter/helpers/files.exporter';

class ExporterController {
  configurationRules = ConfigurationExporter;
  collectionsRules = CollectionsExporter;

  /**
   * Returns Home Screen view.
   *
   * @param req
   * @param res
   */
  homeScreenView = (req: Request, res: Response) => {
    res.status(200);
    res.render('pages/homeScreen', {
      title: 'Home Screen',
    });
  };

  /**
   * Returns configuration view.
   *
   * @param req
   * @param res
   */
  configurationView = (req: Request, res: Response) => {
    res.status(200);
    res.render('pages/configuration', {
      title: 'Configuration',
      errors: { validationErrors: validationErrorCheck(req) },
    });
  };

  /**
   * Configuration method responsible for checking if Firestore is accessible with a given key and storing it in the session if yes.
   *
   * @param req
   * @param res
   */
  configuration = async (req: Request, res: Response) => {
    const saKey = req.validated.saKey;

    const serviceAccountJsonKey = JSON.parse(saKey.data.toString());

    try {
      const db = setupDbConnection(serviceAccountJsonKey);
      await db.listCollections();
      await closeConnection();

      if (req.session) {
        req.session.serviceAccountJsonKey = serviceAccountJsonKey;
      }
      res.redirect('/collections');
    } catch {
      await closeConnection();
      res.status(422);
      res.render('pages/configuration', {
        title: 'Configuration',
        errors: { connection: true },
      });
    }
  };

  /**
   * Returns collection view.
   *
   * @param req
   * @param res
   */
  collectionsView = async (req: Request, res: Response) => {
    if (req.session && req.session.serviceAccountJsonKey) {
      const db = setupDbConnection(req.session.serviceAccountJsonKey);
      const listCollections = await db.listCollections();
      await closeConnection();

      res.status(200);
      res.render('pages/collections', {
        title: 'Collections',
        collections: listCollections.map((collection: CollectionReference) => {
          return collection.path;
        }),
        errors: {
          validationErrors: validationErrorCheck(req),
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

  /**
   * Returns zipped or not CSV files
   *
   * @param req
   * @param res
   */
  collections = async (req: Request, res: Response) => {
    if (req.session && req.session.serviceAccountJsonKey) {
      let collections = [];
      if (typeof req.validated.collections === 'string') {
        collections[0] = req.validated.collections;
      } else {
        collections = req.validated.collections;
      }

      const db = setupDbConnection(req.session.serviceAccountJsonKey);
      await db.listCollections();

      let data: FirestoreCollections = {};
      for (let collection of collections) {
        data = {
          ...data,
          [collection]: await retrieveDocs(db, collection),
        };
      }
      await closeConnection();

      await prepareCsv(data, collections);

      let archive = archiver('zip');

      res.attachment('documents.zip');
      archive.pipe(res);

      res.status(200);
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
