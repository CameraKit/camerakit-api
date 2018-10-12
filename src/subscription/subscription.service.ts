import { Injectable, Inject } from '@nestjs/common';
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
    return this.subscriptionRepository.save(subscription);
  }
}