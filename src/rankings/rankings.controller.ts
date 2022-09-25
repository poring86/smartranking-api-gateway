import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';

@Controller('api/v1/rankings')
export class RankingsController {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private getClientProxyRankingsInstance =
    this.clientProxySmartRanking.getClientProxyRankingsInstance();

  @Get()
  consultarRankings(
    @Query('idCategoria') idCategoria: string,
    @Query('dataRef') dataRef: string,
  ) {
    if (!idCategoria) {
      throw new BadRequestException('O id da categoria é obrigatório!');
    }

    return this.getClientProxyRankingsInstance.send('consultar-rankings', {
      idCategoria: idCategoria,
      dataRef: dataRef ? dataRef : '',
    });
  }
}
