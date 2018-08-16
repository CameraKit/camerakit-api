import { NestFactory, FastifyAdapter } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  app.useStaticAssets({
    prefix: '/',
    root: path.join(__dirname + '/../dist/public'),
  });

  const appModule = app.get(AppModule);
  const apiPath = '/api/graphql';
  appModule.configureGraphQl(app, apiPath);

  await app.listen(3000);
}
bootstrap();