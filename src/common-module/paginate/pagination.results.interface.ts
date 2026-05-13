export interface PaginationResultInterface<PaginationEntity> {
  results: PaginationEntity[];
  paginationInfo: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
    prevPage: number;
    nextPage: number;
  };
}
