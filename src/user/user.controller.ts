import { Controller, UseGuards, Post, HttpStatus, HttpCode, Get, Put, Param, Res, Body, Req, Logger, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { AuthGuard } from '@nestjs/passport';
import { Users } from '../user/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService,
              private readonly subscriptionService: SubscriptionService) {}

  @Post('') // Add new user
  async registerUser(@Res() res: any, @Body() body: Users) {
    const result = await this.userService.registerUser(body);
    if (result.error) {
      Logger.error(result.message, undefined, UserController.name);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(JSON.stringify({ error: result.error }));
    }
    Logger.log(result.message, UserController.name);
    return res.status(HttpStatus.CREATED).send(JSON.stringify({ user: result.out }));
  }

  @Get('') // Get requesting user
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Req() req: any, @Res() res: any) {
    const result = await this.userService.getUserById(req.user.id);
    if (result.error) {
      Logger.error(result.message, undefined, UserController.name);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(JSON.stringify({ error: result.error }));
    }
    return res.status(HttpStatus.OK).send(JSON.stringify(result.out));
  }

  @Get('subscriptions') // Get requesting user
  @UseGuards(AuthGuard('jwt'))
  async getUserSubscriptions(@Req() req: any, @Res() res: any) {
    const subscriptions = await this.subscriptionService.getActiveSubscriptions(req.user.id);
    if (subscriptions.length === 0) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(JSON.stringify({ error: 'No subscriptions found.' }));
    }
    return res.status(HttpStatus.OK).send(JSON.stringify(subscriptions));
  }

  @Put('') // Update requesting user
  @UseGuards(AuthGuard('jwt'))
  async updateUser(@Req() req, @Res() res: any, @Body() body: Users) {
    body.id = req.user.id;
    const result = await this.userService.update(body);
    if (result.error) {
      Logger.error(result.message, undefined, UserController.name);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(JSON.stringify({ error: result.error }));
    }
    Logger.log(result.message, UserController.name);
    res.status(HttpStatus.OK).send(JSON.stringify({ user: result.out }));
  }

  @Delete('') // Delete requesting user
  @UseGuards(AuthGuard('jwt'))
  public async removeUser(@Req() req, @Res() res: any, @Body() body: Users) {
    body.id = req.user.id;
    const result = await this.userService.remove(body);
    if (result.error) {
      Logger.error(result.message, undefined, UserController.name);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(JSON.stringify({ error: result.error }));
    }
    Logger.log(result.message, UserController.name);
    res.status(HttpStatus.OK).send(JSON.stringify({ success: true }));
  }
}