import * as jwt from 'jsonwebtoken';
import { Injectable, Logger } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from '../user/user.service';
import { ConfigService } from '../config/config.service';
@Injectable()
export class AuthService {
  constructor(private userService: UserService, private config: ConfigService) {}
  async createToken(id: number, email: string) {
    const user: JwtPayload = { email };
    const expiresIn = 3600000;
    const accessToken = jwt.sign(user, this.config.passportAuthSecret, { expiresIn });
    return {
      expiresIn,
      accessToken,
    };
  }

  async validateUser(signedUser): Promise<boolean> {
    if (signedUser && signedUser.email) {
      const valid = Boolean(this.userService.getUserByEmail(signedUser.email));
      if (valid) {
        Logger.log(`User ${signedUser.email} validated.`, AuthService.name);
        return true;
      }
      Logger.error(`Unable to authenticate ${signedUser.email}.`, undefined, AuthService.name);
      return false;
    }
    Logger.error(`Signed user does not exist or has no email associated.`, undefined, AuthService.name);
    return false;
  }
}