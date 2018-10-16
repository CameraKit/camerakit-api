import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async getActiveSubscriptions(userId: string): Promise<Subscription[]> {
    return await this.subscriptionRepository.find({ userId, status: 'active' });
  }

  async createSubscription(subscription: any): Promise<Subscription> {
    Logger.log(`Creating subscription: ${JSON.stringify(subscription)}`, SubscriptionService.name);
    return await this.subscriptionRepository.save(subscription);
  }

  async removeSubscription(subscription: any): Promise<any> {
    Logger.log(`Removing subscription ${JSON.stringify(subscription)}.`, SubscriptionService.name);
    return await this.subscriptionRepository.save({ ...subscription, status: 'canceled' });
  }
}