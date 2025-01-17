/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSelector, MemoizedSelector } from '@ngrx/store';
import { ConsignmentTracking } from '@spartacus/order/root';
import {
  ConsignmentTrackingState,
  OrderState,
  StateWithOrder,
} from '../order-state';
import { getOrderState } from './feature.selector';

export const getConsignmentTrackingState: MemoizedSelector<
  StateWithOrder,
  ConsignmentTrackingState
> = createSelector(
  getOrderState,
  (state: OrderState) => state.consignmentTracking
);

export const getConsignmentTracking: MemoizedSelector<
  StateWithOrder,
  ConsignmentTracking
> = createSelector(
  getConsignmentTrackingState,
  (state: ConsignmentTrackingState) => state.tracking
);
