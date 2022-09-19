import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { DesafioStatus } from './desafio-status.enum';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';
import { Partida } from './interfaces/partida.interface';
import { DesafioStatusValidacaoPipe } from './pipes/desafio-status-validation-pipe';

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
    });

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

    this.clientDesafios.emit('criar-desafio', criarDesafioDto);
  }

  @Get()
  async consultarDesafios(
    @Query('idJogador') idJogador: string,
  ): Promise<Desafio> {
    if (idJogador) {
      const jogador: Jogador = await this.clientAdminBackend
        .send('consultar-jogadores', idJogador)
        .toPromise();
      if (!jogador) {
        throw new BadRequestException(`Jogador não cadastrado!`);
      }
    }
    return this.clientDesafios
      .send('consultar-desafios', { idJogador: idJogador, _id: '' })
      .toPromise();
  }

  @Put('/:desafio')
  async atualizarDesafio(
    @Body(DesafioStatusValidacaoPipe) atualizarDesafioDto: AtualizarDesafioDto,
    @Param('desafio') _id: string,
  ) {
    const desafio: Desafio = await this.clientDesafios
      .send('consultar-desafios', { idJogador: '', _id: _id })
      .toPromise();

    if (!desafio) {
      throw new BadRequestException(`Desafio não cadastrado!`);
    }
    if (desafio.status != DesafioStatus.PENDENTE) {
      throw new BadRequestException(
        'Somente desafios com status PENDENTE podem ser atualizados!',
      );
    }

    this.clientDesafios.emit('atualizar-desafio', {
      id: _id,
      desafio: atualizarDesafioDto,
    });
  }

  @Post('/:desafio/partida/')
  async atribuirDesafioPartida(
    @Body(ValidationPipe) atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
    @Param('desafio') _id: string,
  ) {
    const desafio: Desafio = await this.clientDesafios
      .send('consultar-desafios', { idJogador: '', _id: _id })
      .toPromise();

    console.log(`desafio: ${JSON.stringify(desafio)}`);
    if (!desafio) {
      throw new BadRequestException(`Desafio não cadastrado!`);
    }

    if (desafio.status == DesafioStatus.REALIZADO) {
      throw new BadRequestException(`Desafio já realizado!`);
    }

    if (desafio.status != DesafioStatus.ACEITO) {
      throw new BadRequestException(
        `Partidas somente podem ser lançadas em desafios aceitos pelos adversários!`,
      );
    }
    if (!desafio.jogadores.includes(atribuirDesafioPartidaDto.def)) {
      throw new BadRequestException(
        `O jogador vencedor da partida deve fazer parte do desafio!`,
      );
    }
    const partida: Partida = {};
    partida.categoria = desafio.categoria;
    partida.def = atribuirDesafioPartidaDto.def;
    partida.desafio = _id;
    partida.jogadores = desafio.jogadores;
    partida.resultado = atribuirDesafioPartidaDto.resultado;

    this.clientDesafios.emit('criar-partida', partida);
  }

  @Delete('/:_id')
  async deletarDesafio(@Param('_id') _id: string) {
    const desafio: Desafio = await this.clientDesafios
      .send('consultar-desafios', { idJogador: '', _id: _id })
      .toPromise();

    console.log(`desafio: ${JSON.stringify(desafio)}`);

    if (!desafio) {
      throw new BadRequestException(`Desafio não cadastrado!`);
    }

    this.clientDesafios.emit('deletar-desafio', desafio);
  }
}
