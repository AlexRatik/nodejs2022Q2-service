import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isValidID } from 'src/utils/isValidID';
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
    if (!isValidID(id))
      throw new HttpException('ID Is Not Valid', HttpStatus.BAD_REQUEST);
    const user: User = this.users.find((user) => user.id === id);
    if (user) return user;
    else throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
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
    if (user instanceof User) {
      this.users.push(user);
      return user;
    } else
      throw new HttpException(
        'User Not containing required fields',
        HttpStatus.BAD_REQUEST,
      );
  }

  update(id: string, updatePasswordDTO: UpdatePasswordDTO) {
    if (!isValidID(id))
      throw new HttpException('ID Is Not Valid', HttpStatus.BAD_REQUEST);
    const user = this.users.find((user) => user.id === id);
    if (user && user.password === updatePasswordDTO.oldPassword) {
      user.password = updatePasswordDTO.newPassword;
      user.updatedAt = Date.now();
      user.version++;
      console.log(user);
      return user;
    } else if (user && user.password !== updatePasswordDTO.oldPassword) {
      throw new HttpException('Password Not Valid', HttpStatus.FORBIDDEN);
    } else {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
  }

  remove(id: string) {
    if (!isValidID(id))
      throw new HttpException('ID Is Not Valid', HttpStatus.BAD_REQUEST);
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1)
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    this.users.splice(userIndex, 1);
  }
}
