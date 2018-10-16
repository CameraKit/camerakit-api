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

  async addSubscription(id: string, userEmail: string, email: string, plan: string, description: string, source: any) {
    const customer = await this.stripe.customers.create({
      source,
      description: `Customer for ${userEmail}`,
    });
    Logger.log(`${userEmail} added subscription for ${plan}.`, PaymentService.name);
    const response = await this.stripe.subscriptions.create({
      customer: customer.id,
      items:[
        { plan },
      ],
      metadata: { id, email },
    }).catch(error => Logger.error(error, undefined, PaymentService.name));
    if (response.status === 'active') {
      const subscription = response.items.data[0];
      this.subscription.createSubscription({
        price: subscription.plan.amount,
        source: response.customer,
        userId: response.metadata.id,
        product: 'subscription',
        subscriptionId: response.id,
        endDate: response.current_period_end,
        startDate: response.current_period_start,
        status: 'active',
      });
    }
    return response.status;
  }
  async addSupporter(id: string, userEmail: string, email: string, amount: number, currency: string, description: string, source: any) {
    Logger.log(`${userEmail} tried to support for ${amount}.`, PaymentService.name);
    const response = await this.stripe.charges.create({
      amount,
      currency,
      description,
      source,
      metadata: { id, email },
    }).catch(error => Logger.error(error, undefined, PaymentService.name));
    Logger.log(response, PaymentService.name);
    if (response.status === 'succeeded') {
      const { id, amount, metadata, source } = response;
      Logger.log(`${userEmail} supported for ${amount}.`, PaymentService.name);
      this.subscription.createSubscription({
        price: amount,
        source: source.id,
        userId: metadata.id,
        product: 'charge',
        subscriptionId: null,
        endDate: null,
        startDate: null,
        status: null,
      });
    }
    return response.status;
  }

  async removeSubscription(id: string, email: string) {
    Logger.log(`Removing subscription for user ${email}.`, PaymentService.name);
    const subscriptions = await this.subscription.getActiveSubscriptions(id);
    if (subscriptions.length === 0) {
      Logger.log(`No subscriptions found for user ${email}.`, PaymentService.name);
      return false;
    }
    const subscriptionId = subscriptions[0].subscriptionId;
    const response = await this.stripe.subscriptions.del(subscriptionId);
    if (response.status === 'canceled') {
      Logger.log(`Subscription canceled for user ${email}.`, PaymentService.name);
      this.subscription.removeSubscription(subscriptions[0]);
      return true;
    }
    Logger.error(`Unable to cancel subscription for user ${email}.`, undefined, PaymentService.name);
    return false;
  }

  async logEvent(body: any) {
    Logger.log(`STRIPE EVENT: ${body.id} - ${body.type}`, PaymentService.name);
  }
}