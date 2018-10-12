import { Controller, UseGuards, Post, HttpStatus, Get, Put, Param, Res, Body, Req, Logger, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from '@nestjs/passport';
import { Payment } from './payment.entity';

@Controller('payment')
export class UserController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('event')
  stripeEvent(@Body() body: any, @Req() req: any, @Res() res: any) {
    Logger.log(body);
    Logger.log(req.headers);
    return res.status(HttpStatus.OK).end();
  }

  @Post('sponsor')
  @UseGuards(AuthGuard('jwt'))
  addSponsorship(@Body() body: any, @Res() res: any) {
    if (body.amount != null) {
      const status = this.paymentService.addSponsorship(body.amount, 'usd', 'An example charge', body.token);
      return res.status(HttpStatus.OK).send(JSON.stringify({ status, ok: true }));
    }
    Logger.error(`Error adding sponsorship.`, undefined, UserController.name);
    return res.status(HttpStatus.OK).send(JSON.stringify({ error: 'no amount specified' }));
  }

  @Post('sponsor')
  @UseGuards(AuthGuard('jwt'))
  addSupporter(@Body() body: any, @Res() res: any) {
    if (body.amount != null) {
      const status = this.paymentService.addSupporter(body.amount, 'usd', 'An example charge', body.token);
      return res.status(HttpStatus.OK).send(JSON.stringify({ status, ok: true }));
    }
    Logger.error(`Error adding sponsorship.`, undefined, UserController.name);
    return res.status(HttpStatus.OK).send(JSON.stringify({ error: 'no amount specified' }));
  }
}