import { Controller, UseGuards, Post, HttpStatus, Get, Put, Param, Res, Body, Req, Logger, Delete } from '@nestjs/common';
import { KeyService } from './key.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('key')
export class KeyController {
  constructor(private readonly keyService: KeyService) {}

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  async getKey(@Body() body: any, @Req() req: any, @Res() res: any) {
    const key = await this.keyService.getKey(req.user.id);
    Logger.log(`Get key for ${req.user.id}: ${key}`, KeyController.name);
    return res.status(HttpStatus.OK).send(JSON.stringify({ key }));
  }

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async createKey(@Body() body: any, @Req() req: any, @Res() res: any) {
    const userId = req.user.id;
    if (await this.keyService.getKey(userId))
      await this.keyService.removeKey(userId);
    const key = await this.keyService.createKey(userId);
    Logger.log(`Created new key for ${userId}: ${JSON.stringify(key)}`, KeyController.name);
    return res.status(HttpStatus.OK).send(JSON.stringify({ key }));
  }

  @Post('check')
  @UseGuards(AuthGuard('jwt'))
  async checkKey(@Req() req: any, @Body() body: any, @Res() res: any) {
    Logger.log(`Check key for ${req.user.id}`, KeyController.name);
    if (req.user.id == null) {
      Logger.error(`Error checking key.`, undefined, KeyController.name);
      return res.status(HttpStatus.OK).send(JSON.stringify({ error: 'User not found.' }));
    }
    const key = await this.keyService.getKey(req.user.id);
    if (key && key.key === body.key) {
      return res.status(HttpStatus.OK).send(JSON.stringify({ valid: true }));
    }
    return res.status(HttpStatus.OK).send(JSON.stringify({ valid: false }));
  }

  @Delete('')
  @UseGuards(AuthGuard('jwt'))
  async revokeKey(@Req() req: any, @Body() body: any, @Res() res: any) {
    if (req.user.id == null) {
      Logger.error(`Error removing key.`, undefined, KeyController.name);
      return res.status(HttpStatus.OK).send(JSON.stringify({ error: 'User not found.' }));
    }
    const removed = await this.keyService.removeKey(req.user.id);
    if (removed) {
      return res.status(HttpStatus.OK).send(JSON.stringify({ ok: true }));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(JSON.stringify({ ok: false }));
  }
}