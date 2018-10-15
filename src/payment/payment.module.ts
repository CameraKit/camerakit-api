import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Payment } from './payment.entity';
import { SubscriptionModule } from 'subscription/subscription.module';
import { ProductModule } from 'product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), SubscriptionModule, ProductModule],
  providers: [PaymentService],
  exports: [PaymentService],
  controllers: [PaymentController],
})

export class PaymentModule {}