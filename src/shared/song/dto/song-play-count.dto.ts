import { Field, ObjectType } from '@nestjs/graphql';
import { SongDto } from './song.dto';

@ObjectType()
export class SongPlayCountDTO extends SongDto {
  @Field({ description: 'Play count for the song', nullable: true })
  playCount: number;
}
