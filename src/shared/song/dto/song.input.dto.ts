import { Field, InputType } from '@nestjs/graphql';
import { SortOrderTypes } from './../../enums/common.enum';
import { SongColumnTypes } from './../../enums/song/song.enum';

@InputType()
export class SongSearchInput {
  @Field(() => SongColumnTypes, {
    nullable: true,
    description:
      'Specifies the column in the Songs table to be searched. If omitted, a general search across all searchable columns will be performed.',
  })
  column?: SongColumnTypes;

  @Field({
    nullable: true,
    description:
      'The search term to be used for matching entries in the specified column. If the column is omitted, this term will be used for a general search.',
  })
  term?: string;
}

@InputType()
export class SongSortInput {
  @Field(() => SongColumnTypes, {
    nullable: true,
    description:
      'Specifies the column in the Songs table to be used for sorting the results. If omitted, the default sorting column will be used.',
  })
  column?: SongColumnTypes;

  @Field(() => SortOrderTypes, {
    nullable: true,
    defaultValue: SortOrderTypes.ASC,
    description:
      'Specifies the order of the sort operation - either Ascending (ASC) or Descending (DESC). If omitted, the default sort order will be used.',
  })
  order?: SortOrderTypes;
}
