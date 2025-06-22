import { ReviewService } from '../../../services/review.service';
import HTTPException from '../../../exceptions/http.exception';
import { StatusCodes } from 'http-status-codes';
import { CreateReviewInput, ReviewFilter } from '../../../interfaces/review.interface';
import { StarRating } from '../../../generated/prisma';

// Mock prisma
jest.mock('../../../prisma/prisma', () => ({
  prisma: {
    property: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    review: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

import { prisma } from '../../../prisma/prisma';

describe('ReviewService', () => {
  let reviewService: ReviewService;

  const mockReviewId = 'review-id-123';
  const mockPropertyId = 'property-id-456';
  const mockReviewerId = 'reviewer-id-789';

  const mockProperty = {
    id: mockPropertyId,
    title: 'Test Property',
    address: '123 Test St',
    averageRating: 3.5,
  };

  const mockReviewInput: CreateReviewInput = {
    propertyId: mockPropertyId,
    reviewerId: mockReviewerId,
    rating: StarRating.FOUR,
    comment: 'Great place!',
  };

  const mockCreatedReview = {
    id: mockReviewId,
    ...mockReviewInput,
    createdAt: new Date(),
    updatedAt: new Date(),
    reviewer: {
      id: mockReviewerId,
      fullName: 'John Reviewer',
      email: 'john@example.com',
    },
    property: {
      id: mockPropertyId,
      title: mockProperty.title,
      address: mockProperty.address,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    reviewService = new ReviewService();
    
    (prisma.property.findUnique as jest.Mock).mockResolvedValue(mockProperty);
    (prisma.review.create as jest.Mock).mockResolvedValue(mockCreatedReview);
    (prisma.review.findMany as jest.Mock).mockResolvedValue([mockCreatedReview]);
    (prisma.review.count as jest.Mock).mockResolvedValue(1);
    (prisma.property.update as jest.Mock).mockResolvedValue(mockProperty);
    (prisma.$transaction as jest.Mock).mockImplementation((calls) => Promise.all(calls));
  });

  describe('createReview', () => {
    it('should create a review and update property average rating', async () => {
      const result = await reviewService.createReview(mockReviewInput);

      expect(prisma.property.findUnique).toHaveBeenCalledWith({
        where: { id: mockReviewInput.propertyId },
      });
      expect(prisma.review.create).toHaveBeenCalledWith({
        data: mockReviewInput,
        include: expect.any(Object),
      });
      expect(prisma.property.update).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedReview);
    });

    it('should throw if property not found', async () => {
      (prisma.property.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(reviewService.createReview(mockReviewInput))
        .rejects
        .toThrow(new HTTPException(StatusCodes.NOT_FOUND, 'Property not found'));
    });

    it('should handle review creation error', async () => {
      (prisma.review.create as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await expect(reviewService.createReview(mockReviewInput))
        .rejects
        .toThrow(new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create review'));
    });
  });

  describe('getReviews', () => {
    const paginationParams = { page: 1, limit: 10 };

    it('should return paginated reviews', async () => {
      const mockReviews = [mockCreatedReview];
      (prisma.$transaction as jest.Mock).mockResolvedValue([mockReviews, 1]);

      const result = await reviewService.getReviews({}, paginationParams);

      expect(result).toEqual({
        data: mockReviews,
        metadata: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      });
    });

    it('should handle empty results', async () => {
      (prisma.$transaction as jest.Mock).mockResolvedValue([[], 0]);

      const result = await reviewService.getReviews({}, paginationParams);

      expect(result).toEqual({
        data: [],
        metadata: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        }
      });
    });

    it('should handle fetch error', async () => {
      (prisma.$transaction as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await expect(reviewService.getReviews({}, paginationParams))
        .rejects
        .toThrow(new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to fetch reviews'));
    });
  });

  describe('updatePropertyAverageRating', () => {
    it('should calculate and update average rating', async () => {
      const mockReviews = [
        { rating: 4 }, 
        { rating: 5 } 
      ];
      
      (prisma.review.findMany as jest.Mock).mockResolvedValue(mockReviews);

      await (reviewService as any).updatePropertyAverageRating(mockPropertyId);


      expect(prisma.property.update).toHaveBeenCalledWith({
        where: { id: mockPropertyId },
        data: { averageRating: 4.5 }

      });
    });

    it('should handle no reviews', async () => {
      (prisma.review.findMany as jest.Mock).mockResolvedValue([]);

      await (reviewService as any).updatePropertyAverageRating(mockPropertyId);

      expect(prisma.property.update).toHaveBeenCalledWith({
        where: { id: mockPropertyId },
        data: { averageRating: 0 }
      });
    });
  });
});