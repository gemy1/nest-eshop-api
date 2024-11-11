import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { addItemDto } from './dto/add-item.dto';
import { Request } from 'express';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addCartItem(@Body() itemDetails: addItemDto, @Req() req: Request) {
    return this.cartService.addItem(itemDetails, req.currentUser);
  }

  @Get()
  getCartForUser(@Req() req: Request) {
    return this.cartService.findCartByUserId(req.currentUser.id);
  }
  @Patch('update')
  update(@Body() itemDetails: addItemDto, @Req() req: Request) {
    return this.cartService.update(itemDetails, req.currentUser);
  }

  @Delete('delete/:id')
  remove(@Param('id') productId: string, @Req() req: Request) {
    return this.cartService.remove(+productId, req.currentUser);
  }

  @Post('reset')
  resetCart(@Req() req: Request) {
    return this.cartService.reset(req.currentUser);
  }
}
