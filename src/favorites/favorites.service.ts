import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Favorite } from './entities/favorite.entity';
import { TracksService } from '../tracks/tracks.service';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';

@Injectable()
export class FavoritesService {
  private static DATABASE: Favorite = {
    albums: [],
    artists: [],
    tracks: [],
  };

  constructor(
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
  ) {}

  async addTrackToFavorites(id: string) {
    const track = await this.tracksService.findOne(id);
    if (!track) return undefined;
    FavoritesService.DATABASE.tracks.push(id);
    return track;
  }

  removeTrackFromFavorites(id: string) {
    const index = FavoritesService.DATABASE.tracks.findIndex(
      (trackId) => trackId === id,
    );
    if (index !== -1) FavoritesService.DATABASE.tracks.splice(index, 1);
    return index;
  }

  async addAlbumToFavorites(id: string) {
    const album = await this.albumsService.findOne(id);
    if (!album) return undefined;
    FavoritesService.DATABASE.albums.push(id);
    return album;
  }

  removeAlbumFromFavorites(id: string) {
    const index = FavoritesService.DATABASE.albums.findIndex(
      (albumId) => albumId === id,
    );
    if (index !== -1) FavoritesService.DATABASE.albums.splice(index, 1);
    return index;
  }

  async addArtistToFavorites(id: string) {
    const artist = await this.artistsService.findOne(id);
    if (!artist) return undefined;
    FavoritesService.DATABASE.artists.push(id);
    return artist;
  }

  removeArtistFromFavorites(id: string) {
    const index = FavoritesService.DATABASE.artists.findIndex(
      (artistId) => artistId === id,
    );
    if (index !== -1) FavoritesService.DATABASE.artists.splice(index, 1);
    return index;
  }

  async findAll() {
    const temp = {
      albums: await Promise.all(
        FavoritesService.DATABASE.albums.map(
          async (albumId) => await this.albumsService.findOne(albumId),
        ),
      ),
      tracks: await Promise.all(
        FavoritesService.DATABASE.tracks.map(
          async (trackId) => await this.tracksService.findOne(trackId),
        ),
      ),
      artists: await Promise.all(
        FavoritesService.DATABASE.artists.map(
          async (artistId) => await this.artistsService.findOne(artistId),
        ),
      ),
    };
    return {
      albums: temp.albums.filter((album) => album != undefined),
      tracks: temp.tracks.filter((track) => track != undefined),
      artists: temp.artists.filter((artist) => artist != undefined),
    };
  }
}
