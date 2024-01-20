import Stripe from 'stripe';
import { CardDto } from './card.dto';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;
  @IsNumber()
  amount: number;
  @IsNotEmpty()
  @IsString()
  userId: string;
}
export class ConfirmPaymentIntentDto {
  @IsNotEmpty()
  @IsString()
  paymentIntentId: string;
  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
