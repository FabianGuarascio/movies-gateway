import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

interface Rating {
  id: number;
  movieId: number;
  score: number;
}

@Controller('ratings')
export class RatingsController {
  constructor(
    @Inject('RATINGS_SERVICE') private readonly ratingsClient: ClientProxy,
    @Inject('MOVIES_SERVICE') private readonly moviesClient: ClientProxy,
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createRatingDto: Record<string, unknown>) {
    const rating = await firstValueFrom(
      this.ratingsClient.send<Rating>('createRating', createRatingDto),
    );
    await firstValueFrom(
      this.moviesClient.send('movies.updateAverageRating', {
        movieId: rating.movieId,
        score: rating.score,
      }),
    );
    await firstValueFrom(
      this.notificationsClient.send('createNotification', {
        type: 'push',
        recipient: 'all',
        message: `New rating ${rating.score} added for movie #${rating.movieId}`,
      }),
    );
    return rating;
  }

  @Get()
  findAll() {
    return this.ratingsClient.send('findAllRatings', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ratingsClient.send('findOneRating', +id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRatingDto: Record<string, unknown>,
  ) {
    return this.ratingsClient.send('updateRating', {
      id: +id,
      ...updateRatingDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ratingsClient.send('removeRating', +id);
  }
}
