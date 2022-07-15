import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumsService } from 'src/albums/albums.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { DATABASE } from '../database/database';

@Injectable()
export class TracksService {
  private static DB: DATABASE<Track>;

  constructor(
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
  ) {
    TracksService.DB = new DATABASE<Track>(Track);
  }

  async findAll() {
    return TracksService.DB.findAll();
  }

  async findOne(id: string) {
    return TracksService.DB.findByID(id);
  }

  async create(createTrackDto: CreateTrackDto) {
    const track = new Track({
      id: uuidv4(),
      name: createTrackDto.name,
      albumId: createTrackDto.albumId || null,
      artistId: createTrackDto.artistId || null,
      duration: createTrackDto.duration,
    });
    return TracksService.DB.create(track);
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
    return TracksService.DB.update(id, track);
  }

  async remove(id: string) {
    return TracksService.DB.remove(id);
  }

  // async removeAlbum(id: string) {
  //   return new Promise(async (resolve) => {
  //     const tracks = await this.findAll();
  //     tracks.map(async (track) => {
  //       if (track.albumId === id) {
  //         await this.update(id, { albumId: null });
  //       }
  //       return track;
  //     });
  //     resolve(null);
  //   });
  // }
}
