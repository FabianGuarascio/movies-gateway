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

@Controller('notifications')
export class NotificationsController implements OnModuleInit {
  constructor(
    @Inject('NOTIFICATIONS_SERVICE') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    [
      'createNotification',
      'findAllNotifications',
      'findOneNotification',
      'updateNotification',
      'removeNotification',
    ].forEach((pattern) => this.client.subscribeToResponseOf(pattern));
    await this.client.connect();
  }

  @Post()
  create(@Body() createNotificationDto: Record<string, unknown>) {
    return this.client.send('createNotification', createNotificationDto);
  }

  @Get()
  findAll() {
    return this.client.send('findAllNotifications', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.client.send('findOneNotification', +id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: Record<string, unknown>,
  ) {
    return this.client.send('updateNotification', {
      id: +id,
      dto: updateNotificationDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.client.send('removeNotification', +id);
  }
}
