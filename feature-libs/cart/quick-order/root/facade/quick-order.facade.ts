import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { facadeFactory, OrderEntry, Product } from '@spartacus/core';
import { QUICK_ORDER_CORE_FEATURE } from '../feature-name';

export function quickOrderFacadeFactory() {
  return facadeFactory({
    facade: QuickOrderFacade,
    feature: QUICK_ORDER_CORE_FEATURE,
    methods: [
      'getEntries',
      'search',
      'clearList',
      'loadEntries',
      'updateEntryQuantity',
      'removeEntry',
      'addProduct',
      'getProductAdded',
      'setProductAdded',
    ],
  });
}

@Injectable({
  providedIn: 'root',
  useFactory: quickOrderFacadeFactory,
})
export abstract class QuickOrderFacade {
  /**
   * Get entries
   */
  abstract getEntries(): BehaviorSubject<OrderEntry[]>;

  /**
   * Search product using sku
   */
  abstract search(productCode: string): Observable<Product>;

  /**
   * Clear a list of added entries
   */
  abstract clearList(): void;

  /**
   * Load a list of entries
   */
  abstract loadEntries(entries: OrderEntry[]): void;

  /**
   * Load a list of entries
   */
  abstract updateEntryQuantity(entryIndex: number, quantity: number): void;

  /**
   * Remove single entry from the list
   */
  abstract removeEntry(index: number): void;

  /**
   * Add product to the quick order list
   */
  abstract addProduct(product: Product): void;

  /**
   * Return product added subject
   */
  abstract getProductAdded(): Subject<void>;

  /**
   * Set product added subject
   */
  abstract setProductAdded(): void;
}
