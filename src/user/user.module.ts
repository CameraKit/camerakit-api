import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { SubscriptionModule } from '../subscription/subscription.module';
import { UserController } from './user.controller';
import { Users } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), SubscriptionModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})

export class UserModule {}