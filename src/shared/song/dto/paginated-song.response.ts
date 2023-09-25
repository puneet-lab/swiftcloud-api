import { Field, ObjectType } from '@nestjs/graphql';
import { SongDto } from './song.dto';

@ObjectType({
  description:
    'A paginated list of songs, including information about the pagination.',
})
export class PaginatedSongResponse {
  @Field(() => [SongDto], {
    description: 'The list of songs retrieved for the current page.',
  })
  songs: SongDto[];

  @Field({
    description: 'The total number of songs available across all pages.',
  })
  total: number;

  @Field({ description: 'The current page number. Starts at 1.' })
  page: number;

  @Field({
    description:
      'The total number of pages available. This is calculated by dividing the total number of songs by the number of songs per page.',
  })
  pages: number;
}
