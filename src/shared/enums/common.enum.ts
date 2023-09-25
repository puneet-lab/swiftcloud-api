import { registerEnumType } from '@nestjs/graphql';

export enum SortOrderTypes {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(SortOrderTypes, {
  name: 'SortOrderTypes',
  description: 'Sort order enumeration (ASC, DESC)',
});
