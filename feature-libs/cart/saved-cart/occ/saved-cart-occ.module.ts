/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SavedCartAdapter } from '@spartacus/cart/saved-cart/core';
import { provideDefaultConfig } from '@spartacus/core';
import { OccSavedCartAdapter } from './adapters/occ-saved-cart.adapter';
import { defaultOccSavedCartConfig } from './config/default-occ-saved-cart-config';

@NgModule({
  imports: [CommonModule],
  providers: [
    provideDefaultConfig(defaultOccSavedCartConfig),
    {
      provide: SavedCartAdapter,
      useClass: OccSavedCartAdapter,
    },
  ],
})
export class SavedCartOccModule {}
