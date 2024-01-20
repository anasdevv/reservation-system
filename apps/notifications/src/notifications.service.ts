import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { getAccessToken } from './utils/helper';
@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService) {}
  private async getTransporter() {
    try {
      const accessToken = await getAccessToken();
      console.log('accessToken ', accessToken);
      return nodemailer.createTransport({
        service: 'gmail',
        tls: {
          rejectUnauthorized: false,
        },
        auth: {
          type: 'OAuth2',
          user: this.configService.get('SMTP_USER'),
          clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
          clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
          refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
          accessToken: accessToken as string,
        },
      });
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
  async notifyUser(email: string) {
    console.log('notify user ', email);
    const transporter = await this.getTransporter();
    await transporter.sendMail({
      from: this.configService.get('SPTM_USER'),
      to: email,
      subject: 'Reservation confirmed',
      text: 'Your reservation has been confirmed',
    });
  }
}
