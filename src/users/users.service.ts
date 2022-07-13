import { Injectable } from '@nestjs/common';
import { ERRORS_MSGS } from 'src/utils/errorsMsg.enum';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    const user = this.users.find((user) => user.id === id);
    return user;
  }

  create(createUserDto: CreateUserDto) {
    const user = new User({
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    });
    this.users.push(user);
    return user;
  }

  update(id: string, updatePasswordDTO: UpdatePasswordDTO) {
    const user = this.users.find((user) => user.id === id);
    if (user && user.password === updatePasswordDTO.oldPassword) {
      user.password = updatePasswordDTO.newPassword;
      user.updatedAt = Date.now();
      user.version++;
    } else if (user && user.password !== updatePasswordDTO.oldPassword) {
      return ERRORS_MSGS.INVALID_PASSWORD;
    }
    return user;
  }

  remove(id: string) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    this.users.splice(userIndex, 1);
    return userIndex;
  }
}
