import { registerEnumType } from '@nestjs/graphql';

export enum SortOrderTypes {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum Month {
  January = 1,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December,
}

registerEnumType(SortOrderTypes, {
  name: 'SortOrderTypes',
  description: 'Sort order enumeration (ASC, DESC)',
});

registerEnumType(Month, {
  name: 'Month',
  description: 'Months of the year',
});
