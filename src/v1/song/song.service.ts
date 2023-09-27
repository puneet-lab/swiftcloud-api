import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SongColumnTypes } from '../../shared/enums/song/song.enum';
import {
  PaginatedSongInput,
  PaginatedSongPlayResponse,
  PaginatedSongResponse,
  Song,
  SongPlayCountDTO,
  SongSearchInput,
} from '../../shared/song/dto';
import {
  applySearchCriteria,
  applySortCriteria,
} from '../../shared/song/helper/song.helper';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  async getAllSongs(
    paginatedSongsInput: PaginatedSongInput,
  ): Promise<PaginatedSongResponse> {
    const { page, pageSize, search, sort } = paginatedSongsInput || {};

    const skip = (page - 1) * pageSize;

    if (search?.length) {
      this.validateReleaseDate(search);
      this.validatePlayCountColumn(search);
    }

    const queryBuilder = this.songRepository.createQueryBuilder('song');

    applySearchCriteria(queryBuilder, search);
    applySortCriteria(queryBuilder, sort);

    const [songs, total] = await queryBuilder
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    const pages = Math.ceil(total / pageSize);

    return {
      songs,
      total,
      page,
      pages,
    };
  }

  async getTopSongs(
    month?: number,
    year?: number,
    limit: number = 10,
  ): Promise<SongPlayCountDTO[]> {
    const queryBuilder = this.songRepository.createQueryBuilder('s');
    this.buildTopSongsBaseQuery(queryBuilder);
    this.applyDateFilter(queryBuilder, month, year);
    this.applyLimit(queryBuilder, limit);

    const topSongs = await queryBuilder.getRawMany();
    return topSongs;
  }

  async getUserSongs(
    paginatedSongsInput: PaginatedSongInput,
    userId: string,
  ): Promise<PaginatedSongPlayResponse> {
    const { page, pageSize, search, sort } = paginatedSongsInput;
    const skip = (page - 1) * pageSize;

    if (search?.length) {
      this.validateReleaseDate(search);
      this.validatePlayCountColumn(search);
    }

    const queryBuilder = this.createGetUserSongsQueryBuilder(userId);

    applySearchCriteria(queryBuilder, search);
    applySortCriteria(queryBuilder, sort);

    const total = await this.getTotalCount(queryBuilder);

    const songsWithPlayCount = await this.getSongsWithPlayCount(
      queryBuilder,
      skip,
      pageSize,
    );

    const pages = Math.ceil(total / pageSize);

    return {
      songs: songsWithPlayCount,
      total,
      page,
      pages,
    };
  }

  async getUserTopSongs(
    userId: string,
    month?: number,
    year?: number,
    limit: number = 10,
  ): Promise<SongPlayCountDTO[]> {
    const queryBuilder = this.createGetUserSongsQueryBuilder(userId);
    this.applyDateFilter(queryBuilder, month, year);
    this.applyLimit(queryBuilder, limit);

    const topSongs = await queryBuilder.getRawMany();
    return topSongs;
  }

  private createGetUserSongsQueryBuilder(userId: string) {
    return this.songRepository
      .createQueryBuilder('s')
      .select([
        's."songName"',
        's."artist"',
        's."album"',
        's."writers"',
        's."releaseYear"',
        'SUM(p."playCount") as "playCount"',
      ])
      .innerJoin('plays', 'p', 'p."songId" = s.id AND p."userId" = :userId', {
        userId,
      })
      .groupBy('s.id');
  }

  private buildTopSongsBaseQuery(queryBuilder): void {
    queryBuilder
      .select([
        's."songName"',
        's."artist"',
        's."album"',
        's."releaseYear"',
        's."writers"',
        'SUM(p."playCount")::integer as "playCount"',
      ])
      .innerJoin('plays', 'p', 'p."songId" = s.id')
      .groupBy('s.id')
      .orderBy('"playCount"', 'DESC');
  }

  private createTopUserSongsQueryBuilder(userId: string) {
    return this.songRepository
      .createQueryBuilder('s')
      .select([
        's."songName"',
        's."artist"',
        's."album"',
        's."writers"',
        's."releaseYear"',
        'SUM(p."playCount") as "playCount"',
      ])
      .innerJoin('plays', 'p', 'p."songId" = s.id AND p."userId" = :userId', {
        userId,
      })
      .groupBy('s.id')
      .orderBy('"playCount"', 'DESC');
  }

  private applyDateFilter(queryBuilder, month?: number, year?: number): void {
    if (year && month) {
      queryBuilder.andWhere('p."playMonth" = :month AND p."playYear" = :year', {
        month,
        year,
      });
    } else if (year) {
      queryBuilder.andWhere('p."playYear" = :year', { year });
    }
  }

  private applyLimit(queryBuilder, limit: number): void {
    queryBuilder.limit(limit);
  }

  private async getTotalCount(queryBuilder: any) {
    return await queryBuilder.getCount();
  }

  private validateReleaseDate(search: SongSearchInput[]): void {
    for (const { column, term } of search) {
      if (column === SongColumnTypes.RELEASE_YEAR && +term < 2006) {
        throw new BadRequestException(
          `Invalid query: Songs from the year ${term} are not available as Taylor swift first song came in the Year 2006. Please query for songs released on or after 2006.`,
        );
      }
    }
  }

  private validatePlayCountColumn(search: SongSearchInput[]): void {
    for (const { column } of search) {
      if (column === SongColumnTypes.PLAY_COUNT) {
        throw new BadRequestException(
          `${column} is only be used for sorting, when play count is available `,
        );
      }
    }
  }

  private async getSongsWithPlayCount(
    queryBuilder: any,
    skip: number,
    pageSize: number,
  ) {
    return await queryBuilder.offset(skip).limit(pageSize).getRawMany();
  }
}
