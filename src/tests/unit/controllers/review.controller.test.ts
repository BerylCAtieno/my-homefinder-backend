import { ReviewController } from '../../../controllers/review.controller';
import { ReviewService } from '../../../services/review.service';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { StarRating } from '../../../generated/prisma';
import { RequestWithUser } from '../../../interfaces/auth.interface';

// Mock ReviewService
jest.mock('../../../services/review.service');

describe('ReviewController', () => {
  let reviewController: ReviewController;
  let mockReq: Partial<RequestWithUser>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Initialize controller
    reviewController = new ReviewController();

    // Mock response
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock next function
    mockNext = jest.fn();
  });

  describe('createReview', () => {
    const mockUser = {
      id: 'user123',
      fullName: 'Test User'
    };

    const mockReviewData = {
      rating: StarRating.FOUR,
      comment: 'Great property!'
    };

    beforeEach(() => {
      mockReq = {
        user: mockUser,
        params: { propertyId: 'prop123' },
        body: mockReviewData
      };
    });

    it('should create a review successfully', async () => {
      const expectedReview = {
        id: 'review123',
        reviewerId: mockUser.id,
        propertyId: 'prop123',
        ...mockReviewData
      };

      (ReviewService.prototype.createReview as jest.Mock).mockResolvedValueOnce(expectedReview);

      await reviewController.createReview(
        mockReq as any,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Review created successfully',
        data: expectedReview
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle errors and pass to next middleware', async () => {
      const error = new Error('Test error');
      (ReviewService.prototype.createReview as jest.Mock).mockRejectedValueOnce(error);

      await reviewController.createReview(
        mockReq as any,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });

  describe('getPropertyReviews', () => {
    beforeEach(() => {
      mockReq = {
        params: { propertyId: 'prop123' },
        query: {}
      };
    });

    it('should return paginated reviews with default pagination', async () => {
      const mockReviews = {
        data: [{ id: 'review123' }],
        metadata: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      };

      (ReviewService.prototype.getReviews as jest.Mock).mockResolvedValueOnce(mockReviews);

      await reviewController.getPropertyReviews(
        mockReq as any,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Reviews fetched successfully',
        ...mockReviews
      });
    });

    it('should use provided pagination parameters', async () => {
      mockReq.query = { page: '2', limit: '20' };
      
      const mockReviews = {
        data: [],
        metadata: {
          total: 0,
          page: 2,
          limit: 20,
          totalPages: 0
        }
      };

      (ReviewService.prototype.getReviews as jest.Mock).mockResolvedValueOnce(mockReviews);

      await reviewController.getPropertyReviews(
        mockReq as any,
        mockRes as Response,
        mockNext
      );

      expect(ReviewService.prototype.getReviews).toHaveBeenCalledWith(
        { propertyId: 'prop123' },
        { page: 2, limit: 20 }
      );
    });

    it('should handle errors and pass to next middleware', async () => {
      const error = new Error('Test error');
      (ReviewService.prototype.getReviews as jest.Mock).mockRejectedValueOnce(error);

      await reviewController.getPropertyReviews(
        mockReq as any,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });
});