import { ApiProperty } from '@nestjs/swagger';
import { Pagination } from '../pagination.interface';

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Pagination metadata',
    type: () => ({
      currentPage: { type: 'number' },
      totalPage: { type: 'number' },
      totalItems: { type: 'number' },
      perpage: { type: 'number' },
    }),
  })
  pagination: Pagination;

  @ApiProperty({
    description: 'Paginated data items',
    isArray: true,
  })
  items: T[]; // i want type of items is T[] in swagger  for now not
}

export class WrappedResponseDto<T> {
  @ApiProperty({
    description: 'Wrapped response data',
    type: () => PaginatedResponseDto,
  })
  data: {
    pagination: Pagination;
    [key: string]: T[] | Pagination;
  };
}
