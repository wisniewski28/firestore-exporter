import { Router } from 'express';
import exporterRouting from 'app/exporter/exporter.routes';

const router: Router = Router();

exporterRouting(router);

export default router;
