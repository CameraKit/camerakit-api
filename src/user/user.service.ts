import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import * as bcrypt from 'bcrypt';
import dto from '../interfaces/dto';

@Injectable()
export class UserService {
  private saltRounds = 10;

  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async getUsers(): Promise<Users[]> {
    return await this.userRepository.find();
  }

  async registerUser(user: Users): Promise<dto<Users>> {
    if (user.email == null || user.password == null) {
      return { error: `Email and password are required!`, message: `Incomplete registration request.` };
    }

    const result = await this.getUserByEmail(user.email);
    if (result.out) {
      return { error: `Another user is registered with that email address.`, message: `User tried to register with duplicate email ${user.email}.` };
    }

    const newUser = await this.createUser(user);
    if (newUser) {
      newUser.passwordHash = undefined;
    }

    return { out: newUser, message: `New user registered as ${newUser.email}.` };
  }

  async getUserByEmail(email: string): Promise<dto<Users>> {
    const user = await this.userRepository.findOne({ email });
    if (user == null) {
      return { error: `Could not find a user with that email address.`, message: `User with ${email} not found.` };
    }
    return { out: user, message: `Found user with email ${email}.` };
  }

  async getUserById(id: string): Promise<dto<Users>> {
    const user = await this.userRepository.findOne({ id });
    if (user == null) {
      return { error: `Could not find a user with that id.`, message: `User with ${id} not found.` };
    }
    user.passwordHash = null;
    return { out: user, message: `Found user with id ${id}.` };
  }

  async update(newUser: Users): Promise<dto<Users>> {
    if (newUser.id == null) {
      return { error: `There was a problem updating user settings.`, message: `No user found with id ${newUser.id}.` };
    }

    const result = await this.getUserById(newUser.id);
    if (result.error) {
      return result;
    }

    const user = result.out;
    user.companyDescription = newUser.companyDescription;
    user.companyName = newUser.companyName;
    user.email = newUser.email;
    user.emailConfirmed = newUser.emailConfirmed;
    user.firstName = newUser.firstName;
    user.lastName = newUser.lastName;

    const updatedUser = await this.userRepository.save(user);
    return { out: updatedUser, message: `Updated user with email ${updatedUser.email}.` };
  }

  async remove(user: Users): Promise<dto<Users>> {
    if (user.id == null) {
      return { error: `There was a problem updating user settings.`, message: `No user found with id ${user.id}.` };
    }

    const result = await this.userRepository.remove(user);
    return { out: result, message: `Removed user with email ${user.email}.` };
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
}