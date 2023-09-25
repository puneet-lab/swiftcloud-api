import { Args, Query, Resolver } from '@nestjs/graphql';
import { TopSongsInput } from '../../shared/song/dto/top-songs.input.dto';
import { PaginatedSongInput } from './../../shared/song/dto/paginated-song.input';
import { PaginatedSongResponse } from './../../shared/song/dto/paginated-song.response';
import { TopSongDTO } from './../../shared/song/dto/top-songs.response.dto';
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

  @Query(() => [TopSongDTO])
  async getTopSongs(
    @Args() topSongsArgs: TopSongsInput,
  ): Promise<TopSongDTO[]> {
    const { month, year, limit } = topSongsArgs;
    return await this.songService.getTopSongs(month, year, limit);
  }

  @Query(() => String)
  async getHelloWorld(): Promise<string> {
    return 'Hello World';
  }
}
