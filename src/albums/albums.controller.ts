import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ERRORS_MSGS } from 'src/utils/errorsMsg.enum';
import { isValidID } from 'src/utils/isValidID';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  async findAll() {
    return this.albumsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!isValidID(id)) throw new BadRequestException(ERRORS_MSGS.INVALID_ID);
    const album = await this.albumsService.findOne(id);
    if (album) return album;
    else throw new NotFoundException(ERRORS_MSGS.ALBUM_NOT_FOUND);
  }

  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    const album = await this.albumsService.create(createAlbumDto);
    if (album instanceof Album) return album;
    else throw new BadRequestException(ERRORS_MSGS.NO_REQUIRED_FIELDS);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    if (!isValidID(id)) throw new BadRequestException(ERRORS_MSGS.INVALID_ID);
    const album = await this.albumsService.update(id, updateAlbumDto);
    if (album) return album;
    else throw new NotFoundException(ERRORS_MSGS.ALBUM_NOT_FOUND);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (!isValidID(id)) throw new BadRequestException(ERRORS_MSGS.INVALID_ID);
    const albumId = await this.albumsService.remove(id);
    if (albumId === -1)
      throw new NotFoundException(ERRORS_MSGS.ALBUM_NOT_FOUND);
    return;
  }
}
