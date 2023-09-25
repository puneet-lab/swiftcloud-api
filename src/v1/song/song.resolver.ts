import { Args, Query, Resolver } from '@nestjs/graphql';
import { PaginatedSongInput } from './../../shared/song/dto/paginated-song.input';
import { PaginatedSongResponse } from './../../shared/song/dto/paginated-song.response';
import { SongService } from './song.service';

@Resolver()
export class SongResolver {
  constructor(private songService: SongService) {}

  @Query(() => PaginatedSongResponse, {
    description: 'Retrieve paginated songs with the option to search and sort.',
  })
  async getAllSongs(
    @Args('paginatedSongsInput', { nullable: true })
    paginatedSongsInput: PaginatedSongInput = new PaginatedSongInput(),
  ): Promise<PaginatedSongResponse> {
    return await this.songService.getAllSongs(paginatedSongsInput);
  }

  @Query(() => String)
  async getHelloWorld(): Promise<string> {
    return 'Hello World';
  }
}
