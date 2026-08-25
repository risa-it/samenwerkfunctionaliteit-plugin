import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { ButtonModule, IconModule } from 'carbon-components-angular';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'swf-pagination',
  templateUrl: './swf-pagination.component.html',
  styleUrl: './swf-pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconModule, ButtonModule, FormsModule, TranslatePipe],
})
export class PaginationComponent {
  readonly page = input(1);
  readonly pageSize = input(10);
  readonly totalItems = input(0);
  readonly itemsPerPageOptions = signal<number[]>([10, 25, 50]);

  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  readonly totalPages = computed(() => {
    return Math.ceil(this.totalItems() / this.pageSize());
  });

  readonly totalPagesOptions = computed(() => {
    const totalPages = this.totalPages();

    return Array.from({ length: totalPages }, (_, i) => i + 1);
  });

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

  readonly pluralItem = 'common.pagination.items';
  readonly singleItem = 'common.pagination.item';
  readonly pluralPages = "common.pagination.pagina's";
  readonly singlePage = 'common.pagination.pagina';

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
