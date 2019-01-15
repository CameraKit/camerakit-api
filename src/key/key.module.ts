import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyController } from './key.controller';
import { KeyService } from './key.service';
import { Key } from './key.entity';
import { SubscriptionModule } from '../subscription/subscription.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Key])],
  providers: [KeyService],
  exports: [KeyService],
  controllers: [KeyController],
})

export class KeyModule {}