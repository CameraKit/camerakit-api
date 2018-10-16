import * as jwt from 'jsonwebtoken';
import { Injectable, Logger } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from '../user/user.service';
import { ConfigService } from '../config/config.service';
import { Users } from '../user/user.entity';
@Injectable()
export class AuthService {
  constructor(private userService: UserService, private config: ConfigService) {}
  async createToken(id: string, email: string) {
    const user: JwtPayload = { email };
    const expiresIn = 3600000;
    const accessToken = jwt.sign(user, this.config.passportAuthSecret, { expiresIn });
    return {
      id,
      expiresIn,
      accessToken,
    };
  }

  async validateUser(signedUser): Promise<Users> {
    if (signedUser && signedUser.email) {
      const user = await this.userService.getUserByEmail(signedUser.email);
      if (!user.error) {
        Logger.log(`User ${signedUser.email} validated.`, AuthService.name);
        return user.out;
      }
      Logger.error(`Unable to authenticate ${signedUser.email}.`, undefined, AuthService.name);
      return null;
    }
    Logger.error(`Signed user does not exist or has no email associated.`, undefined, AuthService.name);
    return null;
  }
}