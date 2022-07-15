import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  BadRequestException,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ERRORS_MSGS } from 'src/utils/errorsMsg.enum';
import { isValidID } from 'src/utils/isValidID';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  findAll() {
    return this.artistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!isValidID(id)) throw new BadRequestException(ERRORS_MSGS.INVALID_ID);
    const artist = this.artistsService.findOne(id);
    if (artist) return artist;
    else throw new NotFoundException(ERRORS_MSGS.ARTIST_NOT_FOUND);
  }

  @Post()
  create(@Body() createArtistDto: CreateArtistDto) {
    const artist = this.artistsService.create(createArtistDto);
    if (artist instanceof Artist) return artist;
    else throw new BadRequestException(ERRORS_MSGS.NO_REQUIRED_FIELDS);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
    if (!isValidID(id)) throw new BadRequestException(ERRORS_MSGS.INVALID_ID);
    const artist = this.artistsService.update(id, updateArtistDto);
    if (artist) return artist;
    else throw new NotFoundException(ERRORS_MSGS.ARTIST_NOT_FOUND);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!isValidID(id)) throw new BadRequestException(ERRORS_MSGS.INVALID_ID);
    const artistIndex = this.artistsService.remove(id);
    if (artistIndex === -1)
      throw new NotFoundException(ERRORS_MSGS.ARTIST_NOT_FOUND);
    return;
  }
}
