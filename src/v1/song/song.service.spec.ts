import { SortOrderTypes } from './../../shared/enums/common.enum';
import { SongColumnTypes } from './../../shared/enums/song/song.enum';
import { PaginatedSongInput } from './../../shared/song/dto/paginated-song.input';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Song } from '../../shared/song/dto';
import {
  applySearchCriteria,
  applySortCriteria,
} from '../../shared/song/helper/song.helper';
import { SongService } from './song.service';

jest.mock('../../shared/song/helper/song.helper', () => ({
  applySearchCriteria: jest.fn(),
  applySortCriteria: jest.fn(),
}));

describe('SongService', () => {
  let service: SongService;
  let mockQueryBuilder;
  let mockRepository;

  beforeEach(async () => {
    mockQueryBuilder = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    };

    mockRepository = {
      createQueryBuilder: jest.fn(() => mockQueryBuilder),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongService,
        {
          provide: getRepositoryToken(Song),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SongService>(SongService);
  });

  describe('getAllSongs', () => {
    it('should call the helper functions and query builder methods with page arguments', async () => {
      const paginatedSongInput: PaginatedSongInput = {
        page: 1,
        pageSize: 10,
        search: [{ column: SongColumnTypes.RELEASE_YEAR, term: '2020' }],
        sort: [
          { column: SongColumnTypes.RELEASE_YEAR, order: SortOrderTypes.DESC },
        ],
      };

      await service.getAllSongs(paginatedSongInput);

      expect(applySearchCriteria).toHaveBeenCalledWith(
        mockQueryBuilder,
        paginatedSongInput.search,
      );
      expect(applySortCriteria).toHaveBeenCalledWith(
        mockQueryBuilder,
        paginatedSongInput.sort,
      );
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });
  });

  it('should return a paginated response', async () => {
    mockQueryBuilder.getManyAndCount.mockResolvedValue([
      [{ songName: 'abc' }],
      1,
    ]);

    const input = { page: 1, pageSize: 10 };
    const result = await service.getAllSongs(input);

    expect(result).toEqual({
      songs: [{ songName: 'abc' }],
      total: 1,
      page: 1,
      pages: 1,
    });
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
    expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
  });

  it('should handle no data connection', async () => {
    mockQueryBuilder.getManyAndCount.mockRejectedValue(
      new Error('ECONNREFUSED'),
    );

    try {
      await service.getAllSongs({ page: 1, pageSize: 10 });
    } catch (error) {
      expect(error.message).toBe('ECONNREFUSED');
    }
  });

  it('should handle database error', async () => {
    mockQueryBuilder.getManyAndCount.mockRejectedValue(
      new Error('Database error'),
    );

    try {
      await service.getAllSongs({ page: 1, pageSize: 10 });
    } catch (error) {
      expect(error.message).toBe('Database error');
    }
  });
});
