import { SortOrderTypes } from './../../shared/enums/common.enum';
import { SongColumnTypes } from './../../shared/enums/song/song.enum';
import { PaginatedSongInput } from './../../shared/song/dto/paginated-song.input';

import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Song, SongSearchInput } from '../../shared/song/dto';
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
      select: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
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

    const input = { page: 1, pageSize: 10 } as PaginatedSongInput;
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
      const input = { page: 1, pageSize: 10 } as PaginatedSongInput;
      await service.getAllSongs(input);
    } catch (error) {
      expect(error.message).toBe('ECONNREFUSED');
    }
  });

  it('should handle database error', async () => {
    mockQueryBuilder.getManyAndCount.mockRejectedValue(
      new Error('Database error'),
    );

    try {
      const input = { page: 1, pageSize: 10 } as PaginatedSongInput;
      await service.getAllSongs(input);
    } catch (error) {
      expect(error.message).toBe('Database error');
    }
  });

  describe('validateReleaseDate', () => {
    it('should throw BadRequestException if release year is before 2006', () => {
      const search: SongSearchInput[] = [
        {
          column: SongColumnTypes.RELEASE_YEAR,
          term: '2005',
        },
      ];

      expect(() => service['validateReleaseDate'](search)).toThrow(
        new BadRequestException(
          'Invalid query: Songs from the year 2005 are not available as Taylor swift first song came in the Year 2006. Please query for songs released on or after 2006.',
        ),
      );
    });

    it('should not throw an error if release year is 2006 or later', () => {
      const search: SongSearchInput[] = [
        {
          column: SongColumnTypes.RELEASE_YEAR,
          term: '2006',
        },
      ];

      expect(() => service['validateReleaseDate'](search)).not.toThrow();
    });
  });

  describe('getTopSongs', () => {
    it('should call the correct queryBuilder methods', async () => {
      await service.getTopSongs(8, 2023, 10);

      expect(mockQueryBuilder.select).toHaveBeenCalledWith([
        's."songName"',
        's."artist"',
        's."album"',
        's."releaseYear"',
        's."writers"',
        'SUM(p."playCount")::integer as "playCount"',
      ]);
      expect(mockQueryBuilder.innerJoin).toHaveBeenCalledWith(
        'plays',
        'p',
        'p."songId" = s.id',
      );
      expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith('s.id');
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        '"playCount"',
        'DESC',
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'p."playMonth" = :month AND p."playYear" = :year',
        {
          month: 8,
          year: 2023,
        },
      );
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.getRawMany).toHaveBeenCalled();
    });

    it('should handle year only filter', async () => {
      await service.getTopSongs(undefined, 2023, 10);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'p."playYear" = :year',
        { year: 2023 },
      );
    });
  });
});
