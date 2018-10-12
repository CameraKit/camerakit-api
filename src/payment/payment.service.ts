import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { ConfigService } from '../config/config.service';
import * as Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    config: ConfigService,
  ) {
    this.stripe = new Stripe(config.stripeSecretApiKey);
  }

  async getPayments(): Promise<Payment[]> {
    return await this.paymentRepository.find();
  }

  async addSponsorship(amount: number, currency: string, description: string, source: any) {
    Logger.log(`Add sponsorship for ${amount}.`, PaymentService.name);
    const { status } = await this.stripe.charges.create({
      amount,
      currency,
      description,
      source,
    });

    return status;
  }
  async addSupporter(amount: number, currency: string, description: string, source: any) {
    Logger.log(`Add supporter for ${amount}.`, PaymentService.name);
    const { status } = await this.stripe.charges.create({
      amount,
      currency,
      description,
      source,
    });

    return status;
  }
}