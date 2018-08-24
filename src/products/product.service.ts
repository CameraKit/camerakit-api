import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  private saltRounds = 10;

  constructor(
    @InjectRepository(Product)
    private readonly userRepository: Repository<Product>,
  ) {}

  async getProducts(): Promise<Product[]> {
    return await this.userRepository.find();
  }
}