import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Key } from './key.entity';
import { random } from 'faker';

@Injectable()
export class KeyService {
  constructor(
    @InjectRepository(Key)
    private readonly keyRepository: Repository<Key>) {}

  async getKey(userId: string): Promise<Key> {
    return await this.keyRepository.findOne({ userId, status: 'active' });
  }

  async createKey(userId: any): Promise<Key> {
    Logger.log(`Creating key for ${JSON.stringify(userId)}`, KeyService.name);
    const key = new Key();
    key.userId = userId;
    key.key = random.alphaNumeric(32);
    key.status = 'active';

    return await this.keyRepository.save(key);
  }

  async removeKey(userId: string): Promise<any> {
    Logger.log(`Removing key for ${JSON.stringify(userId)}.`, KeyService.name);
    const newKey = await this.getKey(userId);
    return await this.keyRepository.save({ ...newKey, status: 'canceled' });
  }
}