import { PaginationResultInterface } from './pagination.results.interface';
export class Pagination<PaginationEntity> {
  public results: PaginationEntity[];

  public paginationInfo: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
    prevPage: number;
    nextPage: number;
  };

  constructor(paginationResults: PaginationResultInterface<PaginationEntity>) {
    this.results = paginationResults.results;
    this.paginationInfo = {
      current_page: paginationResults.paginationInfo.current_page,
      per_page: paginationResults.paginationInfo.per_page,
      total: paginationResults.paginationInfo.total,
      total_pages: paginationResults.paginationInfo.total_pages,
      prevPage: paginationResults.paginationInfo.prevPage,
      nextPage: paginationResults.paginationInfo.nextPage
    };
  }
}
