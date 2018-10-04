import { Logger } from '@nestjs/common';
import { NestFactory, FastifyAdapter } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

import * as path from 'path';
import * as cors from 'cors';

async function bootstrap() {
  // Create the main app from the base AppModule and use fastify for static assets
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  const config: ConfigService = app.get(ConfigService);

  app.useStaticAssets({
    prefix: '/',
    root: path.join(__dirname + '/../dist/public'),
  });
  
  // Only allow pre-defined origins
  app.use(cors({
    'origin': config.allowedOrigins,
    'methods': config.allowedMethods,
    'preflightContinue': false,
    'optionsSuccessStatus': 204,
  }));

  const appModule = app.get(AppModule);
  const apiPath = '/api/graphql';
  appModule.configureGraphQl(app, apiPath);

  // Port for deployment will be set as an env variable
  const port = parseInt(process.env.PORT) || config.serverPort;
  await app.listen(port);
  Logger.log(`Started listening on port ${port}`);
}
bootstrap();