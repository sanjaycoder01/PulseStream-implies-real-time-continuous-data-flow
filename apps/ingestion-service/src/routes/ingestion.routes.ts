import { Router } from 'express';
import { IngestionController } from '../controllers/ingestion.controller';

const router: Router = Router();
const controller = new IngestionController();

router.post('/events', controller.handleEvent.bind(controller));

export default router;
