export interface Page<T> {
  item: T;
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
