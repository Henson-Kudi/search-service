// You can modify this file the way you like but make sure to export the router as default so that it initialised in index.ts
import { Router } from 'express';
import expressAdapter from '../../adapters/expressAdapter';
import { searchController } from '../../http/controllers/search.controller';
import AppError from '../../../domain/value-objects/appError';
import { ResponseCodes } from '../../../domain/enums/responseCode';

const router = Router();

// Define your routes here

router.get('/search', async (req, res, next) => {
  const result = await expressAdapter(req, searchController);

  if (result.error || !result.success) {
    next(
      result.error ??
        new AppError('Unexpected Server error', ResponseCodes.ServerError)
    );
  } else {
    res.status(200).json(result);
    next();
  }
});

export default router;
