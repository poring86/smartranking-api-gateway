import { Module } from '@nestjs/common';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { DesafiosController } from './desafios.controller';

@Module({
  imports: [ProxyRMQModule],
  controllers: [DesafiosController],
})
export class DesafiosModule {}
