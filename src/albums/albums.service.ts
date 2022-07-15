import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { TracksService } from 'src/tracks/tracks.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { DATABASE } from '../database/database';

@Injectable()
export class AlbumsService {
  private static DATABASE: DATABASE<Album>;

  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
  ) {
    AlbumsService.DATABASE = new DATABASE<Album>(Album);
  }

  async findAll(): Promise<Album[]> {
    return AlbumsService.DATABASE.findAll();
  }

  async findOne(id: string): Promise<Album> {
    return AlbumsService.DATABASE.findByID(id);
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album = new Album({
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    });
    return AlbumsService.DATABASE.create(album);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.findOne(id);
    if (!album) return undefined;
    const keysForUpdate = Object.keys(updateAlbumDto);
    for (const key of Object.keys(album)) {
      if (keysForUpdate.includes(key)) {
        album[key] = updateAlbumDto[key];
      }
    }
    return AlbumsService.DATABASE.update(id, album);
  }

  async remove(id: string): Promise<number> {
    const albumIndex = await AlbumsService.DATABASE.remove(id);
    const tracks = await this.tracksService.findAll();
    for (const track of tracks) {
      if (track.albumId === id) {
        await this.tracksService.update(track.id, { ...track, albumId: null });
      }
    }
    return albumIndex;
  }
}
