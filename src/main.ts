import { NestFactory, FastifyAdapter } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import * as cors from 'cors'
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.configure && dotenv.configure();
  const app = await NestFactory.create(AppModule, new FastifyAdapter());

  app.useStaticAssets({
    prefix: '/',
    root: path.join(__dirname + '/../dist/public'),
  });
  
  app.use(cors({
    'origin': process.env.ALLOWED_ORIGINS,
    'methods': process.env.ALLOWED_METHODS,
    'preflightContinue': false,
    'optionsSuccessStatus': 204,
  }));

  const appModule = app.get(AppModule);
  const apiPath = '/api/graphql';
  appModule.configureGraphQl(app, apiPath);      
 
  await app.listen(3001);
}
bootstrap();