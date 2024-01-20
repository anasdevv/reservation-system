import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotifyUserDto } from './dto/notify-user.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  @UsePipes(new ValidationPipe())
  @EventPattern('notify_user')
  async notifyUser(@Payload() { email }: NotifyUserDto) {
    return this.notificationsService.notifyUser(email);
  }
}
