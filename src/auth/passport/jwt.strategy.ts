import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import * as passport from 'passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        passReqToCallback: true,
        secretOrKey: 'secretKey',
      },
      async (req, payload, next) => await this.verify(req, payload, next),
    );
    passport.use(this);

  }

  public async verify(req, payload, done) {
    const isValid = await this.authService.validateUser(payload);
    if (!isValid) {
      return done('Unauthorized', false);
    }
    done(null, payload);
  }
}