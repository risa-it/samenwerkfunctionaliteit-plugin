import {
  Component,
  inject,
  input,
  InputSignal,
  signal,
  WritableSignal,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  ButtonModule,
  IconModule,
  PaginationModule,
  TableHeaderItem,
  TableItem,
  TableModel,
  TableModule,
} from 'carbon-components-angular';
import { Document } from '../../../../models/document.model';

@Component({
  selector: 'document-table-light',
  imports: [ButtonModule, IconModule, PaginationModule, TableModule],
  templateUrl: './document-table-light.component.html',
  styleUrl: './document-table-light.component.scss',
})
export class DocumentTableLightComponent {
  private readonly translateService: TranslateService =
    inject(TranslateService);

  documents: InputSignal<Document[]> = input<Document[]>([]);
  isSkeleton: InputSignal<boolean> = input<boolean>(true);
  model: WritableSignal<TableModel> = signal(new TableModel());

  striped: boolean = false;
  showSelectionColumn: boolean = false;

  ngOnInit(): void {
    this.setTableModelHeaders();
    this.selectPage(1);
  }

  protected selectPage(page: number): void {
    this.model.update((model: TableModel): TableModel => {
      model.data = this.getTableItems(page);
      model.currentPage = page;
      return model;
    });
  }

  private getTableItems(page: number): TableItem[][] {
    const documents: Document[] = this.documents();
    const startIndex: number = (page - 1) * this.model().pageLength;
    const endIndex: number = Math.min(
      page * this.model().pageLength,
      this.model().totalDataLength,
    );

    const pageDocuments: Document[] = documents.slice(startIndex, endIndex);

    return pageDocuments.map((document: Document): TableItem[] => [
      new TableItem({ data: document.filename }),
      new TableItem({
        data: new Date(document.creationDate).toLocaleDateString(),
      }),
    ]);
  }

  private setTableModelHeaders(): void {
    this.model.update((model: TableModel): TableModel => {
      model.pageLength = 20;
      model.totalDataLength = this.documents().length;
      model.header = this.createTableHeadersForTableModel();

      return model;
    });
  }

  private createTableHeadersForTableModel(): TableHeaderItem[] {
    return [
      new TableHeaderItem({
        data: this.translateService.instant(
          'samenwerkfunctionaliteit.documentTable.fileName',
        ),
      }),
      new TableHeaderItem({
        data: this.translateService.instant(
          'samenwerkfunctionaliteit.documentTable.dateCreated',
        ),
      }),
    ];
  }
}
