import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'swf-notification-pagination',
  standalone: true,
  templateUrl: './swf-notification-pagination.component.html',
  styleUrl: './swf-notification-pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  readonly page = input(1);
  readonly pageSize = input(10);
  readonly totalItems = input(0);

  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  readonly totalPages = computed(() =>
    Math.ceil(this.totalItems() / this.pageSize()),
  );

  readonly canGoPrevious = computed(() => this.page() > 1);

  readonly canGoNext = computed(() => this.page() < this.totalPages());

  readonly pageStart = computed(() => {
    if (this.totalItems() === 0) {
      return 0;
    }

    return (this.page() - 1) * this.pageSize() + 1;
  });

  readonly pageEnd = computed(() =>
    Math.min(this.page() * this.pageSize(), this.totalItems()),
  );

  previousPage(): void {
    if (this.canGoPrevious()) {
      this.pageChange.emit(this.page() - 1);
    }
  }

  nextPage(): void {
    if (this.canGoNext()) {
      this.pageChange.emit(this.page() + 1);
    }
  }

  selectPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }

  selectPageSize(pageSize: number): void {
    this.pageSizeChange.emit(pageSize);
  }
}
