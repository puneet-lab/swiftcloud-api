import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SongDto {
  @Field({ description: 'Unique identifier for the song.' })
  id: string;

  @Field({ description: 'Title of the song.' })
  songName: string;

  @Field({ description: 'Artist who performed the song.' })
  artist: string;

  @Field({ description: 'Album where the song is included.' })
  album: string;

  @Field({ description: 'Writers who composed the song.' })
  writers: string;

  @Field({ description: 'Year the song was released.' })
  releaseYear: number;
}
