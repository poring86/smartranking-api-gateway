import { Module } from '@nestjs/common';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { CategoriaController } from './categoria.controller';

@Module({
  imports: [ProxyRMQModule],
  controllers: [CategoriaController],
})
export class CategoriaModule {}
