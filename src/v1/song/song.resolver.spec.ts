import { Test, TestingModule } from '@nestjs/testing';
import { PaginatedSongInput } from './../../shared/song/dto/paginated-song.input';
import { PaginatedSongResponse } from './../../shared/song/dto/paginated-song.response';
import { SongResolver } from './song.resolver';
import { SongService } from './song.service';

describe('SongResolver', () => {
  let resolver: SongResolver;
  let service: jest.Mocked<SongService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongResolver,
        {
          provide: SongService,
          useValue: {
            getAllSongs: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<SongResolver>(SongResolver);
    service = module.get(SongService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getAllSongs', () => {
    it('should return paginated songs', async () => {
      const paginatedSongsInput = new PaginatedSongInput();
      const paginatedSongResponse = new PaginatedSongResponse();
      service.getAllSongs.mockResolvedValue(paginatedSongResponse);

      expect(await resolver.getAllSongs(paginatedSongsInput)).toEqual(
        paginatedSongResponse,
      );
      expect(service.getAllSongs).toHaveBeenCalledWith(paginatedSongsInput);
    });
  });

  describe('getHelloWorld', () => {
    it('should return "Hello World"', async () => {
      expect(await resolver.getHelloWorld()).toBe('Hello World');
    });
  });
});
