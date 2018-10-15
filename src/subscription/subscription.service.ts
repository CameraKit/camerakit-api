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

  async getSubscriptions(): Promise<Subscription[]> {
    return await this.subscriptionRepository.find();
  }

  async createSubscription(subscription: Subscription): Promise<Subscription> {
    Logger.log(`Creating subscription: ${JSON.stringify(subscription)}`);
    return await this.subscriptionRepository.save(subscription);
  }
}