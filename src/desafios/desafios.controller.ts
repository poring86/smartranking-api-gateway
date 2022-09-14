import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientDesafios =
    this.clientProxySmartRanking.getClientProxyDesafiosInstance();

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(@Body() criarDesafioDto: CriarDesafioDto) {
    const jogadores: Jogador[] = await this.clientAdminBackend
      .send('consultar-jogadores', '')
      .toPromise();

    criarDesafioDto.jogadores.map(async (jogadorDto) => {
      const jogadorFilter: Jogador[] = jogadores.filter((jogador) => jogador);

      if (jogadorFilter.length == 0) {
        throw new BadRequestException(
          `O id ${jogadorDto._id} não é um jogador!`,
        );
      }

      if (jogadorFilter[0].categoria != criarDesafioDto.categoria) {
        throw new BadRequestException(
          `O jogador ${jogadorFilter[0]._id} não faz parte da categoria informada!`,
        );
      }

      const solicitanteEhJogadorDaPartida: Jogador[] =
        criarDesafioDto.jogadores.filter(
          (jogador) => jogador._id == criarDesafioDto.solicitante,
        );
      if (solicitanteEhJogadorDaPartida.length == 0) {
        throw new BadRequestException(
          `O solicitante deve ser um jogador da partida!`,
        );
      }

      const categoria = await this.clientAdminBackend
        .send('consultar-categorias', criarDesafioDto.categoria)
        .toPromise();
      if (!categoria) {
        throw new BadRequestException(`Categoria informada não existe!`);
      }

      await this.clientDesafios.emit('criar-desafio', criarDesafioDto);
    });
  }
}
