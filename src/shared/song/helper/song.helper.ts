import { SelectQueryBuilder } from 'typeorm';
import { SortOrderTypes } from '../../enums/common.enum';
import { Song, SongSearchInput, SongSortInput } from '../dto';
import { SongColumnTypes } from './../../enums/song/song.enum';

export function applySearchCriteria(
  queryBuilder: SelectQueryBuilder<Song>,
  search?: SongSearchInput[],
): void {
  if (!search) return;
  search.forEach(({ column, term }) => {
    const condition =
      column === SongColumnTypes.RELEASE_YEAR
        ? `song."${column}" = :term`
        : `song."${column}" ILIKE :term`;
    const parameters = {
      term: column === SongColumnTypes.RELEASE_YEAR ? +term : `%${term}%`,
    };
    queryBuilder.orWhere(condition, parameters);
  });
}

export function applySortCriteria(
  queryBuilder: SelectQueryBuilder<Song>,
  sort?: SongSortInput[],
): void {
  if (!sort) return;
  sort.forEach((sortInput) => {
    const order =
      sortInput.order === SortOrderTypes.ASC
        ? SortOrderTypes.ASC
        : SortOrderTypes.DESC;
    const column = `"${sortInput.column}"`;
    queryBuilder.addOrderBy(column, order);
  });
}
