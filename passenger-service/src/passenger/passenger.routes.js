import { Router } from 'express';

import {
  createPassenger,
  getPassengers,
  getMyPassenger,
  updatePassengerStatus,
  deletePassenger
} from './passenger.controller.js';

import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

router.post(
  '/',
  validateJWT,
  createPassenger
);

router.get(
  '/',
  validateJWT,
  getPassengers
);

router.get(
  '/me',
  validateJWT,
  getMyPassenger
);

router.patch(
  '/:id/status',
  validateJWT,
  updatePassengerStatus
);

router.delete(
  '/:id',
  validateJWT,
  deletePassenger
);

export default router;