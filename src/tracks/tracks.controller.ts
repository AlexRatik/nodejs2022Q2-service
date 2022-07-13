import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  Put,
  BadRequestException,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ERRORS_MSGS } from 'src/utils/errorsMsg.enum';
import { isValidID } from 'src/utils/isValidID';

@Controller('tracks')
export class TracksController {
  constructor(
    @Inject('TRACKS_SERVICE') private readonly tracksService: TracksService,
  ) {}

  @Get()
  findAll() {
    return this.tracksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!isValidID(id)) throw new BadRequestException(ERRORS_MSGS.INVALID_ID);
    const track = this.tracksService.findOne(id);
    if (track) return track;
    else throw new NotFoundException(ERRORS_MSGS.TRACK_NOT_FOUND);
  }

  @Post()
  create(@Body() createTrackDto: CreateTrackDto) {
    const track = this.tracksService.create(createTrackDto);
    if (track) return track;
    else throw new BadRequestException(ERRORS_MSGS.NO_REQUIRED_FIELDS);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    if (!isValidID(id)) throw new BadRequestException(ERRORS_MSGS.INVALID_ID);
    const track = this.tracksService.update(id, updateTrackDto);
    if (track) return track;
    else throw new NotFoundException(ERRORS_MSGS.TRACK_NOT_FOUND);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!isValidID(id)) throw new BadRequestException(ERRORS_MSGS.INVALID_ID);
    const trackIndex = this.tracksService.remove(id);
    if (trackIndex === -1)
      throw new NotFoundException(ERRORS_MSGS.TRACK_NOT_FOUND);
    else return;
  }
}
