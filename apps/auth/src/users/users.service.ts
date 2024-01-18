import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  private async validateCreateUser(createUserDto: CreateUserDto) {
    let user = null;
    try {
      user = await this.usersRepository.findOne({
        email: createUserDto.email,
      });
    } catch (error) {}

    if (user) {
      throw new UnprocessableEntityException('User already exists');
    }
  }
  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUser(createUserDto);
    const res = await this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
    console.log('res ', res);
    return res;
  }
  async validateUser(email: string, password: string) {
    console.log('validate user ');
    const user = await this.usersRepository.findOne({ email });
    console.log('user ', user);
    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
  async getUser({ userId }: GetUserDto) {
    // console.log('getUserDto ', getUserDto);
    const res = await this.usersRepository.findOne({
      _id: userId,
    });
    console.log('res ', res);
    return res;
  }
}
