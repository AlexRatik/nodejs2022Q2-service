import {
  Controller,
  Get,
  Post,
  Delete,
  BadRequestException,
  UnprocessableEntityException,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { isValidID } from '../utils/isValidID';
import { ERRORS_MSGS } from '../utils/errorsMsg.enum';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async findAll() {
    return await this.favoritesService.findAll();
  }

  @Post('track/:id')
  async addTrackToFavorites(@Param('id') id: string) {
    if (!isValidID(id)) throw new BadRequestException(ERRORS_MSGS.INVALID_ID);
    const track = await this.favoritesService.addTrackToFavorites(id);
    if (track) return track;
    else throw new UnprocessableEntityException(ERRORS_MSGS.TRACK_NOT_FOUND);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('track/:id')
  removeTrackFromFavorites(@Param('id') id: string) {
    if (!isValidID(id)) throw new BadRequestException(ERRORS_MSGS.INVALID_ID);
    const index = this.favoritesService.removeTrackFromFavorites(id);
    if (index !== -1) return;
    else throw new NotFoundException(ERRORS_MSGS.TRACK_NOT_FOUND);
  }

  @Post('artist/:id')
  async addArtistToFavorites(@Param('id') id: string) {
    if (!isValidID(id)) throw new BadRequestException(ERRORS_MSGS.INVALID_ID);
    const artist = await this.favoritesService.addArtistToFavorites(id);
    if (artist) return artist;
    else throw new UnprocessableEntityException(ERRORS_MSGS.ARTIST_NOT_FOUND);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('artist/:id')
  removeArtistFromFavorites(@Param('id') id: string) {
    if (!isValidID(id)) throw new BadRequestException(ERRORS_MSGS.INVALID_ID);
    const index = this.favoritesService.removeArtistFromFavorites(id);
    if (index !== -1) return;
    else throw new NotFoundException(ERRORS_MSGS.ARTIST_NOT_FOUND);
  }

  @Post('album/:id')
  async addAlbumToFavorites(@Param('id') id: string) {
    if (!isValidID(id)) throw new BadRequestException(ERRORS_MSGS.INVALID_ID);
    const album = await this.favoritesService.addAlbumToFavorites(id);
    if (album) return album;
    else throw new UnprocessableEntityException(ERRORS_MSGS.ALBUM_NOT_FOUND);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('album/:id')
  removeAlbumFromFavorites(@Param('id') id: string) {
    if (!isValidID(id)) throw new BadRequestException(ERRORS_MSGS.INVALID_ID);
    const index = this.favoritesService.removeAlbumFromFavorites(id);
    if (index !== -1) return;
    else throw new NotFoundException(ERRORS_MSGS.ALBUM_NOT_FOUND);
  }
}
