import { Controller, UseGuards, Post, HttpStatus, HttpCode, Get, Param, Res, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  @UseGuards(AuthGuard('jwt', { session: false }))
  getProducts(@Res() res: any) {
    return res.status(HttpStatus.OK).send(JSON.stringify([{ products: ['basic'] }]));
  }
}