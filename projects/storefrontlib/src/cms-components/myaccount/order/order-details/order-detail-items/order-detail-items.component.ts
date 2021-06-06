import { Component, Inject, OnInit } from '@angular/core';
import {
  Consignment,
  Order,
  PromotionLocation,
  PromotionResult,
} from '@spartacus/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PromotionService } from '../../../../../shared/services/promotion/promotion.service';
import { OrderDetailsService } from '../order-details.service';
import { OrderPromotionService } from '../order-promotion.service';
import {
  cancelledValues,
  completedValues,
} from './order-consigned-entries/order-consigned-entries.model';

@Component({
  selector: 'cx-order-details-items',
  templateUrl: './order-detail-items.component.html',
})
export class OrderDetailItemsComponent implements OnInit {
  constructor(
    protected orderDetailsService: OrderDetailsService,
    @Inject(OrderPromotionService)
    protected promotionService: PromotionService
  ) {}

  promotionLocation: PromotionLocation = PromotionLocation.Order;
  order$: Observable<any> = this.orderDetailsService.getOrderDetails();
  orderPromotions$: Observable<PromotionResult[]>;
  others$: Observable<Consignment[]>;
  completed$: Observable<Consignment[]>;
  cancel$: Observable<Consignment[]>;

  ngOnInit() {
    this.orderPromotions$ = this.promotionService.getOrderPromotions();
    this.others$ = this.getOtherStatus(...completedValues, ...cancelledValues);
    this.completed$ = this.getExactStatus(completedValues);
    this.cancel$ = this.getExactStatus(cancelledValues);
  }

  getAllOrderEntryPromotions(
    order: Order
  ): { [key: number]: Observable<PromotionResult[]> } {
    return this.promotionService.getProductPromotionForAllEntries(order);
  }

  private getExactStatus(
    consignmentStatus: string[]
  ): Observable<Consignment[]> {
    return this.order$.pipe(
      map((order) => {
        if (Boolean(order.consignments)) {
          return order.consignments.filter((consignment) =>
            consignmentStatus.includes(consignment.status)
          );
        }
      })
    );
  }

  private getOtherStatus(
    ...consignmentStatus: string[]
  ): Observable<Consignment[]> {
    return this.order$.pipe(
      map((order) => {
        if (Boolean(order.consignments)) {
          return order.consignments.filter(
            (consignment) => !consignmentStatus.includes(consignment.status)
          );
        }
      })
    );
  }
}
