import { Injectable } from '@nestjs/common';
import { ERRORS_MSGS } from 'src/utils/errorsMsg.enum';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { DATABASE } from '../database/database';

@Injectable()
export class UsersService {
  private static DATABASE: DATABASE<User>;

  constructor() {
    UsersService.DATABASE = new DATABASE<User>(User);
  }

  async findAll() {
    return UsersService.DATABASE.findAll();
  }

  async findOne(id: string) {
    return UsersService.DATABASE.findByID(id);
  }

  async create(createUserDto: CreateUserDto) {
    const user = new User({
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    });
    return UsersService.DATABASE.create(user);
  }

  async update(id: string, updatePasswordDTO: UpdatePasswordDTO) {
    const user = await this.findOne(id);
    if (!user) return undefined;
    if (user && user.password === updatePasswordDTO.oldPassword) {
      user.password = updatePasswordDTO.newPassword;
      user.updatedAt = Date.now();
      user.version++;
      return UsersService.DATABASE.update(id, user);
    } else if (user && user.password !== updatePasswordDTO.oldPassword) {
      return ERRORS_MSGS.INVALID_PASSWORD;
    }
  }

  async remove(id: string) {
    return UsersService.DATABASE.remove(id);
  }
}
