import { IsEmail, IsNotEmpty } from 'class-validator';

export class NotifyUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
