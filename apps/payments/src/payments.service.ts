import {
  Injectable,
  UnprocessableEntityException,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { ConfirmPaymentIntentDto, CreatePaymentDto } from '@app/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AttachPaymentMethodDto } from './dto/attach-payment-method';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2023-10-16',
    },
  );
  constructor(
    private readonly configService: ConfigService,
    @Inject('notify') private readonly notificationService: ClientProxy,
  ) {}
  async registerUser({ name, email }: RegisterUserDto) {
    try {
      const customer = await this.stripe.customers.create({
        name,
        email,
      });
      return customer;
    } catch (err) {
      throw new UnprocessableEntityException(err.message);
    }
  }
  async attachPaymentMethod({
    customerId,
    paymentMethodId,
  }: AttachPaymentMethodDto) {
    try {
      // const id = this.stripe.customers.retrieve(emai)
      const paymentMethod = await this.stripe.paymentMethods.attach(
        paymentMethodId,
        {
          customer: customerId,
        },
      );
      return paymentMethod;
    } catch (err) {
      throw new UnprocessableEntityException(err.message);
    }
  }
  async getPaymentMethods(userId: string) {
    return this.stripe.customers.listPaymentMethods(userId, {
      type: 'card',
    });
  }
  async confirmPaymentIntent({
    paymentMethodId,
    paymentIntentId,
    email,
  }: ConfirmPaymentIntentDto) {
    const paymentIntent = await this.stripe.paymentIntents.confirm(
      paymentIntentId,
      {
        payment_method: paymentMethodId,
      },
    );
    this.notificationService.emit('notify_user', {
      email,
    });
    return paymentIntent;
  }
  async test(email: string) {
    this.notificationService.emit('notify_user', {
      email,
    });
    return 'success';
  }
}
