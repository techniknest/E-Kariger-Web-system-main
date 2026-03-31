import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @UseGuards(AuthGuard)
    @Post()
    createReview(@Request() req, @Body() createReviewDto: CreateReviewDto) {
        return this.reviewsService.createReview(req.user.sub, createReviewDto);
    }

    @Get('vendor/:vendorId')
    getVendorReviews(@Param('vendorId') vendorId: string) {
        return this.reviewsService.getVendorReviews(vendorId);
    }

    @UseGuards(AuthGuard)
    @Get('my-rating')
    getMyRating(@Request() req) {
        return this.reviewsService.getVendorRatingByUserId(req.user.sub);
    }
}
