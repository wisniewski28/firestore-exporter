import { Router } from 'express';
import validate from 'app/core/validator';

import ExporterController from 'app/exporter/exporter.controller';

const modelRouting = (router: Router) => {
  const controller = ExporterController;

  router.get('/', controller.homeScreenView);

  router.get('/configuration', controller.configurationView);
  router.post(
    '/configuration',
    validate(controller.configurationRules),
    controller.configuration
  );

  router.get('/collections', controller.collectionsView);
  router.post(
    '/collections',
    validate(controller.collectionsRules),
    controller.collections
  );
};

export default modelRouting;
