import { Module } from '@nestjs/common';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { DesafiosController } from './desafios.controller';
import { DesafiosService } from './desafios.service';

@Module({
  imports: [ProxyRMQModule],
  controllers: [DesafiosController],
  providers: [DesafiosService],
})
export class DesafiosModule {}
