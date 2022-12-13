/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

globalThis.ngJest = {
  testEnvironmentOptions: {
    teardown: {
      destroyAfterEach: true,
    },
  },
};

import 'jest-preset-angular/setup-jest';
import 'zone.js';
