import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { ClientProxySmartRanking } from './proxyrmq/client-proxy';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import { DesafiosController } from './desafios/desafios.controller';
import { DesafiosService } from './desafios/desafios.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JogadoresModule,
    CategoriasModule,
    ProxyRMQModule,
    AwsModule,
  ],
  controllers: [DesafiosController],
  providers: [ClientProxySmartRanking, DesafiosService],
})
export class AppModule {}
