import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { AlbumsService } from 'src/albums/albums.service';

@Module({
  controllers: [TracksController],
  providers: [TracksService, AlbumsService],
})
export class TracksModule {}
