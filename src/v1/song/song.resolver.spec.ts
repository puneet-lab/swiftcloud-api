import { Test, TestingModule } from '@nestjs/testing';
import {
  PaginatedSongPlayResponse,
  TopSongsInput,
  User,
} from '../../shared/song/dto';
import { SongPlayCountDTO } from '../../shared/song/dto/song-play-count.dto';
import { Month } from './../../shared/enums/common.enum';
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
            getTopSongs: jest.fn(),
            getUserTopSongs: jest.fn(),
            getUserSongs: jest.fn(),
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

  describe('getTopSongs', () => {
    it('should return top songs', async () => {
      const result = [
        {
          songName: 'Style',
          album: '1989',
        },
        {
          songName: 'Beautiful Ghosts',
          album: 'Cats: Highlights from the Motion Picture Soundtrack',
        },
      ] as SongPlayCountDTO[];

      service.getTopSongs = jest.fn().mockResolvedValue(result);

      expect(
        await resolver.getTopSongs({
          month: Month.January,
          year: 2023,
          limit: 10,
        }),
      ).toEqual(result);

      expect(service.getTopSongs).toHaveBeenCalledWith(Month.January, 2023, 10);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      service.getTopSongs.mockImplementation(() => {
        throw error;
      });

      await expect(
        resolver.getTopSongs({ month: Month.January, year: 2023, limit: 10 }),
      ).rejects.toThrow(error);
    });

    it('should pass arguments to the service correctly', async () => {
      await resolver.getTopSongs({
        month: Month.January,
        year: 2023,
        limit: 10,
      });

      expect(service.getTopSongs).toHaveBeenCalledWith(Month.January, 2023, 10);
    });
  });

  describe('getUserTopSongs', () => {
    it('should return user top songs', async () => {
      const user = new User();
      user.id = '1bc';
      const topSongsArgs = new TopSongsInput();
      const result = [
        {
          songName: 'Style',
          album: '1989',
          playCount: 100,
        },
      ] as SongPlayCountDTO[];
      service.getUserTopSongs.mockResolvedValue(result);

      expect(await resolver.getUserTopSongs(user, topSongsArgs)).toEqual(
        result,
      );
      expect(service.getUserTopSongs).toHaveBeenCalledWith(
        user.id,
        topSongsArgs.month,
        topSongsArgs.year,
        topSongsArgs.limit,
      );
    });
  });

  describe('getUserSongs', () => {
    it('should return paginated songs for a user', async () => {
      const user = new User();
      user.id = '1bc';
      const paginatedSongsInput = new PaginatedSongInput();
      const paginatedSongPlayResponse = new PaginatedSongPlayResponse();
      service.getUserSongs.mockResolvedValue(paginatedSongPlayResponse);

      expect(await resolver.getUserSongs(user, paginatedSongsInput)).toEqual(
        paginatedSongPlayResponse,
      );
      expect(service.getUserSongs).toHaveBeenCalledWith(
        paginatedSongsInput,
        user.id,
      );
    });
  });
});
