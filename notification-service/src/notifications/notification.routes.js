import { Router } from 'express';
import {
  sendArrival,
  sendDelay,
  sendRouteChange,
  sendCustom,
  getWhatsAppGroups,
  getWhatsAppStatus,
  getWhatsAppQR
} from './notification.controller.js';

import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

// Rutas de estado/QR — no requieren auth (son de infraestructura)
router.get('/whatsapp/status', getWhatsAppStatus);
router.get('/whatsapp/qr', getWhatsAppQR);

// Rutas protegidas
router.post('/arrival', validateJWT, sendArrival);
router.post('/delay', validateJWT, sendDelay);
router.post('/route-change', validateJWT, sendRouteChange);
router.post('/custom', validateJWT, sendCustom);
router.get('/groups', validateJWT, getWhatsAppGroups);

export default router;