import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { ClientProxySmartRanking } from './proxyrmq/client-proxy';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import { DesafiosModule } from './desafios/desafios.module';
import { RankingsModule } from './rankings/rankings.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JogadoresModule,
    CategoriasModule,
    ProxyRMQModule,
    AwsModule,
    DesafiosModule,
    RankingsModule,
    AuthModule,
  ],
  providers: [ClientProxySmartRanking],
})
export class AppModule {}
