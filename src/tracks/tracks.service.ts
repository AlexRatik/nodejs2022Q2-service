import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@Injectable()
export class TracksService {
  private tracks: Track[] = [
    {
      id: '660f4386-50b3-4725-8984-d2f9c1e667e5',
      name: 'dog',
      albumId: null,
      artistId: null,
      duration: 32,
    },
  ];

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    return this.tracks.find((track) => track.id === id);
  }

  create(createTrackDto: CreateTrackDto) {
    const track: Track = {
      id: uuidv4(),
      name: createTrackDto.name,
      albumId: createTrackDto.albumId || null,
      artistId: createTrackDto.artistId || null,
      duration: createTrackDto.duration,
    };
    this.tracks.push(track);
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.tracks.find((track) => track.id === id);
    if (track) {
      const keysForUpdate = Object.keys(updateTrackDto);
      console.log(keysForUpdate);
      for (const key of Object.keys(track)) {
        if (keysForUpdate.includes(key)) {
          console.log(key);

          track[key] = updateTrackDto[key];
        }

        continue;
      }
    }
    return track;
  }

  remove(id: string) {
    const tracksIndex = this.tracks.findIndex((track) => track.id === id);
    if (tracksIndex !== -1) this.tracks.splice(tracksIndex, 1);
    return tracksIndex;
  }
}
