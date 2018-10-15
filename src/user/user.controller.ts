import { Controller, UseGuards, Post, HttpStatus, HttpCode, Get, Put, Param, Res, Body, Req, Logger, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Users } from '../user/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  async registerUser(@Res() res: any, @Body() body: Users) {
    const result = await this.userService.registerUser(body);
    if (result.error) {
      Logger.error(result.message, undefined, UserController.name);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(JSON.stringify({ error: result.error }));
    }
    Logger.log(result.message, UserController.name);
    return res.status(HttpStatus.CREATED).send(JSON.stringify({ user: result.out }));
  }

  @Get('')
  async getUsers(@Res() res: any) {
    const users = await this.userService.getUsers();
    return res.status(HttpStatus.OK).send(JSON.stringify(users));
  }

  @Get(':email')
  async getUser(@Res() res: any, @Param('email') email) {
    const result = await this.userService.getUserByEmail(email);
    if (result.error) {
      Logger.error(result.message, undefined, UserController.name);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(JSON.stringify({ error: result.error }));
    }
    return res.status(HttpStatus.OK).send(JSON.stringify(result.out));
  }

  @Put('')
  async updateUser(@Req() req, @Res() res: any, @Body() body: Users) {
    const result = await this.userService.update(body);
    if (result.error) {
      Logger.error(result.message, undefined, UserController.name);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(JSON.stringify({ error: result.error }));
    }
    Logger.log(result.message, UserController.name);
    res.status(HttpStatus.OK).send(JSON.stringify({ user: result.out }));
  }

  @Delete('')
  public async removeUser(@Res() res: any, @Body() body: Users) {
    const result = await this.userService.remove(body);
    if (result.error) {
      Logger.error(result.message, undefined, UserController.name);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(JSON.stringify({ error: result.error }));
    }
    Logger.log(result.message, UserController.name);
    res.status(HttpStatus.OK).send(JSON.stringify({ success: true }));
  }
}