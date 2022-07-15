import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumsService } from 'src/albums/albums.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { DATABASE } from '../database/database';
import { ArtistsService } from '../artists/artists.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class TracksService {
  private static DB: DATABASE<Track>;

  constructor(
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistService: ArtistsService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {
    TracksService.DB = new DATABASE<Track>(Track);
  }

  async findAll() {
    return await TracksService.DB.findAll();
  }

  async findOne(id: string) {
    return await TracksService.DB.findByID(id);
  }

  async create(createTrackDto: CreateTrackDto) {
    const track = new Track({
      id: uuidv4(),
      name: createTrackDto.name,
      albumId: createTrackDto.albumId || null,
      artistId: createTrackDto.artistId || null,
      duration: createTrackDto.duration,
    });
    return await TracksService.DB.create(track);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.findOne(id);
    if (!track) return undefined;
    const keysForUpdate = Object.keys(updateTrackDto);
    for (const key of Object.keys(track)) {
      if (keysForUpdate.includes(key)) {
        track[key] = updateTrackDto[key];
      }
    }
    return await TracksService.DB.update(id, track);
  }

  async remove(id: string) {
    const favs = await this.favoritesService.findAll();
    if (favs.tracks.length > 0) {
      favs.tracks.map((track) => {
        if (track.id === id) this.favoritesService.removeTrackFromFavorites(id);
        return;
      });
    }
    return await TracksService.DB.remove(id);
  }
}
