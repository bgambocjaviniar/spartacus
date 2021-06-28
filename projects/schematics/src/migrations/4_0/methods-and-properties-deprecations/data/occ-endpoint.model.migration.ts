import {
  SPARTACUS_CORE,
  TODO_SPARTACUS,
  OCC_ENDPOINT,
  BASE_SITES_FOR_CONFIG,
} from '../../../../shared/constants';
import { MethodPropertyDeprecation } from '../../../../shared/utils/file-utils';

// projects/core/src/occ/occ-models/occ-endpoints.model.ts
export const OCC_ENDPOINTS_MODEL_MIGRATION: MethodPropertyDeprecation[] = [
  {
    class: OCC_ENDPOINT,
    importPath: SPARTACUS_CORE,
    deprecatedNode: BASE_SITES_FOR_CONFIG,
    comment: `// ${TODO_SPARTACUS} Property '${BASE_SITES_FOR_CONFIG}' was removed. Please use 'baseSites' property instead.`,
  },
];
