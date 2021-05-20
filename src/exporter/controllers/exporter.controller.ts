import { CollectionsDto } from 'app/exporter/dtos/collections.dto';
import { ConfigurationFileDto } from 'app/exporter/dtos/configuration-file.dto';
import { ValidatedRequest } from 'app/exporter/requests/validated.request';
import * as exporterService from 'app/exporter/services/exporter.service';
import { Request, Response } from 'express';

export const configurationView = (req: Request, res: Response): void => {
  res.status(200);
  res.render('pages/configuration', {
    title: 'Configuration',
    errors: { validationErrors: validationErrorCheck(req) },
  });
};

export const configuration = async (req: ValidatedRequest<ConfigurationFileDto>, res: Response): Promise<void> => {
  const saKey = req.validated.saKey;

  if (saKey) {
    const serviceAccountJsonKey = JSON.parse(saKey.data.toString());

    try {
      exporterService.checkConfiguration(serviceAccountJsonKey);

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
  }
};

export const collectionsView = async (req: Request, res: Response): Promise<void> => {
  if (req.session && req.session.serviceAccountJsonKey) {
    const collectionsList = await exporterService.getCollectionsList(req);
    res.status(200);
    res.render('pages/collections', {
      title: 'Collections',
      collections: collectionsList.map((collection) => {
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

export const collections = async (req: ValidatedRequest<CollectionsDto>, res: Response): Promise<void> => {
  if (req.session && req.session.serviceAccountJsonKey) {
    const collectionsList = await exporterService.getCollectionsData(req);

    // for (const collection of req.validated.collections) {
    // console.log(collection, ': ', data[collection]);
    // }

    console.log(req.validated);

    res.status(200);
    res.render('pages/collections', {
      title: 'Collections',
      collections: 'test',
    });
  } else {
    res.status(400);
    res.render('pages/configuration', {
      title: 'Configuration',
      errors: { session: true },
    });
  }
};

const validationErrorCheck = (req: Request) => {
  if (req.session && req.session.validationErrors) {
    const errors = req.session.validationErrors;
    req.session.validationErrors = [];
    return errors;
  } else {
    return [];
  }
};
