import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { SongPlayCountDTO } from '../../shared/song/dto/song-play-count.dto';
import { TopSongsInput } from '../../shared/song/dto/top-songs.input.dto';
import { JwtAuthGuard } from './../../auth/jwt-auth.guard';
import { GetUser } from './../../shared/decorator/get-user.decorator';
import { PaginatedSongPlayResponse } from './../../shared/song/dto/paginated-song-play-response';
import { PaginatedSongInput } from './../../shared/song/dto/paginated-song.input';
import { PaginatedSongResponse } from './../../shared/song/dto/paginated-song.response';
import { User } from './../../shared/song/dto/user.entity';
import { SongService } from './song.service';

@Resolver()
export class SongResolver {
  constructor(private songService: SongService) {}

  @Query(() => PaginatedSongResponse, {
    description:
      'Retrieves a paginated list of songs with options for search and sort. The response includes song data, total count, current page, and total pages.',
  })
  async getAllSongs(
    @Args('paginatedSongsInput', {
      nullable: true,
      description: 'Pagination, search, and sort options.',
    })
    paginatedSongsInput: PaginatedSongInput = new PaginatedSongInput(),
  ): Promise<PaginatedSongResponse> {
    return await this.songService.getAllSongs(paginatedSongsInput);
  }

  @Query(() => [SongPlayCountDTO], {
    description:
      'Retrieves a list of top songs based on play count for a specified month and year, with an option to limit the number of results.',
  })
  async getTopSongs(
    @Args() topSongsArgs: TopSongsInput,
  ): Promise<SongPlayCountDTO[]> {
    const { month, year, limit } = topSongsArgs;
    return await this.songService.getTopSongs(month, year, limit);
  }

  @Query(() => [SongPlayCountDTO], {
    description:
      'Retrieves a list of top songs played by the authenticated user based on play count for a specified month and year, with an option to limit the number of results.',
  })
  @UseGuards(JwtAuthGuard)
  async getUserTopSongs(
    @GetUser() user: User,
    @Args() topSongsArgs: TopSongsInput,
  ): Promise<SongPlayCountDTO[]> {
    const { month, year, limit } = topSongsArgs;
    return await this.songService.getUserTopSongs(user.id, month, year, limit);
  }

  @Query(() => PaginatedSongPlayResponse, {
    description:
      'Retrieve paginated songs with the option to search and sort for a user.',
  })
  @UseGuards(JwtAuthGuard)
  async getUserSongs(
    @GetUser() user: User,
    @Args('paginatedSongsInput', { nullable: true })
    paginatedSongsInput: PaginatedSongInput = new PaginatedSongInput(),
  ): Promise<PaginatedSongPlayResponse> {
    console.log(paginatedSongsInput);
    return await this.songService.getUserSongs(paginatedSongsInput, user.id);
  }
}
