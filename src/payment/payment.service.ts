import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import * as bcrypt from 'bcrypt-nodejs';

@Injectable()
export class PaymentService {
  private saltRounds = 10;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getPayments(): Promise<Payment[]> {
    return await this.paymentRepository.find();
  }

  async getPaymentByEmail(email: string): Promise<Payment> {
    return (await this.paymentRepository.find({ email }))[0];
  }

  async createPayment(payment: Payment): Promise<Payment> {
    payment.passwordHash = await this.getHash(payment.password);

    // clear password as we don't persist passwords
    payment.password = undefined;
    return this.paymentRepository.save(payment);
  }

  async getHash(password: string|undefined): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compareHash(password: string|undefined, hash: string|undefined): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}