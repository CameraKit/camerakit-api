import { Controller, UseGuards, Post, HttpStatus, HttpCode, Get, Param, Res, Body, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @UseGuards(AuthGuard('jwt', { session: false }))
  getUsers(@Res() res: any) {
    return res.status(HttpStatus.OK).send(JSON.stringify([{ users: ['basic'] }]));
  }

  @Post('sponsor')
  @UseGuards(AuthGuard('jwt', { session: false }))
  addSponsorship(@Body() body: any, @Res() res: any) {
    const status = this.userService.addSponsorship(500, 'usd', 'An example charge', body.token);
    return res.status(HttpStatus.OK).send(JSON.stringify({ status }));
  }
}