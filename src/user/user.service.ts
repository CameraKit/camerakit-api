import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import * as bcrypt from 'bcrypt-nodejs';
import * as Stripe from 'stripe';
import { ConfigService } from '../config/config.service';

@Injectable()
export class UserService {
  private saltRounds = 10;
  private stripe;

  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    config: ConfigService,
  ) {
    this.stripe = Stripe(config.stripeSecretApiKey);
  }

  async getUsers(): Promise<Users[]> {
    return await this.userRepository.find();
  }

  async getUserByEmail(email: string): Promise<Users> {
    Logger.log(`Look up user ${email}.`, UserService.name);
    return (await this.userRepository.find({ email }))[0];
  }

  async createUser(user: Users): Promise<Users> {
    Logger.log(`Create user ${user.email}.`, UserService.name);
    user.passwordHash = await this.getHash(user.password);

    // clear password as we don't persist passwords
    user.password = undefined;
    return this.userRepository.save(user);
  }

  async getHash(password: string|undefined): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compareHash(password: string|undefined, hash: string|undefined): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async addSponsorship(amount: number, currency: string, description: string, source: any){
    Logger.log(`Add sponsorship for ${amount}.`, UserService.name);
    const { status } = await this.stripe.charges.create({
      amount,
      currency,
      description,
      source,
    });

    return status;
  }
}