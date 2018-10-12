import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigService } from './config/config.service';

// the config service cannot be passed through on first initialization since it is an import
const configService = new ConfigService('.env');

@Module({
  imports: [TypeOrmModule.forRoot(configService.databaseConfig),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
    }),
    UserModule,
    AuthModule,
    ConfigModule,
    ContactModule],
})

export class AppModule {}