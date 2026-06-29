import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesController } from './movies/movies.controller';
import { NotificationsController } from './notifications/notifications.controller';
import { RatingsController } from './ratings/ratings.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MOVIES_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.MOVIES_SERVICE_HOST ?? 'localhost',
          port: parseInt(process.env.MOVIES_SERVICE_PORT ?? '3001', 10),
        },
      },
      {
        name: 'RATINGS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.RATINGS_SERVICE_HOST ?? 'localhost',
          port: parseInt(process.env.RATINGS_SERVICE_PORT ?? '3002', 10),
        },
      },
      {
        name: 'NOTIFICATIONS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.NOTIFICATIONS_SERVICE_HOST ?? 'localhost',
          port: parseInt(process.env.NOTIFICATIONS_SERVICE_PORT ?? '3003', 10),
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    MoviesController,
    RatingsController,
    NotificationsController,
  ],
  providers: [AppService],
})
export class AppModule {}
