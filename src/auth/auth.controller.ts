import { Controller, Post, HttpStatus, Res, Body, Logger } from '@nestjs/common';
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
      Logger.error(`Incomplete login request.`, undefined, AuthController.name);
      return res.status(HttpStatus.FORBIDDEN).send(JSON.stringify({ message: 'Email and password are required!' }));
    }

    const result = await this.userService.getUserByEmail(body.email);
    const user = result.out;

    if (user) {
      if (await this.userService.compareHash(body.password, user.passwordHash)) {
        Logger.log(`New login from ${body.email}.`, AuthController.name);
        return res.status(HttpStatus.OK).send(JSON.stringify(await this.authService.createToken(user.id, user.email)));
      }
    }

    Logger.error(`Wrong password from ${body.email}.`, undefined, AuthController.name);
    return res.status(HttpStatus.FORBIDDEN).send(JSON.stringify({ message: 'Email or password wrong!' }));
  }
}