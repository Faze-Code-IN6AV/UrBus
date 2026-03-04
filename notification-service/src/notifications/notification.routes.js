import { Router } from 'express';
import {
  sendArrival,
  sendDelay,
  sendRouteChange,
  sendCustom
} from './notification.controller.js';

import { validateJWT } from '../../middlewares/validate-JWT.js';
import { getWhatsAppGroups } from './notification.controller.js';

const router = Router();

router.post('/arrival', validateJWT, sendArrival);
router.post('/delay', validateJWT, sendDelay);
router.post('/route-change', validateJWT, sendRouteChange);
router.post('/custom', validateJWT, sendCustom);
router.get('/groups', validateJWT, getWhatsAppGroups);

export default router;