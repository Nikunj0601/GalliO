import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadEager } from './config/configuration';

async function bootstrap() {
  await loadEager();
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(8080);
}
bootstrap();
