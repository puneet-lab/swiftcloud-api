import { Query, Resolver } from '@nestjs/graphql';
import { SongDto } from '../../shared/song/dto/song.dto';
import { SongService } from './song.service';

@Resolver()
export class SongResolver {
  constructor(private songService: SongService) {}

  @Query(() => [SongDto], {
    name: 'getAllSongs',
    description: 'Retrieve a list of all songs.',
  })
  async getAllSongs(): Promise<SongDto[]> {
    return this.songService.getAllSongs();
  }

  @Query(() => String)
  async getHelloWorld(): Promise<string> {
    return 'Hello World';
  }
}
