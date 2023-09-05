import {
  BadRequestException,
  InferApiRequest,
  NotFoundException,
} from '@roxavn/core/base';
import {
  BaseService,
  DatabaseService,
  inject,
  serviceContainer,
} from '@roxavn/core/server';
import { TokenService } from '@roxavn/module-utils/server';

import { otpApi } from '../../base/index.js';
import { Otp } from '../entities/index.js';
import { serverModule } from '../module.js';

export interface OtpSenderService {
  handle: () => {
    otp: string;
    cooldown: number;
    duration: number;
    maxRetryCount: number;
  };
}

@serverModule.useApi(otpApi.create)
export class CreateOtpApiService extends BaseService {
  static senders: Record<string, new (...args: any[]) => OtpSenderService> = {};

  constructor(
    @inject(DatabaseService) protected databaseService: DatabaseService,
    @inject(TokenService) protected tokenService: TokenService
  ) {
    super();
  }

  async handle(request: InferApiRequest<typeof otpApi.create>) {
    let item = await this.databaseService.manager.getRepository(Otp).findOne({
      where: { subject: request.subject, type: request.type },
    });
    if (!item) {
      item = new Otp();
      item.subject = request.subject;
      item.type = request.type;
    } else {
      if (item.updatedDate.getTime() + item.cooldown > Date.now()) {
        throw new BadRequestException();
      }
    }

    const sender = CreateOtpApiService.senders[request.type];
    if (!sender) {
      throw new NotFoundException();
    }
    const senderService: OtpSenderService =
      await serviceContainer.getAsync(sender);
    const result = await senderService.handle();

    item.hash = await this.tokenService.hasher.hash(result.otp);
    item.expiryDate = new Date(Date.now() + result.duration);
    item.cooldown = result.cooldown;
    item.maxRetryCount = result.maxRetryCount;
    this.databaseService.manager.save(item);

    return { id: item.id, cooldown: result.cooldown };
  }
}
