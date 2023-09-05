import { ApiSource, ExactProps, MinLength } from '@roxavn/core/base';

import { baseModule } from '../module.js';
import { scopes } from '../access.js';

const otpSource = new ApiSource<{
  id: string;
  subject: string;
  type: string;
  cooldown: number;
  retryCount: number;
  maxRetryCount: number;
  expiryDate: Date;
  createdDate: Date;
  updatedDate: Date;
}>([scopes.Otp], baseModule);

class CreateOtpRequest extends ExactProps<CreateOtpRequest> {
  @MinLength(1)
  public readonly subject: string;

  @MinLength(1)
  public readonly type: string;
}

export const otpApi = {
  create: otpSource.create<CreateOtpRequest, { id: string; cooldown: number }>({
    validator: CreateOtpRequest,
  }),
};
