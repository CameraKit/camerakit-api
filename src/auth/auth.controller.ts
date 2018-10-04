import { Controller, Post, HttpStatus, Res, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Users } from '../user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService) {}

  @Post('login')
  async loginUser(@Res() res: any, @Body() body: Users) {
    if (!(body && body.email && body.password)) {
      return res.status(HttpStatus.FORBIDDEN).send(JSON.stringify({ message: 'Email and password are required!' }));
    }

    const user = await this.userService.getUserByEmail(body.email);

    if (user) {
      if (await this.userService.compareHash(body.password, user.passwordHash)) {
        return res.status(HttpStatus.OK).send(JSON.stringify(await this.authService.createToken(user.id, user.email)));
      }
    }

    return res.status(HttpStatus.FORBIDDEN).send(JSON.stringify({ message: 'Email or password wrong!' }));
  }

  @Post('register')
  async registerUser(@Res() res: any, @Body() body: Users) {
    if (!(body && body.email && body.password)) {
      return res.status(HttpStatus.FORBIDDEN).send(JSON.stringify({ message: 'Email and password are required!' }));
    }

    let user = await this.userService.getUserByEmail(body.email);

    if (user) {
      return res.status(HttpStatus.FORBIDDEN).send(JSON.stringify({ message: 'Email exists' }));
    }
    user = await this.userService.createUser(body);
    if (user) {
      user.passwordHash = undefined;
    }
    return res.status(HttpStatus.OK).send(JSON.stringify(user));
  }
}