import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { ArtistsService } from '../artists/artists.service';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, AlbumsService, TracksService, ArtistsService],
})
export class FavoritesModule {}
