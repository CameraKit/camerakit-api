import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { ConfigService } from '../config/config.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { ProductService } from '../product/product.service';
import * as Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    config: ConfigService,
    private readonly subscription: SubscriptionService,
    private readonly product : ProductService,
  ) {
    this.stripe = new Stripe(config.stripeSecretApiKey);
  }

  async getPayments(): Promise<Payment[]> {
    return await this.paymentRepository.find();
  }

  async addSponsorship(email: string, amount: number, currency: string, description: string, source: any) {
    const customer = await this.stripe.customers.create({
      source,
      description: `Customer for ${description}`,
    });
    Logger.log(`Add sponsorship for ${amount}.`, PaymentService.name);
    const { status } = await this.stripe.subscriptions.create({
      customer: customer.id,
      items:[
        { plan: 'plan_Dmuw5XdiRkUseO' },
      ],
      metadata: { email },
    }).catch(error => Logger.error(error, undefined, PaymentService.name));

    Logger.log(status);
    return status;
  }
  async addSupporter(email: string, amount: number, currency: string, description: string, source: any) {
    Logger.log(`Add supporter for ${amount}.`, PaymentService.name);
    const { status } = await this.stripe.charges.create({
      amount,
      currency,
      description,
      source,
      metadata: { email },
    }).catch(error => Logger.error(error, undefined, PaymentService.name));
    return status;
  }

  async logEvent(body: any) {
    Logger.log(`STRIPE EVENT: ${body.id} - ${body.type}`, PaymentService.name);
    if (body.type === 'charge.succeeded') {
      const charge = body.data.object;
      this.subscription.createSubscription({
        id: charge.id,
        price: charge.amount,
        source: charge.source.id,
        userId: charge.source.name,
        product: 'charge',
        subscriptionId: null,
        endDate: null,
        startDate: null,
        status: null,
      });
    } else if (body.type === 'customer.subscription.created') {
      const subscription = body.items.data[0];
      this.subscription.createSubscription({
        id: subscription.id,
        price: subscription.plan.amount,
        source: body.customer,
        userId: body.metadata.email,
        product: 'subscription',
        subscriptionId: subscription.id,
        endDate: body.ended_at,
        startDate: body.current_period_start,
        status: 'active',
      });
    }
  }
}