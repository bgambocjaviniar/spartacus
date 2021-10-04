import { Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { Cart } from '@spartacus/cart/main/root';
import { Order } from '@spartacus/core';
import { OutletContextData } from '@spartacus/storefront';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cx-order-summary',
  templateUrl: './order-summary.component.html',
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
  @Input()
  cart: Cart;

  protected subscription = new Subscription();

  constructor(@Optional() protected outlet?: OutletContextData<Cart | Order>) {}

  ngOnInit(): void {
    if (this.outlet?.context$) {
      this.subscription.add(
        this.outlet.context$.subscribe((context) => (this.cart = context))
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
