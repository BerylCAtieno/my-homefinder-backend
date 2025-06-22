import { Router } from 'express';
import { Routes } from '../interfaces/route.interface';
import { ReviewController } from '../controllers/review.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { ReviewValidationMiddleware } from '../middlewares/review-validation.middleware';
import asyncHandler from 'express-async-handler';
import { RequestWithUser } from '../interfaces/auth.interface';
import { Request } from 'express';

export class ReviewRoute implements Routes {
  public path = '/reviews';
  public router = Router();
  private reviewController = new ReviewController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Create a review for a property
    this.router.post(
      `/property/:propertyId`,
      authMiddleware,
      ReviewValidationMiddleware.validateCreateReview,
      asyncHandler((req: Request, res, next) => 
        this.reviewController.createReview(req as RequestWithUser, res, next)
      )
    );

    // Get all reviews for a property
    this.router.get(
      `/property/:propertyId`,
      asyncHandler(this.reviewController.getPropertyReviews)
    );
  }
}