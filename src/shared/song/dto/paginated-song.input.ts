import { Field, InputType, Int } from '@nestjs/graphql';
import { SongSearchInput, SongSortInput } from './song.input.dto';

@InputType()
export class PaginatedSongInput {
  @Field(() => Int, { defaultValue: 1, description: 'Current page number.' })
  page: number;

  @Field(() => Int, {
    defaultValue: 10,
    description: 'Number of items per page.',
  })
  pageSize: number;

  @Field(() => [SongSearchInput], {
    nullable: 'itemsAndList',
    defaultValue: [],
    description:
      'Array of search criteria, each containing a column and search term. Allows for searching across multiple columns simultaneously. If not provided or empty, no search filtering will be applied.',
  })
  search: SongSearchInput[];

  @Field(() => [SongSortInput], {
    nullable: 'itemsAndList',
    defaultValue: [],
    description:
      'Array of sort criteria, each containing a column and sort order (ASC or DESC). Allows for multi-column sorting to organize the data in a precise order. If not provided or empty, the default sort order will be applied.',
  })
  sort: SongSortInput[];

  constructor(
    page: number = 1,
    pageSize: number = 10,
    search: SongSearchInput[] = [],
    sort: SongSortInput[] = [],
  ) {
    this.page = page;
    this.pageSize = pageSize;
    this.search = search;
    this.sort = sort;
  }
}
