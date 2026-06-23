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
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
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
            brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
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
