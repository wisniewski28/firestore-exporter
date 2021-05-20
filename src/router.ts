import exporterRouting from 'app/exporter/routes/exporter.routes';
import { Router } from 'express';

const router: Router = Router();

exporterRouting(router);

export default router;
