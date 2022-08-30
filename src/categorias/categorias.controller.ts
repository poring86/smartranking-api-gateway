import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AtualizarCategoriaDto } from 'src/categorias/dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from 'src/categorias/dtos/criar-categoria.dto';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  criarCategoria(@Body() CriarCategoriaDto: CriarCategoriaDto) {
    console.log('CriarCategoriaDto', CriarCategoriaDto);
    this.clientAdminBackend.emit('criar-categoria', CriarCategoriaDto);
  }

  @Get()
  consultarCategorias(@Query('idCategoria') _id: string) {
    return this.clientAdminBackend.send('consultar-categorias', _id ? _id : '');
  }

  @Put('categorias/:_id')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
    @Param('_id') _id: string,
  ) {
    this.clientAdminBackend.emit('atualizar-categoria', {
      id: _id,
      categoria: atualizarCategoriaDto,
    });
  }
}
