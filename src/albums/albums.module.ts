import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { TracksService } from 'src/tracks/tracks.service';
import { ArtistsService } from '../artists/artists.service';
import { FavoritesService } from '../favorites/favorites.service';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService, TracksService, ArtistsService, FavoritesService],
})
export class AlbumsModule {}
