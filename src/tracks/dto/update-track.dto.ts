import {IsNumber, IsNumberString, IsOptional, IsString} from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  artistId: string;

  @IsString()
  @IsOptional()
  albumId: string;

  @IsNumber()
  @IsOptional()
  duration: number;
}
