import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedSongInput, PaginatedSongResponse } from 'src/shared/song/dto';
import { Repository } from 'typeorm';
import { Song } from '../../shared/song/dto/song.entity';
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
}
