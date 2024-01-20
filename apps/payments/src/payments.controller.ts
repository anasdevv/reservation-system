import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ConfirmPaymentIntentDto,
  CurrentUser,
  JwtAuthGuard,
} from '@app/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AttachPaymentMethodDto } from './dto/attach-payment-method';
import { UserDocument } from 'apps/auth/src/users/models/user.schema';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @MessagePattern('confirm_intent')
  async confirmPaymentIntent(@Payload() data: ConfirmPaymentIntentDto) {
    console.log('dara ', data);
    return this.paymentsService.confirmPaymentIntent(data);
  }
  @UseGuards(JwtAuthGuard)
  @Post('register-user')
  async registerUser(@Body() data: RegisterUserDto) {
    await this.paymentsService.registerUser(data);
    return data;
  }
  @UseGuards(JwtAuthGuard)
  @Post('attach-payment-method')
  async attachPaymentMethod(@Body() data: AttachPaymentMethodDto) {
    return this.paymentsService.attachPaymentMethod(data);
  }
  @UseGuards(JwtAuthGuard)
  @Get('methods')
  async getPaymentMethods(@CurrentUser() user: UserDocument) {
    console.log('user ', user);
    return this.paymentsService.getPaymentMethods(
      user._id as unknown as string,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Get('test')
  async getHello(@CurrentUser() user: UserDocument) {
    console.log('_user ', user);
    return this.paymentsService.test(user.email);
  }
}
