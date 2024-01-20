import { IsNotEmpty, IsString } from 'class-validator';

export class AttachPaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;
  @IsString()
  @IsNotEmpty()
  customerId: string;
}
