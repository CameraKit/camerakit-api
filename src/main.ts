import { NestFactory, FastifyAdapter } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  app.useStaticAssets({
    prefix: '/',
    root: path.join(__dirname + "/../dist/public")
  });
  await app.listen(3000);
}
bootstrap();