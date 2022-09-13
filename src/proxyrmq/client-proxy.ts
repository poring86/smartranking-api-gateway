import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientProxySmartRanking {
  constructor(private configService: ConfigService) {}
  getClientProxyAdminBackendInstance(): ClientProxy {
    const rmqUser = this.configService.get<string>('RMQ_USER');
    const rmqPassword = this.configService.get<string>('RMQ_PASSWORD');
    const rmqUrl = this.configService.get<string>('RMQ_URL');

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${rmqUser}:${rmqPassword}@${rmqUrl}`],
        queue: 'admin-backend',
      },
    });
  }
}
