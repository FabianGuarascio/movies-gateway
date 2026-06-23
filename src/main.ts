import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RpcExceptionFilter } from './filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
