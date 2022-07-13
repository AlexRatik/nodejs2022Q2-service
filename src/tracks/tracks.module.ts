import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';

@Module({
  controllers: [TracksController],
  providers: [
    {
      provide: 'TRACKS_SERVICE',
      useClass: TracksService,
    },
  ],
})
export class TracksModule {}
