import { registerEnumType } from '@nestjs/graphql';

export enum SongColumnTypes {
  SONG_NAME = 'songName',
  ARTIST = 'artist',
  ALBUM = 'album',
  RELEASE_YEAR = 'releaseYear',
  WRITERS = 'writers',
  PLAY_COUNT = 'playCount',
}

registerEnumType(SongColumnTypes, {
  name: 'SongColumnTypes',
  description:
    'Columns that can be used for search and sort operations, "PLAY_COUNT" column is used to sort only',
});
