import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { DATABASE } from '../database/database';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class ArtistsService {
  private static DATABASE: DATABASE<Artist>;

  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {
    ArtistsService.DATABASE = new DATABASE<Artist>(Artist);
  }

  async findAll(): Promise<Artist[]> {
    return ArtistsService.DATABASE.findAll();
  }

  async findOne(id: string): Promise<Artist | undefined> {
    return ArtistsService.DATABASE.findByID(id);
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist = new Artist({
      id: uuidv4(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    });
    return ArtistsService.DATABASE.create(artist);
  }

  async update(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist | undefined> {
    const artist = await this.findOne(id);
    console.log(artist);
    if (!artist) return undefined;
    const keysForUpdate = Object.keys(updateArtistDto);
    for (const key of Object.keys(artist)) {
      if (keysForUpdate.includes(key)) {
        artist[key] = updateArtistDto[key];
      }
    }
    return ArtistsService.DATABASE.update(id, artist);
  }

  async remove(id: string): Promise<number> {
    const favs = await this.favoritesService.findAll();
    if (favs.artists.length > 0) {
      favs.artists.map((artist) => {
        if (artist.id === id)
          this.favoritesService.removeArtistFromFavorites(id);
        return;
      });
    }

    const artistIndex = await ArtistsService.DATABASE.remove(id);
    const tracks = await this.tracksService.findAll();
    for (const track of tracks) {
      if (track.artistId === id)
        await this.tracksService.update(track.id, { artistId: null });
    }
    return artistIndex;
  }
}
