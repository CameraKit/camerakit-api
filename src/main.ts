import { NestFactory, FastifyAdapter } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

import * as path from 'path';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  const config: ConfigService = app.get(ConfigService);

  app.useStaticAssets({
    prefix: '/',
    root: path.join(__dirname + '/../dist/public'),
  });
  
  app.use(cors({
    'origin': config.allowedOrigins,
    'methods': config.allowedMethods,
    'preflightContinue': false,
    'optionsSuccessStatus': 204,
  }));

  const appModule = app.get(AppModule);
  const apiPath = '/api/graphql';
  appModule.configureGraphQl(app, apiPath);      
 
  await app.listen(config.serverPort);
}
bootstrap();