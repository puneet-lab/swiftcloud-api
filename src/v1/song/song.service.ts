import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PaginatedSongInput,
  PaginatedSongResponse,
  SongSearchInput,
} from '../../shared/song/dto';
import { Song } from '../../shared/song/dto/song.entity';
import {
  applySearchCriteria,
  applySortCriteria,
} from '../../shared/song/helper/song.helper';
import { SongColumnTypes } from './../../shared/enums/song/song.enum';
import { TopSongDTO } from './../../shared/song/dto/top-songs.response.dto';

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

    const queryBuilder = this.songRepository.createQueryBuilder('song');

    search?.length && this.validateReleaseDate(search);

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
  ): Promise<TopSongDTO[]> {
    const queryBuilder = this.songRepository.createQueryBuilder('s');
    this.buildBaseQuery(queryBuilder);
    this.applyDateFilter(queryBuilder, month, year);
    this.applyLimit(queryBuilder, limit);

    const topSongs = await queryBuilder.getRawMany();
    return topSongs;
  }

  private buildBaseQuery(queryBuilder): void {
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

  private validateReleaseDate(search: SongSearchInput[]): void {
    for (const { column, term } of search) {
      if (column === SongColumnTypes.RELEASE_YEAR && +term < 2006) {
        throw new BadRequestException(
          `Invalid query: Songs from the year ${term} are not available as Taylor swift first song came in the Year 2006. Please query for songs released on or after 2006.`,
        );
      }
    }
  }
}
