import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async createToken(id: number, email: string) {
    const user: JwtPayload = { email };
    const expiresIn = 3600;
    const accessToken = jwt.sign(user, 'secretKey', { expiresIn });
    return {
      expiresIn,
      accessToken,
    };
  }

  async validateUser(signedUser): Promise<boolean> {
    if (signedUser && signedUser.email) {
      return Boolean(this.userService.getUserByEmail(signedUser.email));
    }

    return false;
  }
}