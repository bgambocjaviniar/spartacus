/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

globalThis.ngJest = {
  testEnvironmentOptions: {
    teardown: {
      destroyAfterEach: false,
    },
  },
};

import 'jest-preset-angular/setup-jest';
