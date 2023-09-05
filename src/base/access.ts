import { accessManager } from '@roxavn/core/base';

import { baseModule } from './module.js';

export const scopes = accessManager.makeScopes(baseModule, {
  Otp: { name: 'otp' },
});

export const permissions = accessManager.makePermissions(scopes, {});

export const roles = accessManager.makeRoles(scopes, permissions, {});
