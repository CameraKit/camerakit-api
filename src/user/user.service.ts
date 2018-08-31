import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as Stripe from 'stripe';


@Injectable()
export class UserService {
  private stripe = Stripe(process.env.STRIPE_SECRET_API_KEY);
  private saltRounds = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUserByEmail(email: string): Promise<User> {
    return (await this.userRepository.find({ email }))[0];
  }

  async createUser(user: User): Promise<User> {
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
    let { status } = await this.stripe.charges.create({
      amount,
      currency,
      description,
      source
    });
    
    return status;
  }
}