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

interface Movie {
  id: number;
  title: string;
}

@Controller('movies')
export class MoviesController {
  constructor(
    @Inject('MOVIES_SERVICE') private readonly moviesClient: ClientProxy,
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createMovieDto: Record<string, unknown>) {
    const movie = await firstValueFrom(
      this.moviesClient.send<Movie>('movies.create', createMovieDto),
    );
    await firstValueFrom(
      this.notificationsClient.send('createNotification', {
        type: 'push',
        recipient: 'all',
        message: `New movie added: ${movie.title}`,
      }),
    );
    return movie;
  }

  @Get()
  findAll() {
    return this.moviesClient.send('movies.findAll', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesClient.send('movies.findOne', +id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMovieDto: Record<string, unknown>,
  ) {
    return this.moviesClient.send('movies.update', {
      id: +id,
      updateMovieDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesClient.send('movies.remove', +id);
  }
}
