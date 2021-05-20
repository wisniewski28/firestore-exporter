import * as exporterController from 'app/exporter/controllers/exporter.controller';
import { CollectionsDto } from 'app/exporter/dtos/collections.dto';
import { ConfigurationFileDto } from 'app/exporter/dtos/configuration-file.dto';
import { validator } from 'app/middlewares/validator.middleware';
import { Router } from 'express';

const modelRouting = (router: Router): void => {
  router.get('/configuration', exporterController.configurationView);
  router.post('/configuration', validator(ConfigurationFileDto), exporterController.configuration);

  router.get('/collections', exporterController.collectionsView);
  router.post('/collections', validator(CollectionsDto), exporterController.collections);
};

export default modelRouting;
