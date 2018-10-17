import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

import * as path from 'path';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as express from 'express';
import * as enforce from 'express-sslify';

async function bootstrap() {
  const env = process.env.NODE_ENV || 'development';
  const expressApp = express();

  const nestApp = await NestFactory.create(AppModule, expressApp);
  const config: ConfigService = nestApp.get(ConfigService);

  // Ensure all requests are https
  if (env === 'production') {
    // DO NOTE the trustProtoHeader should only be true for Heroku deployments
    expressApp.use(enforce.HTTPS({ trustProtoHeader: config.reverseProxy }));
  }
  expressApp.use(express.static(path.join(`${__dirname}/../dist/public`)));

  // Use Helmet
  nestApp.use(helmet());

  // Only allow pre-defined origins
  const corsOptions : cors.CorsOptions = {
    origin: config.allowedOrigins,
    methods: config.allowedMethods,
    preflightContinue: Boolean(false),
    optionsSuccessStatus: 204,
  };
  nestApp.use(cors(corsOptions));

  // Port for deployment will be set as an env variable
  const port = parseInt(process.env.PORT, 10) || config.serverPort;
  // Heroku deployment requires '0.0.0.0' as host to be specified
  const host = config.serverHost;

  await nestApp.init();
  expressApp.listen(port, host);
  Logger.log(`Started listening on ${host} through port ${port}`, 'ExpressApplication');
}
bootstrap();