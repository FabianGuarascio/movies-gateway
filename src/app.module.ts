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
          host: 'localhost',
          port: 3001,
        },
      },
      {
        name: 'RATINGS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'ratings-consumer-gateway',
          },
        },
      },
      {
        name: 'NOTIFICATIONS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'notifications-consumer-gateway',
          },
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
