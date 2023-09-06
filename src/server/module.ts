import { ServerModule } from '@roxavn/core/server';

import { baseModule } from '../base/index.js';
import * as entities from './entities/index.js';
import * as migrations from './migrations/index.js';

export const serverModule = ServerModule.fromBase(baseModule, {
  entities,
  migrations,
});
