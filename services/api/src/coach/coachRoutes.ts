import { Router } from 'express';
import { handleCoachRequest } from './coachController';
import { validateCoachRequest } from '../middleware/validateCoachRequest';

export const coachRouter = Router();

coachRouter.post('/coach', validateCoachRequest, handleCoachRequest);
