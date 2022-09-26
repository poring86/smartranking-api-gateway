import { Injectable } from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}
  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  criarCategoria(criarCategoriaDto: CriarCategoriaDto) {
    this.clientAdminBackend.emit('criar-categoria', criarCategoriaDto);
  }

  async consultarCategorias(_id: string): Promise<Categoria[] | Categoria> {
    return await this.clientAdminBackend
      .send('consultar-categorias', _id ? _id : '')
      .toPromise();
  }

  atualizarCategoria(
    atualizarCategoriaDto: AtualizarCategoriaDto,
    _id: string,
  ) {
    this.clientAdminBackend.emit('atualizar-categoria', {
      id: _id,
      categoria: atualizarCategoriaDto,
    });
  }
}
