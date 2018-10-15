import { Controller, UseGuards, Post, HttpStatus, Get, Put, Param, Res, Body, Req, Logger, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from '@nestjs/passport';
import { Payment } from './payment.entity';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('event')
  stripeEvent(@Body() body: any, @Req() req: any, @Res() res: any) {
    Logger.log(body);
    this.paymentService.logEvent(body);
    return res.status(HttpStatus.OK).end();
  }

  @Post('support')
  @UseGuards(AuthGuard('jwt'))
  async addSupporter(@Body() body: any, @Res() res: any) {
    if (body.monthly == null || body.token == null || body.email == null || body.amount == null) {
      Logger.error(`Error adding supporter.`, undefined, PaymentController.name);
      return res.status(HttpStatus.OK).send(JSON.stringify({ error: 'Incomplete payment information.' }));
    }
    let status;
    const description = `A ${body.monthly ? 'monthly' : 'one time'} donation from ${body.email} for ${body.amount}.`;
    if (body.monthly) {
      status = await this.paymentService.addSponsorship(body.email, body.amount, 'usd', description, body.token);
    } else {
      status = await this.paymentService.addSupporter(body.email, body.amount, 'usd', description, body.token);
    }
    if (status === 'succeeded' || status === 'active') {
      return res.status(HttpStatus.OK).send(JSON.stringify({ status, ok: true }));
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(JSON.stringify({ status, ok: false }));
  }
}