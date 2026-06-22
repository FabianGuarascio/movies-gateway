import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Controller('ratings')
export class RatingsController implements OnModuleInit {
  constructor(
    @Inject('RATINGS_SERVICE') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    [
      'createRating',
      'findAllRatings',
      'findOneRating',
      'updateRating',
      'removeRating',
    ].forEach((pattern) => this.client.subscribeToResponseOf(pattern));
    await this.client.connect();
  }

  @Post()
  create(@Body() createRatingDto: Record<string, unknown>) {
    return this.client.send('createRating', createRatingDto);
  }

  @Get()
  findAll() {
    return this.client.send('findAllRatings', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.client.send('findOneRating', +id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRatingDto: Record<string, unknown>,
  ) {
    return this.client.send('updateRating', { id: +id, ...updateRatingDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.client.send('removeRating', +id);
  }
}
