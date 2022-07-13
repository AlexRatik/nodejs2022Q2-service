import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  Inject,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { isValidID } from 'src/utils/isValidID';
import { ERRORS_MSGS } from 'src/utils/errorsMsg.enum';
import { User } from './entities/user.entity';

@Controller('user')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: UsersService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!isValidID(id)) throw new BadRequestException(ERRORS_MSGS.INVALID_ID);
    const user = this.usersService.findOne(id);
    if (user) return user;
    else throw new NotFoundException(ERRORS_MSGS.USER_NOT_FOUND);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const user = this.usersService.create(createUserDto);
    if (user) return user;
    else throw new BadRequestException(ERRORS_MSGS.NO_REQUIRED_FIELDS);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePasswordDTO: UpdatePasswordDTO,
  ) {
    if (!isValidID(id)) throw new BadRequestException(ERRORS_MSGS.INVALID_ID);
    const data = this.usersService.update(id, updatePasswordDTO);
    if (data instanceof User) return data;
    else if (data === ERRORS_MSGS.INVALID_PASSWORD)
      throw new ForbiddenException(ERRORS_MSGS.INVALID_PASSWORD);
    else throw new NotFoundException(ERRORS_MSGS.USER_NOT_FOUND);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    if (!isValidID(id)) throw new BadRequestException(ERRORS_MSGS.INVALID_ID);
    const userIndex = this.usersService.remove(id);
    if (userIndex === -1)
      throw new NotFoundException(ERRORS_MSGS.USER_NOT_FOUND);
    else return;
  }
}
