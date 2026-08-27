import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ButtonModule, IconModule } from 'carbon-components-angular';

@Component({
  selector: 'swf-pagination',
  templateUrl: './swf-pagination.component.html',
  styleUrl: './swf-pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconModule, ButtonModule, FormsModule],
})
export class PaginationComponent {
  private readonly translateService: TranslateService =
    inject(TranslateService);
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly totalItems = input.required<number>();

  readonly itemSingleTranslateKey = input(
    'samenwerkfunctionaliteit.common.pagination.defaults.item.single',
  );
  readonly itemPluralTranslateKey = input(
    'samenwerkfunctionaliteit.common.pagination.defaults.item.plural',
  );
  readonly pageSingleTranslateKey = input(
    'samenwerkfunctionaliteit.common.pagination.defaults.page.single',
  );
  readonly pagePluralTranslateKey = input(
    'samenwerkfunctionaliteit.common.pagination.defaults.page.plural',
  );

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
