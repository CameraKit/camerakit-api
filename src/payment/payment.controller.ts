import { Controller, UseGuards, Post, HttpStatus, HttpCode, Get, Param, Res, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('')
  @UseGuards(AuthGuard('jwt', { session: false }))
    getPayment(@Res() res: any) {
    return res.status(HttpStatus.OK).send(JSON.stringify([{ products: ['basic'] }]));
  }
}