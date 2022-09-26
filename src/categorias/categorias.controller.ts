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
import { CategoriasService } from './categorias.service';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private categoriasService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  criarCategoria(@Body() criarCategoriaDto: CriarCategoriaDto) {
    this.categoriasService.criarCategoria(criarCategoriaDto);
  }

  @Get()
  async consultarCategorias(@Query('idCategoria') _id: string) {
    return await this.categoriasService.consultarCategorias(_id);
  }

  @Put('categorias/:_id')
  @UsePipes(ValidationPipe)
  atualizarCategoria(
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
    @Param('_id') _id: string,
  ) {
    this.categoriasService.atualizarCategoria(atualizarCategoriaDto, _id);
  }
}
