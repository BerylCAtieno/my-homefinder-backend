import { prisma } from '../prisma/prisma';
import { Review } from '../generated/prisma';
import { CreateReviewInput, ReviewFilter, PaginatedResponse, PaginationParams} from '../interfaces/review.interface';
import HTTPException from '../exceptions/http.exception';
import { StatusCodes } from 'http-status-codes';

export class ReviewService {
  async createReview(data: CreateReviewInput) {
    // Validate property exists
    const property = await prisma.property.findUnique({
      where: { id: data.propertyId }
    });

    if (!property) {
      throw new HTTPException(StatusCodes.NOT_FOUND, 'Property not found');
    }

    try {
      const review = await prisma.review.create({
        data,
        include: {
          reviewer: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          },
          property: {
            select: {
              id: true,
              title: true,
              address: true
            }
          }
        },
      });

      // Update property's average rating
      await this.updatePropertyAverageRating(data.propertyId);

      return review;
    } catch (error) {
      throw new HTTPException(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to create review'
      );
    }
  }

  async getReviews(
    filter: ReviewFilter,
    { page = 1, limit = 10 }: PaginationParams
  ): Promise<PaginatedResponse<Review>> {
    try {
      const skip = (page - 1) * limit;

      const [reviews, total] = await prisma.$transaction([
        prisma.review.findMany({
          where: filter,
          include: {
            reviewer: {
              select: {
                id: true,
                fullName: true
              }
            },
            property: {
              select: {
                id: true,
                title: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        prisma.review.count({ where: filter })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: reviews,
        metadata: {
          total,
          page,
          limit,
          totalPages
        }
      };
    } catch (error) {
      throw new HTTPException(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to fetch reviews'
      );
    }
  }

 private async updatePropertyAverageRating(propertyId: string) {
  const reviews = await prisma.review.findMany({
    where: { propertyId }
  });

  const average = reviews.length > 0
    ? reviews.reduce((acc, review) => {
        return acc + Number(review.rating);
      }, 0) / reviews.length
    : 0;

  await prisma.property.update({
    where: { id: propertyId },
    data: { averageRating: average }
  });
}
}