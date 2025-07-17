export interface PaginatedApiResponse<T> {
  data: T;
  links: {
    first: string;
    last: null;
    prev?: string;
    next?: string;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    from?: number;
    to?: number;
    total: number;
  };
}
