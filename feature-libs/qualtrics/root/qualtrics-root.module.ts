/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CmsConfig, provideDefaultConfigFactory } from '@spartacus/core';
import { QUALTRICS_FEATURE } from './feature-name';

// TODO: Inline this factory when we start releasing Ivy compiled libraries
export function defaultQualtricsComponentsConfig(): CmsConfig {
  const config: CmsConfig = {
    featureModules: {
      [QUALTRICS_FEATURE]: {
        cmsComponents: ['QualtricsComponent'],
      },
    },
  };

  return config;
}

@NgModule({
  providers: [provideDefaultConfigFactory(defaultQualtricsComponentsConfig)],
})
export class QualtricsRootModule {}
