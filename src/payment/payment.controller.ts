import { Controller, UseGuards, Post, HttpStatus, Get, Put, Param, Res, Body, Req, Logger, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from '@nestjs/passport';
import { Payment } from './payment.entity';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('event')
  stripeEvent(@Body() body: any, @Req() req: any, @Res() res: any) {
    this.paymentService.logEvent(body);
    return res.status(HttpStatus.OK).end();
  }

  @Post('support')
  @UseGuards(AuthGuard('jwt'))
  async addSupporter(@Req() req: any, @Body() body: any, @Res() res: any) {
    const userId = req.user.id;
    const userEmail = req.user.email;
    if (body.monthly == null || body.token == null || body.email == null) {
      Logger.error(`Error adding supporter.`, undefined, PaymentController.name);
      return res.status(HttpStatus.OK).send(JSON.stringify({ error: 'Incomplete payment information.' }));
    }
    let status;
    const description = `A ${body.monthly ? 'monthly' : 'one time'} donation from ${body.email} for ${body.amount}.`;
    if (body.monthly) {
      status = await this.paymentService.addSubscription(userId, userEmail, body.email, body.plan, description, body.token);
    } else {
      status = await this.paymentService.addSupporter(userId, userEmail, body.email, body.amount, 'usd', description, body.token);
    }
    if (status === 'succeeded' || status === 'active') {
      return res.status(HttpStatus.OK).send(JSON.stringify({ status, ok: true }));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(JSON.stringify({ status, ok: false }));
  }

  @Delete('support')
  @UseGuards(AuthGuard('jwt'))
  async removeSupporter(@Req() req: any, @Body() body: any, @Res() res: any) {
    const { id, email } = req.user;
    const removed = await this.paymentService.removeSubscription(id, email);
    if (removed) {
      return res.status(HttpStatus.OK).send(JSON.stringify({ ok: true }));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(JSON.stringify({ ok: false }));
  }
}