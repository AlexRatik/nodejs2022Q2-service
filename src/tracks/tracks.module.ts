import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { AlbumsService } from 'src/albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { FavoritesService } from '../favorites/favorites.service';

@Module({
  controllers: [TracksController],
  providers: [TracksService, AlbumsService, ArtistsService, FavoritesService],
})
export class TracksModule {}
