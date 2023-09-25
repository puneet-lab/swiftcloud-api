import { Field, ObjectType } from '@nestjs/graphql';
import { SongDto } from './song.dto';

@ObjectType()
export class TopSongDTO extends SongDto {
  @Field({ description: 'Play count for the song' })
  playCount: number;
}
