import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  artistId?: string | null;

  @IsString()
  @IsOptional()
  albumId?: string | null;

  @IsNumberString()
  @IsNotEmpty()
  duration: number;
}
