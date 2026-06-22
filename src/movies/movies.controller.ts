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

@Controller('movies')
export class MoviesController {
  constructor(@Inject('MOVIES_SERVICE') private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createMovieDto: Record<string, unknown>) {
    return this.client.send('movies.create', createMovieDto);
  }

  @Get()
  findAll() {
    return this.client.send('movies.findAll', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.client.send('movies.findOne', +id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMovieDto: Record<string, unknown>,
  ) {
    return this.client.send('movies.update', { id: +id, updateMovieDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.client.send('movies.remove', +id);
  }
}
