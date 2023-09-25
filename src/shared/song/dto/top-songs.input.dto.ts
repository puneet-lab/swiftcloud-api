import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Month } from '../../enums/common.enum';

@ArgsType()
export class TopSongsInput {
  @Field(() => Month, {
    nullable: true,
    description:
      'The month for which to retrieve top songs. Must be an integer between 1 and 12. If omitted, the behavior depends on the value of the `year` argument.',
  })
  @IsInt({ message: 'Month must be an integer' })
  @Min(1, { message: 'Month must be between 1 and 12' })
  @Max(12, { message: 'Month must be between 1 and 12' })
  @IsOptional()
  month?: Month;

  @Field(() => Int, {
    nullable: true,
    description:
      'The year for which to retrieve top songs. Must be an integer no earlier than 2006 (as Taylor swift first song came in year 2006) and no later than the current year. If omitted, and `month` is also omitted, top songs will be retrieved for all time.',
  })
  @IsInt({ message: 'Year must be an integer' })
  @Min(2006, {
    message:
      'Taylor swift first song came in the year 2006, year must not be earlier than 2006, you cannot play a song before it is recorded :P',
  })
  @Max(new Date().getFullYear(), {
    message: `Year must not be later than ${new Date().getFullYear()}`,
  })
  @IsOptional()
  year?: number;

  @Field(() => Int, {
    defaultValue: 10,
    description:
      'The maximum number of top songs to retrieve. Must be an integer between 1 and 100. Defaults to 10 if omitted.',
  })
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be between 1 and 100' })
  @Max(100, { message: 'Limit must be between 1 and 100' })
  limit: number = 10;
}
