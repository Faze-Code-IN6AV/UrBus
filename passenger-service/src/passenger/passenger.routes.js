import { Router } from 'express';

import {
  createPassenger,
  getPassengers,
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