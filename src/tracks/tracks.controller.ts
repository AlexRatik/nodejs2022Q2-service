import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  BadRequestException,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Header,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ERRORS_MSGS } from 'src/utils/errorsMsg.enum';
import { isValidID } from 'src/utils/isValidID';
import { Track } from './entities/track.entity';

@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Header('Content-Type', 'application/json')
  @Get()
  async findAll() {
    return this.tracksService.findAll();
  }

  @Header('Content-Type', 'application/json')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!isValidID(id)) throw new BadRequestException(ERRORS_MSGS.INVALID_ID);
    const track = await this.tracksService.findOne(id);
    if (track instanceof Track) return track;
    else throw new NotFoundException(ERRORS_MSGS.TRACK_NOT_FOUND);
  }

  @Post()
  @HttpCode(201)
  @Header('Content-Type', 'application/json')
  async create(@Body() createTrackDto: CreateTrackDto) {
    const track = await this.tracksService.create(createTrackDto);
    if (track) return track;
    else throw new BadRequestException(ERRORS_MSGS.NO_REQUIRED_FIELDS);
  }

  @Header('Content-Type', 'application/json')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    if (!isValidID(id)) throw new BadRequestException(ERRORS_MSGS.INVALID_ID);
    const track = await this.tracksService.update(id, updateTrackDto);
    if (track) return track;
    else throw new NotFoundException(ERRORS_MSGS.TRACK_NOT_FOUND);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (!isValidID(id)) throw new BadRequestException(ERRORS_MSGS.INVALID_ID);
    const trackIndex = await this.tracksService.remove(id);
    if (trackIndex === -1)
      throw new NotFoundException(ERRORS_MSGS.TRACK_NOT_FOUND);
    else return;
  }
}
