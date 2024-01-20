import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);
  console.log(
    'configService ',
    configService.get('PAYMENTS_MICROSERVICE_PORT'),
  );
  console.log('configService ', configService.get('AUTH_MICROSERVICE_PORT'));
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('PAYMENTS_MICROSERVICE_PORT'),
    },
  });
  app.useLogger(app.get(Logger));
  app.use(cookieParser());

  app.startAllMicroservices();
  await app.listen(3333);
}
bootstrap();
