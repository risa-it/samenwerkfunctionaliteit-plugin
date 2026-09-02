import { TranslateService } from '@ngx-translate/core';

export function getPaginationTranslations(
  translateService: TranslateService,
  itemNameSingular: string = 'item',
  itemNamePlural: string = 'items',
) {
  return {
    ITEMS_PER_PAGE: translateService.instant('carbon.pagination.itemsPerPage', {
      itemNamePlural,
    }),
    OPEN_LIST_OF_OPTIONS: translateService.instant(
      'carbon.pagination.openListOfOptions',
    ),
    BACKWARD: translateService.instant('carbon.pagination.previousPage'),
    FORWARD: translateService.instant('carbon.pagination.nextPage'),
    TOTAL_ITEMS_UNKNOWN: translateService.instant(
      'carbon.pagination.totalItemsUnknown',
      { itemNamePlural },
    ),
    TOTAL_ITEMS: translateService.instant('carbon.pagination.totalItems', {
      itemNamePlural,
    }),
    TOTAL_ITEM: translateService.instant('carbon.pagination.totalItem', {
      itemNameSingular,
    }),
    OF_LAST_PAGES: translateService.instant('carbon.pagination.ofLastPages'),
    OF_LAST_PAGE: translateService.instant('carbon.pagination.ofLastPage'),
  };
}
